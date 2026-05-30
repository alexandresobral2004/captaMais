import axios from 'axios';
import * as cheerio from 'cheerio';
import { Edital } from '../db/editais-store';
import { validarComOpenAI, validarBlacklist, validarWhitelistTI } from './filtros-ti';

function construirLinkAbsoluto(link: string, base: string): string {
  if (!link) {
    return base;
  }

  try {
    const trimmed = link.trim();
    if (!trimmed) {
      return base;
    }

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    const baseUrl = new URL(base);
    return new URL(trimmed, baseUrl).toString();
  } catch (erro) {
    console.warn(`   ⚠️ Não foi possível normalizar link relativo (${link}).`, erro instanceof Error ? erro.message : erro);
    return link;
  }
}

/**
 * FINEP - Fundação de Estudos e Projetos
 * URLs:
 *   - https://www.finep.gov.br/chamadas-publicas (principal)
 *   - https://finep.gov.br/chamadas (alternativa)
 */
export async function buscarEditaisFinep(): Promise<Edital[]> {
  const editaisValidados: Edital[] = [];
  const agora = new Date();

  // URLs para tentar em sequência
  const urls = [
    'https://www.finep.gov.br/chamadas-publicas',
    'https://finep.gov.br/chamadas-publicas',
    'https://www.finep.gov.br'
  ];

  try {
    console.log('\n🌐 [FINEP] Iniciando busca de editais...');

    let response = null;
    let urlUsada = '';

    // Tentar múltiplas URLs
    for (const url of urls) {
      try {
        console.log(`   🔍 Tentando URL: ${url}`);
        response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9',
            'Cache-Control': 'no-cache'
          }
        });
        urlUsada = url;
        console.log(`   ✅ URL acessível: ${url}`);
        break;
      } catch (err) {
        console.log(`   ⚠️ URL indisponível: ${url}`);
        continue;
      }
    }

    if (!response) {
      console.warn('❌ Nenhuma URL do FINEP estava acessível');
      return [];
    }

    const $ = cheerio.load(response.data);
    const elementos = $('a[href*="edital"], a[href*="chamada"], .edital, .chamada').get();
    let rejeitados = 0;

    // Processar elementos sequencialmente (não paralelo)
    for (const elem of elementos) {
      const titulo = $(elem).text().trim();
      const link = $(elem).attr('href');

      if (!titulo || !link || titulo.length < 10) {
        continue;
      }

      // Validação com whitelist
      const validacaoWhitelist = validarWhitelistTI(titulo, '');
      
      if (!validacaoWhitelist.válido) {
        rejeitados++;
        continue;
      }

      // Validação com OpenAI
      try {
        const validacaoIA = await validarComOpenAI(
          titulo,
          '',
          undefined,
          'FINEP',
          validacaoWhitelist.termosBranco
        );

        const passuBlacklist = validarBlacklist(titulo, '');

        if (!validacaoIA.válido || !passuBlacklist) {
          rejeitados++;
          continue;
        }

        const edital: Edital = {
          id: `finep-${Buffer.from(titulo).toString('base64').substring(0, 10)}`,
          titulo,
          orgao: 'FINEP',
          valor: 'A consultar',
          dataLimite: 'A consultar',
          status: 'Aberto',
          link: link.startsWith('http') ? link : `https://www.finep.gov.br${link}`,
          descricao: '',
          criadoEm: new Date().toISOString(),
          
          // Campos TI
          tecnologiaFoco: validacaoIA.tecnologia,
          tipoFerramenta: validacaoIA.tipo,
          scoreRelevancia: validacaoIA.score,
          scoreConfiancaIA: validacaoIA.confiança,
          validadoPorIA: true,
          palavrasChaveEncontradas: validacaoWhitelist.termosBranco,
          dataValidacaoIA: new Date().toISOString()
        };

        editaisValidados.push(edital);
        console.log(`   ✅ [${editaisValidados.length}] ${titulo.substring(0, 50)}`);
      } catch (err) {
        rejeitados++;
      }

      // Rate limiting
      await new Promise(res => setTimeout(res, 300));
    }

    console.log(`\n📊 [FINEP] Resultado: ${editaisValidados.length} válidos, ${rejeitados} rejeitados`);
    return editaisValidados;

   } catch (error) {
    const mensagem = error instanceof Error ? error.message : String(error);
    console.warn(`⚠️ [FINEP] Erro ao buscar editais: ${mensagem}`);
    console.log('   ℹ️ Retornando lista vazia (sem erro para não quebrar o fluxo)');
    return [];
  }
}

