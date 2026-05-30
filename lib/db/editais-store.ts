import { runBackgroundWorker } from '../scraper/worker';
import { TecnologiaFoco, TipoFerramenta } from '../scraper/filtros-ti';
import { EditalRepository, CreateEditalDTO } from '../database/repositories/edital.repository';
import { AnaliseRepository, CreateAnaliseDTO } from '../database/repositories/analise.repository';
import { db } from '../database/db';
import { eq, or, gte, and } from 'drizzle-orm';
import { editais as editaisTable } from '../database/schema';

// ============================================================
// INICIALIZAÇÃO DO DAEMON (mantida)
// ============================================================
if (typeof window === 'undefined') {
  const globalAny: any = globalThis;
  if (!globalAny.__editalWorkerStarted) {
    globalAny.__editalWorkerStarted = true;
    console.log('⚙️ Inicializando Daemon de Busca de Editais em Segundo Plano...');

    try {
      const { iniciarScheduler } = require('../jobs/scheduler');
      iniciarScheduler();
    } catch (erro) {
      console.warn('⚠️ Erro ao iniciar scheduler:', erro);
    }

    setTimeout(() => {
      runBackgroundWorker();
    }, 15000);

    setInterval(() => {
      runBackgroundWorker();
    }, 30 * 60 * 1000);
  }
}

// ============================================================
// INTERFACE EDITAL (mantida - backward compatibility)
// ============================================================
export interface Edital {
  id: string;
  titulo: string;
  orgao: string;

  valor: string;
  valorMin?: number;
  valorMax?: number;

  dataPublicacao?: string;
  dataLimite: string;
  dataResultado?: string;

  status: 'Aberto' | 'Prorrogado' | 'Em Análise' | 'Fechado';
  modalidade?: string;
  areasTematicas?: string[];
  abrangencia?: string;
  tipoProponente?: string[];

  descricao: string;
  link: string;
  pdfUrl?: string;
  pdfSalvoEm?: string;
  conteudoCompleto?: string;

  arquivosAnexos?: {
    descricao: string;
    url: string;
    tipo: string;
  }[];

  fonteConteudo?: 'pdf_s3' | 'pdf_link' | 'html_link' | 'descricao_api' | 'mock' | 'sem_pdf';

  tecnologiaFoco?: TecnologiaFoco;
  tipoFerramenta?: TipoFerramenta;
  scoreRelevancia?: number;
  scoreConfiancaIA?: number;
  validadoPorIA?: boolean;
  palavrasChaveEncontradas?: string[];
  motivoRejeicao?: string;
  foraDoEscopo?: boolean;
  dataValidacaoIA?: string;
  scorePontuacao?: number;
  nivelPontuacao?: 'baixo' | 'medio' | 'alto';
  motivosPontuacao?: string[];
  modoAnaliseIA?: 'ignorar' | 'simplificado' | 'completo';
  hashPontuacao?: string;
  cacheClassificacaoUsado?: boolean;

  analiseIA?: {
    resumo: string;
    objetivo: string;
    requisitos: string[];
    elegibilidade: string;
    itensFinanciáveis: string[];
    documentosNecessarios: string[];
    criteriosAvaliacao: string[];
    contatoEdital?: string;
    pontosFracos?: string[];
    scoreAdequacao?: number;
  };

  statusAnalise?: 'pendente' | 'pdf_baixado' | 'analisado' | 'sem_pdf' | 'descartado' | 'erro';
  erroAnalise?: string;

  confiancaClassificacao?: number;
  confiancaPorCampo?: { [campo: string]: number };

  statusRevisao?: 'pendente' | 'aprovado' | 'rejeitado';
  ultimaAnalise?: Date;
  validadoManualmente?: boolean;
  aprovedoPor?: string;
  dataAprovacao?: Date;
  errosValidacao?: Array<{
    campo: string;
    tipo: 'ERRO' | 'AVISO';
    mensagem: string;
  }>;

