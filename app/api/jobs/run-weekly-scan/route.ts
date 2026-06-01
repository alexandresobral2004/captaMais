import { NextRequest, NextResponse } from 'next/server';
import { buscarEditaisPortais, filtrarComClassificador } from '@/lib/scraper/fetcher';
import { analisarEditalComIA } from '@/lib/ai/analyzer';
import { baixarELerPDFEdital, OpcoesDownload } from '@/lib/scraper/pdf-downloader';
import { extrairRelativePath } from '@/lib/scraper/utils/path-utils';
import { saveEdital, getAllEditais, Edital } from '@/lib/db/editais-store';
import { verificarAdmin } from '@/lib/api/auth';

/**
 * Verifica autenticação: aceita token de script OU cookie de admin
 */
async function verificarAutenticacao(request: NextRequest): Promise<{ ok: boolean; response?: NextResponse }> {
  // 1. Verificar token no query string (para scripts)
  const url = new URL(request.url);
  const tokenQuery = url.searchParams.get('token');
  
  if (tokenQuery) {
    if (tokenQuery !== process.env.SCAN_TOKEN) {
      return { ok: false, response: NextResponse.json({ error: 'Token inválido' }, { status: 401 }) };
    }
    return { ok: true };
  }

  // 2. Verificar token no body (para POST de scripts)
  try {
    const body = await request.clone().json().catch(() => ({}));
    const tokenBody = body.token;
    
    if (tokenBody) {
      if (tokenBody !== process.env.SCAN_TOKEN) {
        return { ok: false, response: NextResponse.json({ error: 'Token inválido' }, { status: 401 }) };
      }
      return { ok: true };
    }
  } catch {
    // Ignorar erro ao parsear body
  }

  // 3. Verificar cookie de admin (para acesso via UI)
  const auth = verificarAdmin(request);
  if (!auth.ok) {
    return { ok: false, response: auth.response };
  }

  return { ok: true };
}

export async function GET(request: NextRequest) {
  const auth = await verificarAutenticacao(request);
  if (!auth.ok) {
    return auth.response!;
  }

  return executarVarreduraSemanal();
}

export async function POST(request: NextRequest) {
  const auth = await verificarAutenticacao(request);
  if (!auth.ok) {
    return auth.response!;
  }

  return executarVarreduraSemanal();
}

/**
 * Executa a varredura semanal completa
 */