/**
 * CNPq - Conselho Nacional de Desenvolvimento Científico e Tecnológico
 * URLs: 
 *   - https://www.gov.br/cnpq/pt-br/financiamento/chamadas-abertas (principal)
 *   - https://cnpq.br/chamadas-publicas (alternativa)
 */
export async function buscarEditaisCNPq(): Promise<Edital[]> {
  const editaisValidados: Edital[] = [];
  const agora = new Date();

  // URLs para tentar em sequência
  const urls = [
    'https://www.gov.br/cnpq/pt-br/financiamento/chamadas-abertas',
    'https://cnpq.br/chamadas-publicas',
    'https://www.cnpq.br/chamadas-publicas'
  ];

  try {
    console.log('\n🌐 [CNPq] Iniciando busca de editais...');

    let response = null;
    let urlUsada = '';

    // Tentar múltiplas URLs
    for (const url of urls) {
      try {
        console.log(`   🔍 Tentando URL: ${url}`);
        response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9',
            'Cache-Control': 'no-cache'
          }
        });
        urlUsada = url;
        console.log(`   ✅ URL acessível: ${url}`);
        break;
      } catch (err) {
        console.log(`   ⚠️ URL indisponível: ${url}`);
        continue;
      }
    }

    if (!response) {
      console.warn('❌ Nenhuma URL do CNPq estava acessível');
      return [];
    }

    const $ = cheerio.load(response.data);
    const elementos = $('a[href*="/pt-br/"], h2, h3, .chamada, [data-edital]').get();
    let rejeitados = 0;

    // Processar elementos sequencialmente (não paralelo)
    for (const elem of elementos) {
      const titulo = $(elem).text().trim();
      const link = $(elem).attr('href');

      if (!titulo || titulo.length < 10) {
        continue;
      }

      // Validação com whitelist
      const validacaoWhitelist = validarWhitelistTI(titulo, '');
      
      if (!validacaoWhitelist.válido) {
        rejeitados++;
        continue;
      }

      // Validação com OpenAI
      try {
        const validacaoIA = await validarComOpenAI(
          titulo,
          '',
          undefined,
          'CNPq',
          validacaoWhitelist.termosBranco
        );

        const passuBlacklist = validarBlacklist(titulo, '');

        if (!validacaoIA.válido || !passuBlacklist) {
          rejeitados++;
          continue;
        }

        const urlCompleta = link && !link.startsWith('http') 
          ? `https://www.gov.br${link}`
          : (link || 'https://www.gov.br/cnpq/pt-br/financiamento/chamadas-abertas');

        const edital: Edital = {
          id: `cnpq-${Buffer.from(titulo).toString('base64').substring(0, 10)}`,
          titulo,
          orgao: 'CNPq',
          valor: 'A consultar',
          dataLimite: 'A consultar',
          status: 'Aberto',
          link: urlCompleta,
          descricao: '',
          criadoEm: new Date().toISOString(),
          
          // Campos TI
          tecnologiaFoco: validacaoIA.tecnologia,
          tipoFerramenta: validacaoIA.tipo,
          scoreRelevancia: validacaoIA.score,
          scoreConfiancaIA: validacaoIA.confiança,
          validadoPorIA: true,
          palavrasChaveEncontradas: validacaoWhitelist.termosBranco,
          dataValidacaoIA: new Date().toISOString()
        };

        editaisValidados.push(edital);
        console.log(`   ✅ [${editaisValidados.length}] ${titulo.substring(0, 50)}`);
      } catch (err) {
        rejeitados++;
      }

      // Rate limiting
      await new Promise(res => setTimeout(res, 300));
    }

     console.log(`\n📊 [CNPq] Resultado: ${editaisValidados.length} válidos, ${rejeitados} rejeitados`);
     return editaisValidados;

   } catch (error) {
     const mensagem = error instanceof Error ? error.message : String(error);
     console.warn(`⚠️ [CNPq] Erro ao buscar editais: ${mensagem}`);
     console.log('   ℹ️ Retornando lista vazia (sem erro para não quebrar o fluxo)');
     return [];
   }
 }

/**
 * CAPES - Coordenação de Aperfeiçoamento de Pessoal de Nível Superior
 * URL: https://www.gov.br/capes/pt-br/acesso-a-informacao/editais
 */
/**
 * CAPES - Coordenação de Aperfeiçoamento de Pessoal de Nível Superior
 * URLs:
 *   - https://www.gov.br/capes/pt-br/acesso-a-informacao/editais (principal)
 *   - https://www.capes.gov.br/editais (alternativa)
 */