  tipoEdital?: 'chamada_publica' | 'evento_cientifico' | 'outro';

  scoreValidacaoKeywords?: number;
  contadorPalavrasChave?: {
    mandatoryTerms?: number;
    likelyTerms?: number;
    academicTerms?: number;
    fundingTerms?: number;
    eligibilityTerms?: number;
    submissionTerms?: number;
    timelineTerms?: number;
    evaluationTerms?: number;
    negativeTerms?: number;
  };
  densidadeKeywords?: number;
  oportunidadesDetectadas?: string[];
  validacaoConteudoResultado?: 'aprovado' | 'rejeitado' | 'em_analise' | 'nao_validado';
  motiovoRejeicaoKeywords?: string;
  avisoValidacaoKeywords?: string[];

  dadosExtraidos?: {
    resumo?: string;
    objetivo?: string;
    datas?: {
      publicacao?: string;
      abertura?: string;
      encerramento?: string;
      resultado?: string;
    };
    financeiro?: {
      valorTotal?: string;
      valorMin?: number;
      valorMax?: number;
      moeda?: string;
      tipo?: string;
    };
    elegibilidade?: {
      tiposProponentes?: string[];
      requisitosMinimos?: string[];
      restricoes?: string[];
      abrangencia?: string;
    };
    cronograma?: string;
    confiancaExtracao?: number;
    metodosUsados?: string[];
  };

  criadoEm: string;
  atualizadoEm?: string;
}

// ============================================================
// UTILIDADES
// ============================================================
export function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;

  if (dateStr.includes('-')) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }

  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day, 23, 59, 59);
  }
  return null;
}

// ============================================================
// MAPEAMENTO: DB → Edital
// ============================================================
function dbToEdital(row: any, analise?: any): Edital {
  const edital: Edital = {
    id: row.id,
    titulo: row.titulo,
    orgao: row.orgao,
    valor: row.valor || '',
    valorMin: row.valorMin ?? undefined,
    valorMax: row.valorMax ?? undefined,
    dataPublicacao: row.dataPublicacao ?? undefined,
    dataLimite: row.dataLimite,
    dataResultado: row.dataResultado ?? undefined,
    status: (row.status || 'Aberto') as Edital['status'],
    modalidade: row.modalidade ?? undefined,
    areasTematicas: safeJsonParse(row.areasTematicas),
    abrangencia: row.abrangencia ?? undefined,
    tipoProponente: safeJsonParse(row.tipoProponente),
    descricao: row.descricao || '',
    link: row.link,
    pdfUrl: row.pdfUrl ?? undefined,
    pdfSalvoEm: row.pdfPath ?? undefined,
    conteudoCompleto: row.conteudoCompleto ?? undefined,
    arquivosAnexos: safeJsonParse(row.arquivosAnexos),
    fonteConteudo: row.fonteConteudo ?? undefined,
    tecnologiaFoco: row.tecnologiaFoco ?? undefined,
    tipoFerramenta: row.tipoFerramenta ?? undefined,
    scoreRelevancia: row.scoreRelevancia ?? undefined,
    scoreConfiancaIA: row.scoreConfiancaIa ?? undefined,
    validadoPorIA: row.validadoPorIa ?? undefined,
    motivoRejeicao: row.motivoRejeicao ?? undefined,
    foraDoEscopo: row.foraDoEscopo ?? undefined,
    dataValidacaoIA: row.dataValidacaoIa ?? undefined,
    scorePontuacao: row.scorePontuacao ?? undefined,
    nivelPontuacao: row.nivelPontuacao ?? undefined,
    motivosPontuacao: safeJsonParse(row.motivosPontuacao),
    modoAnaliseIA: row.modoAnaliseIa ?? undefined,
    hashPontuacao: row.hashPontuacao ?? undefined,
    cacheClassificacaoUsado: row.cacheClassificacaoUsado ?? undefined,
    confiancaPorCampo: safeJsonParse(row.confiancaPorCampo) ?? undefined,
    statusAnalise: row.statusAnalise ?? undefined,
    erroAnalise: row.erroAnalise ?? undefined,
    tipoEdital: row.tipoEdital ?? undefined,
    scoreValidacaoKeywords: row.scoreValidacaoKeywords ?? undefined,
    contadorPalavrasChave: row.contadorPalavrasChave ?? undefined,
    densidadeKeywords: row.densidadeKeywords ?? undefined,
    oportunidadesDetectadas: row.oportunidadesDetectadas ?? undefined,
    validacaoConteudoResultado: row.validacaoConteudoResultado ?? undefined,
    motiovoRejeicaoKeywords: row.motiovoRejeicaoKeywords ?? undefined,
    avisoValidacaoKeywords: row.avisoValidacaoKeywords ?? undefined,
    dadosExtraidos: row.dadosExtraidos ?? undefined,
    criadoEm: row.criadoEm || new Date().toISOString(),
    atualizadoEm: row.atualizadoEm ?? undefined,
  };

  // Mapear analiseIA do banco normalizado
  if (analise) {
    edital.analiseIA = {
      resumo: analise.resumo || '',
      objetivo: analise.objetivo || '',
      requisitos: analise.requisitos || [],
      elegibilidade: analise.elegibilidade || '',
      itensFinanciáveis: analise.itensFinanciaveis || [],
      documentosNecessarios: analise.documentosNecessarios || [],
      criteriosAvaliacao: analise.criteriosAvaliacao || [],
      contatoEdital: analise.contatoEdital ?? undefined,
      pontosFracos: analise.pontosFracos || [],
      scoreAdequacao: analise.scoreAdequacao ?? undefined,
    };
  }

  return edital;
}