async function executarVarreduraSemanal() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 INICIANDO VARREDURA SEMANAL DE EDITAIS');
  console.log('='.repeat(70) + '\n');

  const tempoInicio = Date.now();
  let estatisticas = {
    portaisVaridos: 0,
    itensEncontrados: 0,
    editaisValidados: 0,
    editaisAnalisados: 0,
    editaisComErro: 0,
    notificacoesCriadas: 0,
    tempoMinutos: 0
  };

  try {
    // ============================================
    // FASE 1: BUSCAR EDITAIS NOS PORTAIS
    // ============================================
    console.log('📥 FASE 1: Buscando editais nos portais...\n');

    const itensEncontrados = await buscarEditaisPortais();
    estatisticas.itensEncontrados = itensEncontrados.length;

    console.log(`\n✅ Fase 1 concluída: ${itensEncontrados.length} itens encontrados nos portais\n`);

    // ============================================
    // FASE 2: CLASSIFICAR COM IA
    // ============================================
    console.log('🤖 FASE 2: Classificando itens com IA...\n');

    const editaisValidos = await filtrarComClassificador(itensEncontrados);
    estatisticas.editaisValidados = editaisValidos.length;

    console.log(`\n✅ ${editaisValidos.length} editais válidos após classificação\n`);

    if (editaisValidos.length === 0) {
      console.log('⚠️ Nenhum edital válido encontrado\n');
      return criarResposta(estatisticas, 'Nenhum edital válido encontrado');
    }

    // ============================================
    // FASE 3: BAIXAR E LER PDFs
    // ============================================
    console.log('📄 FASE 3: Baixando e lendo PDFs...\n');

    let editaisComPDF = 0;
    const editaisProcesar: Edital[] = [];

    for (const edital of editaisValidos) {
      try {
        // Preparar opções de download
        const opcoesDownload: OpcoesDownload = {
          pdfUrlS3: edital.pdfUrl,
          linkExterno: edital.link,
          descricaoHtml: edital.descricao
        };

        // Tentar baixar PDF
        const resultadoExtracao = await baixarELerPDFEdital(
          edital.id,
          opcoesDownload,
          edital.orgao,
          edital.titulo,
          edital.dataLimite
        );

        // Atualizar fonte
        edital.fonteConteudo = resultadoExtracao.fonte;

        // Se conseguiu conteúdo
        if (resultadoExtracao.fonte !== 'sem_pdf' && resultadoExtracao.texto) {
          editaisComPDF++;
          edital.conteudoCompleto = resultadoExtracao.texto;
          edital.pdfSalvoEm = extrairRelativePath(resultadoExtracao.caminhoArquivo);
          editaisProcesar.push(edital);
        } else {
          // Salvar sem PDF
          edital.statusAnalise = 'sem_pdf';
          await saveEdital(edital);
        }
      } catch (erro) {
        console.warn(`❌ Erro ao processar PDF [${edital.id}]:`, erro);
        edital.statusAnalise = 'erro';
        await saveEdital(edital);
      }
    }

    console.log(`\n✅ ${editaisComPDF} PDFs baixados com sucesso\n`);

    // ============================================
    // FASE 4: ANÁLISE COM IA
    // ============================================
    console.log('🧠 FASE 4: Analisando editais com IA...\n');

    for (const edital of editaisProcesar) {
      try {
        console.log(`  Analisando [${edital.id}]...`);
        const editalAnalisado = await analisarEditalComIA(edital.id, edital.conteudoCompleto, { modo: 'completo' });

        if (editalAnalisado) {
          estatisticas.editaisAnalisados++;
          editalAnalisado.statusRevisao = 'pendente'; // Aguardando revisão
          await saveEdital(editalAnalisado);
        }
      } catch (erro) {
        console.error(`  ❌ Erro ao analisar [${edital.id}]:`, erro);
        edital.statusAnalise = 'erro';
        await saveEdital(edital);
        estatisticas.editaisComErro++;
      }
    }

    console.log(`\n✅ ${estatisticas.editaisAnalisados} editais analisados\n`);

    // ============================================
    // FASE 5: CRIAR NOTIFICAÇÃO
    // ============================================
    console.log('🔔 FASE 5: Criando notificação...\n');

    if (estatisticas.editaisAnalisados > 0) {
      try {
        // Salvar notificação em arquivo
        const fs = await import('fs').then(m => m.default);
        const path_module = await import('path').then(m => m.default);
        const { v4: uuidv4 } = await import('uuid');

        const notificacaoId = uuidv4();
        const NOTIFICACOES_DIR = path_module.join(process.cwd(), 'data', 'notificacoes');
        
        if (!fs.existsSync(NOTIFICACOES_DIR)) {
          fs.mkdirSync(NOTIFICACOES_DIR, { recursive: true });
        }

        const notif = {
          id: notificacaoId,
          tipo: 'editais_novos',
          titulo: `${estatisticas.editaisAnalisados} novos editais disponíveis`,
          descricao: `Encontrados ${estatisticas.editaisAnalisados} editais aguardando revisão. Acesse o painel para analisar.`,
          quantidade: estatisticas.editaisAnalisados,
          link: '/editais?tab=review',
          urgencia: 'alta',
          lida: false,
          criadoEm: new Date()
        };

        const filePath = path_module.join(NOTIFICACOES_DIR, `${notif.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(notif, null, 2), 'utf-8');

        console.log(`✅ Notificação criada: ${notif.titulo}\n`);
        estatisticas.notificacoesCriadas++;
      } catch (erro) {
        console.error('Erro ao criar notificação:', erro);
      }
    }

    // ============================================
    // RESUMO FINAL
    // ============================================
    const tempoTotal = ((Date.now() - tempoInicio) / 60000).toFixed(2);
    estatisticas.tempoMinutos = parseFloat(tempoTotal);

    console.log('\n' + '='.repeat(70));
    console.log('✅ VARREDURA COMPLETADA COM SUCESSO');
    console.log('='.repeat(70));
    console.log(`📊 Estatísticas:`);
    console.log(`   • Itens encontrados: ${estatisticas.itensEncontrados}`);
    console.log(`   • Editais validados: ${estatisticas.editaisValidados}`);
    console.log(`   • Editais analisados: ${estatisticas.editaisAnalisados}`);
    console.log(`   • Erros: ${estatisticas.editaisComErro}`);
    console.log(`   • Notificações criadas: ${estatisticas.notificacoesCriadas}`);
    console.log(`   • Tempo: ${tempoTotal} minutos`);
    console.log('='.repeat(70) + '\n');

    return criarResposta(estatisticas, 'Varredura completada com sucesso');
  } catch (erro) {
    console.error('❌ ERRO NA VARREDURA:', erro);
    const tempoTotal = ((Date.now() - tempoInicio) / 60000).toFixed(2);
    estatisticas.tempoMinutos = parseFloat(tempoTotal);

    return NextResponse.json(
      {
        success: false,
        error: (erro as Error).message,
        estatisticas
      },
      { status: 500 }
    );
  }
}

/**
 * Helper para criar resposta padrão
 */
function criarResposta(estatisticas: any, mensagem: string) {
  return NextResponse.json({
    success: true,
    mensagem,
    estatisticas,
    timestamp: new Date().toISOString()
  });
}