export async function buscarEditaisCapes(): Promise<Edital[]> {
  const editaisValidados: Edital[] = [];
  const agora = new Date();

  // URLs para tentar em sequência
  const urls = [
    'https://www.gov.br/capes/pt-br/acesso-a-informacao/editais',
    'https://www.capes.gov.br/editais',
    'https://capes.gov.br/editais'
  ];

  try {
    console.log('\n🌐 [CAPES] Iniciando busca de editais...');

    let response = null;
    let urlUsada = '';

    // Tentar múltiplas URLs
    for (const url of urls) {
      try {
        console.log(`   🔍 Tentando URL: ${url}`);
        response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9',
            'Cache-Control': 'no-cache'
          }
        });
        urlUsada = url;
        console.log(`   ✅ URL acessível: ${url}`);
        break;
      } catch (err) {
        console.log(`   ⚠️ URL indisponível: ${url}`);
        continue;
      }
    }

    if (!response) {
      console.warn('❌ Nenhuma URL do CAPES estava acessível');
      return [];
    }

    const $ = cheerio.load(response.data);
    const elementos = $('a[href*="edital"], a[href*="/pt-br/"], h2, h3, .edital').get();
    let rejeitados = 0;

    // Processar elementos sequencialmente (não paralelo)
    for (const elem of elementos) {
      const titulo = $(elem).text().trim();
      const link = $(elem).attr('href');

      if (!titulo || titulo.length < 10) {
        continue;
      }

      // Validação com whitelist
      const validacaoWhitelist = validarWhitelistTI(titulo, '');
      
      if (!validacaoWhitelist.válido) {
        rejeitados++;
        continue;
      }

      // Validação com OpenAI
      try {
        const validacaoIA = await validarComOpenAI(
          titulo,
          '',
          undefined,
          'CAPES',
          validacaoWhitelist.termosBranco
        );

        const passuBlacklist = validarBlacklist(titulo, '');

        if (!validacaoIA.válido || !passuBlacklist) {
          rejeitados++;
          continue;
        }

        const urlCompleta = link && !link.startsWith('http')
          ? `https://www.gov.br${link}`
          : (link || 'https://www.gov.br/capes/pt-br/acesso-a-informacao/editais');

        const edital: Edital = {
          id: `capes-${Buffer.from(titulo).toString('base64').substring(0, 10)}`,
          titulo,
          orgao: 'CAPES',
          valor: 'A consultar',
          dataLimite: 'A consultar',
          status: 'Aberto',
          link: urlCompleta,
          descricao: '',
          criadoEm: new Date().toISOString(),
          
          // Campos TI
          tecnologiaFoco: validacaoIA.tecnologia,
          tipoFerramenta: validacaoIA.tipo,
          scoreRelevancia: validacaoIA.score,
          scoreConfiancaIA: validacaoIA.confiança,
          validadoPorIA: true,
          palavrasChaveEncontradas: validacaoWhitelist.termosBranco,
          dataValidacaoIA: new Date().toISOString()
        };

        editaisValidados.push(edital);
        console.log(`   ✅ [${editaisValidados.length}] ${titulo.substring(0, 50)}`);
      } catch (err) {
        rejeitados++;
      }

      // Rate limiting
      await new Promise(res => setTimeout(res, 300));
    }

     console.log(`\n📊 [CAPES] Resultado: ${editaisValidados.length} válidos, ${rejeitados} rejeitados`);
     return editaisValidados;

    } catch (error) {
      const mensagem = error instanceof Error ? error.message : String(error);
      console.warn(`⚠️ [CAPES] Erro ao buscar editais: ${mensagem}`);
      console.log('   ℹ️ Retornando lista vazia (sem erro para não quebrar o fluxo)');
      return [];
   }
}

/**
 * Ministério da Ciência do Brasil
 * Consulta apenas páginas específicas indicadas pelo time
 */