function safeJsonParse(value: any): any {
  if (!value) return undefined;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }
  return value;
}

// ============================================================
// MAPEAMENTO: Edital → DB
// ============================================================
function editalToDb(edital: Partial<Edital>): CreateEditalDTO {
  return {
    id: edital.id!,
    titulo: edital.titulo || '',
    orgao: edital.orgao || '',
    valor: edital.valor,
    valorMin: edital.valorMin,
    valorMax: edital.valorMax,
    dataPublicacao: edital.dataPublicacao,
    dataLimite: edital.dataLimite || '',
    dataResultado: edital.dataResultado,
    status: edital.status,
    statusAnalise: edital.statusAnalise,
    modalidade: edital.modalidade,
    abrangencia: edital.abrangencia,
    tipoProponente: edital.tipoProponente,
    areasTematicas: edital.areasTematicas,
    tipoEdital: edital.tipoEdital,
    descricao: edital.descricao,
    link: edital.link || '',
    pdfUrl: edital.pdfUrl,
    pdfPath: edital.pdfSalvoEm,
    conteudoCompleto: edital.conteudoCompleto,
    fonteConteudo: edital.fonteConteudo,
    arquivosAnexos: edital.arquivosAnexos,
    tecnologiaFoco: edital.tecnologiaFoco,
    tipoFerramenta: edital.tipoFerramenta,
    scoreRelevancia: edital.scoreRelevancia,
    scoreConfiancaIa: edital.scoreConfiancaIA,
    validadoPorIa: edital.validadoPorIA,
    motivoRejeicao: edital.motivoRejeicao,
    foraDoEscopo: edital.foraDoEscopo,
    dataValidacaoIa: edital.dataValidacaoIA,
    scorePontuacao: edital.scorePontuacao,
    nivelPontuacao: edital.nivelPontuacao,
    motivosPontuacao: edital.motivosPontuacao,
    modoAnaliseIa: edital.modoAnaliseIA,
    hashPontuacao: edital.hashPontuacao,
    cacheClassificacaoUsado: edital.cacheClassificacaoUsado,
    confiancaPorCampo: edital.confiancaPorCampo,
  };
}

// ============================================================
// FUNÇÕES PÚBLICAS (agora async)
// ============================================================
const repo = new EditalRepository();
const analiseRepo = new AnaliseRepository();

export async function getAllEditais(incluirFechados = false): Promise<Edital[]> {
  try {
    let query = `SELECT * FROM editais`;
    const conditions: string[] = [];

    if (!incluirFechados) {
      const agora = new Date().toISOString();
      conditions.push(`(data_limite IS NULL OR data_limite >= '${agora}')`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY criado_em DESC`;

    const rows = db.all(query) as any[];

    // Buscar analises em paralelo
    const editalIds = rows.map(r => r.id);
    const analises = await Promise.all(
      editalIds.map(id => analiseRepo.findByEditalId(id))
    );

    return rows.map((row, i) => dbToEdital(row, analises[i]));
  } catch (erro) {
    console.error('❌ Erro ao buscar editais no banco:', erro);
    return [];
  }
}

export async function saveEdital(edital: Partial<Edital> & { id: string }): Promise<Edital> {
  try {
    const dbData = editalToDb(edital);

    // Buscar existente para merge
    const existente = await repo.findById(edital.id);

    let resultado: any;

    if (existente) {
      // Merge: preservar campos não enviados
      const merged: CreateEditalDTO = {
        ...dbData,
        titulo: dbData.titulo || existente.titulo,
        orgao: dbData.orgao || existente.orgao,
        link: dbData.link || existente.link,
        dataLimite: dbData.dataLimite || existente.dataLimite,
        descricao: dbData.descricao || existente.descricao || undefined,
        valor: dbData.valor ?? existente.valor ?? undefined,
        statusAnalise: dbData.statusAnalise || existente.statusAnalise || undefined,
      };
      resultado = await repo.update(edital.id, merged);
    } else {
      resultado = await repo.create(dbData);
    }

    // Salvar analiseIA se fornecida
    if (edital.analiseIA) {
      await analiseRepo.createOrUpdate({
        editalId: edital.id,
        resumo: edital.analiseIA.resumo,
        objetivo: edital.analiseIA.objetivo,
        elegibilidade: edital.analiseIA.elegibilidade,
        contatoEdital: edital.analiseIA.contatoEdital,
        scoreAdequacao: edital.analiseIA.scoreAdequacao,
        requisitos: edital.analiseIA.requisitos,
        itensFinanciaveis: edital.analiseIA.itensFinanciáveis,
        documentos: edital.analiseIA.documentosNecessarios,
        criterios: edital.analiseIA.criteriosAvaliacao,
        pontosFracos: edital.analiseIA.pontosFracos,
      });
    }

    // Buscar analise para retornar edital completo
    const analise = await analiseRepo.findByEditalId(edital.id);
    return dbToEdital(resultado, analise);
  } catch (erro) {
    console.error('❌ Erro ao salvar edital no banco:', erro);
    throw new Error(`Falha ao salvar edital ${edital.id}: ${(erro as Error).message}`);
  }
}

export async function salvarValidacaoKeywords(
  editalId: string,
  validacaoResult: any,
  dadosExtraidos?: any
): Promise<Edital | null> {
  try {
    const existente = await repo.findById(editalId);
    if (!existente) {
      console.warn(`⚠️ Edital ${editalId} não encontrado para salvar validação`);
      return null;
    }

    await repo.update(editalId, {
      scoreValidacaoKeywords: validacaoResult.scoreTotal,
      densidadeKeywords: validacaoResult.densidadeKeywords,
      oportunidadesDetectadas: validacaoResult.oportunidadesDetectadas,
    });

    const edital = await repo.findById(editalId);
    return dbToEdital(edital);
  } catch (erro) {
    console.error(`❌ Erro ao salvar validação keywords para ${editalId}:`, erro);
    return null;
  }
}

export async function deleteEdital(id: string): Promise<boolean> {
  try {
    const existente = await repo.findById(id);
    if (!existente) return false;

    await repo.delete(id);
    return true;
  } catch (erro) {
    console.error(`❌ Erro ao deletar edital ${id}:`, erro);
    return false;
  }
}