export async function buscarEditaisMinisterioCiencia(): Promise<Edital[]> {
  const editaisValidados: Edital[] = [];
  const agora = new Date();

  // URLs para tentar em sequência
  const urls = [
    'https://antigo.mctic.gov.br/mctic/opencms/ciencia/SEPED/ciencias_humanas/EDITAIS_PUBLICACOES/Editais.html',
    'https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/noticias'
  ];

  try {
    console.log('\n🌐 [Ministério da Ciência] Iniciando busca de editais e eventos científicos...');

    let response = null;
    let urlUsada = '';

    // Tentar múltiplas URLs
    for (const url of urls) {
      try {
        console.log(`   🔍 Tentando URL: ${url}`);
        response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9',
            'Cache-Control': 'no-cache'
          }
        });
        urlUsada = url;
        console.log(`   ✅ URL acessível: ${url}`);
        break;
      } catch (err) {
        console.log(`   ⚠️ URL indisponível: ${url}`);
        continue;
      }
    }

    if (!response) {
      console.warn('⚠️ Nenhuma URL do Ministério da Ciência estava acessível');
      console.log('   ℹ️ Retornando lista vazia (sem erro para não quebrar o fluxo)');
      return [];
    }

    const $ = cheerio.load(response.data);
    const baseParaLinks = urlUsada || urls[0];
    const linksProcessados = new Set<string>();
    
    // Procurar apenas elementos cujo texto/conteúdo contenha "edital"
    const elementos = $('a').get();
    let rejeitados = 0;

    // Palavras-chave para eventos científicos
    const palavrasEventos = ['congresso', 'conferência', 'simposium', 'seminário', 'workshop', 'mesa redonda', 'colóquio', 'encontro científico', 'jornada', 'fórum'];
    const palavrasCiencia = ['pesquisa', 'ciência', 'científico', 'tecnologia', 'inovação', 'desenvolvimento', 'acadêmico', 'investigação'];

    // Processar elementos sequencialmente
    for (const elem of elementos) {
      const titulo = $(elem).text().trim();
      const link = $(elem).attr('href') || '';
      const container = $(elem).closest('article, li, p, div');
      const blocoTexto = container.length ? container.text().replace(/\s+/g, ' ').trim() : titulo;
      const descricao = blocoTexto || titulo;
      const textoComposto = `${titulo} ${descricao}`.toLowerCase();

      if (!titulo || titulo.length < 5) {
        continue;
      }

      if (!/edital/i.test(textoComposto)) {
        continue;
      }

      if (!link) {
        continue;
      }

      const linkNormalizado = construirLinkAbsoluto(link, baseParaLinks);

      if (linksProcessados.has(linkNormalizado)) {
        continue;
      }

      linksProcessados.add(linkNormalizado);

      // Verificar se é evento científico ou chamada pública de pesquisa
      const temPalavraEvento = palavrasEventos.some(p => textoComposto.includes(p));
      const temPalavraCiencia = palavrasCiencia.some(p => textoComposto.includes(p));
      
      // Aceitar se for evento científico OU chamada pública de pesquisa
      const ehEventoCientifico = temPalavraEvento && temPalavraCiencia;

      // Validação com whitelist para pesquisa e ciência
      const validacaoWhitelist = validarWhitelistTI(titulo, descricao);
      
      // Aceitar se passar na whitelist OU se for evento científico
      if (!validacaoWhitelist.válido && !ehEventoCientifico) {
        rejeitados++;
        continue;
      }

      // Validação com OpenAI
      try {
        const validacaoIA = await validarComOpenAI(
          titulo,
          descricao,
          undefined,
          'Ministério da Ciência do Brasil',
          validacaoWhitelist.termosBranco,
          ehEventoCientifico ? 'evento_cientifico' : undefined
        );

        const passuBlacklist = validarBlacklist(titulo, descricao);

        if (!validacaoIA.válido || !passuBlacklist) {
          rejeitados++;
          continue;
        }

        const edital: Edital = {
          id: `mciencia-${Buffer.from(titulo).toString('base64').substring(0, 10)}`,
          titulo,
          orgao: 'Ministério da Ciência do Brasil',
          valor: 'A consultar',
          dataLimite: 'A consultar',
          status: 'Aberto',
          link: linkNormalizado,
          descricao: descricao.substring(0, 500),
          criadoEm: new Date().toISOString(),
          
          // Campos TI/Pesquisa
          tecnologiaFoco: validacaoIA.tecnologia,
          tipoFerramenta: validacaoIA.tipo,
          scoreRelevancia: validacaoIA.score,
          scoreConfiancaIA: validacaoIA.confiança,
          validadoPorIA: true,
          palavrasChaveEncontradas: validacaoWhitelist.termosBranco,
          dataValidacaoIA: new Date().toISOString(),
          
          // Marcar se é evento científico
          tipoEdital: ehEventoCientifico ? 'evento_cientifico' : 'chamada_publica'
        };

        editaisValidados.push(edital);
        console.log(`   ✅ [${editaisValidados.length}] ${titulo.substring(0, 50)}`);
      } catch (err) {
        rejeitados++;
      }

      // Rate limiting
      await new Promise(res => setTimeout(res, 300));
    }

    console.log(`\n📊 [Ministério da Ciência] Resultado: ${editaisValidados.length} válidos, ${rejeitados} rejeitados`);
    return editaisValidados;

   } catch (error) {
     const mensagem = error instanceof Error ? error.message : String(error);
     console.warn(`⚠️ [Ministério da Ciência] Erro ao buscar editais: ${mensagem}`);
     console.log('   ℹ️ Retornando lista vazia (sem erro para não quebrar o fluxo)');
     return [];
   }
}
