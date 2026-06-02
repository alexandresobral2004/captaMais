import axios from 'axios';
import { TecnologiaFoco, TipoFerramenta } from './enums';
import { cacheValidacao, gerarChaveCache, CACHE_TTL } from './cache';

export async function validarComOpenAI(
  titulo: string,
  descricao: string,
  valor?: string,
  orgao?: string,
  termosBranco?: string[],
  tipoEdital?: string
): Promise<{
  válido: boolean;
  tecnologia: TecnologiaFoco;
  tipo: TipoFerramenta;
  score: number;
  razão: string;
  confiança: number;
  usouCache: boolean;
}> {
  try {
    const chaveCache = gerarChaveCache(titulo, descricao);

    const cacheEntry = cacheValidacao.get(chaveCache);
    if (cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_TTL) {
      console.log(`   Cache hit: ${titulo.substring(0, 40)}...`);
      return { ...cacheEntry.data, usouCache: true };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const modelo = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      console.warn(`   OPENAI_API_KEY não configurada. Fallback: ACEITAR automaticamente.`);
      return gerarFallbackAceitar(titulo);
    }

    const termosBrancoStr = termosBranco?.join(', ') || 'nenhum';

    const tipoEditalInfo = tipoEdital === 'evento_cientifico'
      ? '\n\nNOTA: Este é um EVENTO CIENTÍFICO (congresso, conferência, seminário, workshop, etc). Avaliar se é relevante para ciência, tecnologia e inovação.'
      : '';

    const prompt = `Você é um especialista em validação de editais e chamadas públicas voltados para:
1. Pesquisa e Desenvolvimento em TI e Software
2. Soluções tecnológicas para Universidades Públicas e Privadas
3. Institutos Federais de Educação Tecnológica
4. Pesquisadores e Inovação Tecnológica
5. Eventos Científicos (congressos, conferências, seminários, workshops)
 
EDITAL PARA VALIDAÇÃO:
Título: ${titulo}
Descrição: ${descricao}
Valor: ${valor || 'N/A'}
Órgão: ${orgao || 'N/A'}
Palavras-chave encontradas: ${termosBrancoStr}${tipoEditalInfo}

TAREFAS:
1. Determine se este edital/chamada/evento é RELEVANTE para:
   - TI, Software e Desenvolvimento de Soluções
   - Pesquisa científica e acadêmica
   - Universidades (públicas ou privadas)
   - Institutos Federais de Educação Tecnológica
   - Inovação e desenvolvimento tecnológico
   - Eventos Científicos em Ciência, Tecnologia e Inovação

2. Se SIM (válido=true), categorize em UMA das áreas:
   - IA & Machine Learning
   - Big Data & Analytics
   - Cloud Computing
   - Segurança & Criptografia
   - DevOps & Infraestrutura
   - Web & Mobile
   - Blockchain & Web3
   - Computação Quântica
   - IoT & Sistemas Embarcados
   - Data Science
   - Linguagens & Compiladores
   - Pesquisa Acadêmica
   - Desenvolvimento de Soluções
   - Inovação Tecnológica
   - Educação Digital
   - Transformação Digital
   - Evento Científico
   - Outro - TI Geral

3. Categorize o TIPO de ferramenta:
   - Framework
   - Linguagem de Programação
   - Banco de Dados
   - IDE/Editor
   - Plataforma
   - Biblioteca/Pacote
   - Ferramenta de Desenvolvimento
   - Solução Corporativa
   - Sistema Educacional
   - Outro

4. Score de 0-100 (relevância para TI/Pesquisa/Academia)
5. Nível de confiança 0-100%
6. Se NÃO relevante, explique o motivo

RESPONDA EM JSON VÁLIDO (sem markdown, sem explicação adicional):
{
  "válido": true/false,
  "tecnologia": "categoria exata",
  "tipo": "tipo exato",
  "score": número,
  "confiança": número,
  "razão": "explicação breve"
}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: modelo,
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em validação de editais de pesquisa em TI. Responda SEMPRE em JSON válido sem markdown.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 300,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal as any
      }
    );

    clearTimeout(timeoutId);

    const content = response.data.choices?.[0]?.message?.content || '';

    if (!content || content.trim().length === 0) {
      console.warn(`   Resposta OpenAI vazia. Fallback: ACEITAR automaticamente.`);
      return gerarFallbackAceitar(titulo);
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.warn(`   Resposta OpenAI sem JSON. Fallback: ACEITAR automaticamente.`);
      return gerarFallbackAceitar(titulo);
    }

    let resultado;
    try {
      resultado = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.warn(`   JSON inválido: ${(parseError as Error).message}. Fallback: ACEITAR automaticamente.`);
      return gerarFallbackAceitar(titulo);
    }

    const objetoResultado: Record<string, any> = resultado && typeof resultado === 'object' ? resultado : {};

    const pegarCampo = (chaves: string[]): any => {
      for (const chave of chaves) {
        if (objetoResultado[chave] !== undefined && objetoResultado[chave] !== null) {
          return objetoResultado[chave];
        }
      }
      return undefined;
    };

    const camposAjustados = new Set<string>();

    const brutoValido = pegarCampo(['válido', 'valido', 'is_valid', 'isValido', 'is_valido', 'aprovado']);
    let validoNormalizado: boolean;
    if (typeof brutoValido === 'boolean') {
      validoNormalizado = brutoValido;
    } else if (typeof brutoValido === 'string') {
      const valStr = brutoValido.trim().toLowerCase();
      validoNormalizado = ['true', 'sim', 'yes', 'válido', 'valido'].includes(valStr);
    } else if (typeof brutoValido === 'number') {
      validoNormalizado = brutoValido > 0;
    } else {
      camposAjustados.add('válido');
      validoNormalizado = true;
    }

    const brutoTecnologia = pegarCampo(['tecnologia', 'categoria', 'área', 'area', 'categoria_tecnologia', 'categoriaTecnologia']);
    let tecnologiaNormalizada = '';

    if (typeof brutoTecnologia === 'string' && brutoTecnologia.trim().length > 0) {
      tecnologiaNormalizada = brutoTecnologia.trim();
    } else {
      camposAjustados.add('tecnologia');
      const tecnologiaInferida = inferirTecnologiaPorContexto(titulo, descricao, termosBranco);
      tecnologiaNormalizada = tecnologiaInferida || 'Outro - Computação';
    }

    const brutoTipo = pegarCampo(['tipo', 'tipoFerramenta', 'classificacao', 'classificação', 'categoria_tipo']);
    let tipoNormalizado = '';

    if (typeof brutoTipo === 'string' && brutoTipo.trim().length > 0) {
      tipoNormalizado = brutoTipo.trim();
    } else {
      camposAjustados.add('tipo');
      const tipoInferido = inferirTipoFerramentaPorContexto(titulo, descricao);
      tipoNormalizado = tipoInferido || 'Outro';
    }

    const brutoScore = pegarCampo(['score', 'relevancia', 'relevância', 'nota', 'pontuacao', 'pontuação']);
    let scoreNormalizado = Number.parseFloat(String(brutoScore));
    if (Number.isNaN(scoreNormalizado)) {
      camposAjustados.add('score');
      scoreNormalizado = 60;
    }

    const brutoConfianca = pegarCampo(['confiança', 'confianca', 'confidence', 'certeza', 'probabilidade']);
    let confiancaNormalizada = Number.parseFloat(String(brutoConfianca));
    if (Number.isNaN(confiancaNormalizada)) {
      camposAjustados.add('confiança');
      confiancaNormalizada = 60;
    }

    const brutoRazao = pegarCampo(['razão', 'razao', 'motivo', 'justificativa', 'observacao', 'observação']);
    let razaoNormalizada = typeof brutoRazao === 'string' && brutoRazao.trim().length > 0
      ? brutoRazao.trim()
      : 'Validação OpenAI';

    const camposRestantes = Array.from(camposAjustados);

    if (camposRestantes.length > 0) {
      const motivoPadrao = `Campos preenchidos automaticamente: ${camposRestantes.join(', ')}`;
      if (!objetoResultado.razão && razaoNormalizada === 'Validação OpenAI') {
        razaoNormalizada = motivoPadrao;
      }
      console.warn(`   Resposta OpenAI com campos faltantes (${camposRestantes.join(', ')}). Valores padrão aplicados.`);
    }

    const tecnologia = normalizarTecnologia((objetoResultado.tecnologia ?? tecnologiaNormalizada) as string);
    const tipo = normalizarTipo((objetoResultado.tipo ?? tipoNormalizado) as string);

    const resultadoFinal = {
      válido: validoNormalizado,
      tecnologia,
      tipo,
      score: Math.min(100, Math.max(0, scoreNormalizado)),
      razão: razaoNormalizada,
      confiança: Math.min(100, Math.max(0, confiancaNormalizada)),
      usouCache: false
    };

    cacheValidacao.set(chaveCache, {
      data: resultadoFinal,
      timestamp: Date.now()
    });

    return resultadoFinal;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn(`   Timeout OpenAI (>10s). Fallback: ACEITAR automaticamente.`);
    } else {
      console.warn(`   Erro OpenAI: ${error.message}. Fallback: ACEITAR automaticamente.`);
    }

    return gerarFallbackAceitar(titulo);
  }
}

export function gerarFallbackAceitar(titulo: string): {
  válido: boolean;
  tecnologia: TecnologiaFoco;
  tipo: TipoFerramenta;
  score: number;
  razão: string;
  confiança: number;
  usouCache: boolean;
} {
  return {
    válido: true,
    tecnologia: TecnologiaFoco.OUTRO_COMPUTACAO,
    tipo: TipoFerramenta.OUTRO,
    score: 50,
    razão: 'Fallback: OpenAI falhou. Aceito conservadoramente.',
    confiança: 30,
    usouCache: false
  };
}

export function inferirTecnologiaPorContexto(
  titulo: string,
  descricao: string,
  termosBranco?: string[]
): TecnologiaFoco | null {
  const texto = `${titulo} ${descricao}`.toLowerCase();
  const termos = new Set((termosBranco || []).map((t) => t.toLowerCase()));

  const regras: { categoria: TecnologiaFoco; palavras: string[] }[] = [
    { categoria: TecnologiaFoco.IA_MACHINE_LEARNING, palavras: ['inteligência artificial', 'inteligencia artificial', 'machine learning', 'aprendizado de máquina', 'aprendizado de maquina', 'deep learning', 'rede neural', 'modelos generativos'] },
    { categoria: TecnologiaFoco.BIG_DATA, palavras: ['big data', 'data science', 'análise de dados', 'analise de dados', 'engenharia de dados', 'data analytics'] },
    { categoria: TecnologiaFoco.CLOUD_COMPUTING, palavras: ['cloud', 'computação em nuvem', 'computacao em nuvem', 'nuvem', 'aws', 'azure', 'gcp', 'kubernetes', 'container'] },
    { categoria: TecnologiaFoco.CYBERSECURITY, palavras: ['cibersegurança', 'ciberseguranca', 'segurança da informação', 'seguranca da informacao', 'criptografia', 'pentest', 'cybersecurity'] },
    { categoria: TecnologiaFoco.DEVOPS, palavras: ['devops', 'ci/cd', 'automação de infraestrutura', 'infraestrutura como código', 'infraestrutura como codigo'] },
    { categoria: TecnologiaFoco.WEB_MOBILE, palavras: ['aplicativo', 'aplicações web', 'aplicacoes web', 'frontend', 'backend', 'mobile', 'web', 'site', 'plataforma digital'] },
    { categoria: TecnologiaFoco.BLOCKCHAIN, palavras: ['blockchain', 'web3', 'criptoativo', 'crypto', 'contrato inteligente'] },
    { categoria: TecnologiaFoco.COMPUTACAO_QUANTICA, palavras: ['computação quântica', 'computacao quantica', 'qubits', 'quantum'] },
    { categoria: TecnologiaFoco.IOT_SISTEMAS_EMBARCADOS, palavras: ['internet das coisas', 'iot', 'dispositivo inteligente', 'sensor conectado', 'sistemas embarcados'] },
    { categoria: TecnologiaFoco.DATA_SCIENCE, palavras: ['análise estatística', 'analise estatistica', 'modelagem preditiva', 'cientista de dados'] },
    { categoria: TecnologiaFoco.LINGUAGENS_E_COMPILADORES, palavras: ['linguagem de programação', 'linguagem de programacao', 'compilador', 'interpretador'] },
    { categoria: TecnologiaFoco.PESQUISA_ACADEMICA, palavras: ['pesquisa acadêmica', 'pesquisa academica', 'universidade', 'instituto federal', 'acadêmico', 'academico'] },
    { categoria: TecnologiaFoco.DESENVOLVIMENTO_SOLUCOES, palavras: ['desenvolvimento de soluções', 'desenvolvimento de solucoes', 'prototipagem', 'projeto tecnológico', 'projeto tecnologico'] },
    { categoria: TecnologiaFoco.INOVACAO_TECNOLOGICA, palavras: ['inovação tecnológica', 'inovacao tecnologica', 'transformação digital', 'transformacao digital', 'modernização', 'modernizacao'] },
    { categoria: TecnologiaFoco.EDUCACAO_DIGITAL, palavras: ['educação digital', 'educacao digital', 'formação em tecnologia', 'formacao em tecnologia', 'capacitação digital', 'capacitacao digital'] },
    { categoria: TecnologiaFoco.TRANSFORMACAO_DIGITAL, palavras: ['transformação digital', 'transformacao digital', 'modernização digital', 'modernizacao digital', 'gestão tecnológica', 'gestao tecnologica'] },
    { categoria: TecnologiaFoco.EVENTO_CIENTIFICO, palavras: ['congresso', 'seminário', 'seminario', 'simpósio', 'simposio', 'evento científico', 'evento cientifico', 'workshop'] }
  ];

  const contem = (palavra: string) => texto.includes(palavra) || termos.has(palavra);

  for (const regra of regras) {
    if (regra.palavras.some(contem)) {
      return regra.categoria;
    }
  }

  return null;
}

export function inferirTipoFerramentaPorContexto(
  titulo: string,
  descricao: string
): TipoFerramenta | null {
  const texto = `${titulo} ${descricao}`.toLowerCase();

  const regras: { tipo: TipoFerramenta; palavras: string[] }[] = [
    { tipo: TipoFerramenta.FRAMEWORK, palavras: ['framework', 'metodologia ágil', 'metodologia agil', 'boas práticas', 'boas praticas'] },
    { tipo: TipoFerramenta.LINGUAGEM, palavras: ['linguagem de programação', 'linguagem de programacao', 'python', 'java', 'javascript', 'typescript', 'go', 'rust', 'c++', 'c#'] },
    { tipo: TipoFerramenta.BANCO_DADOS, palavras: ['banco de dados', 'database', 'dados estruturados', 'dados estruturados'] },
    { tipo: TipoFerramenta.IDE, palavras: ['ide', 'editor de código', 'editor de codigo'] },
    { tipo: TipoFerramenta.PLATAFORMA, palavras: ['plataforma', 'portal', 'ambiente digital', 'ambiente online', 'sistema online'] },
    { tipo: TipoFerramenta.BIBLIOTECA, palavras: ['biblioteca', 'sdk', 'pacote', 'package'] },
    { tipo: TipoFerramenta.FERRAMENTA_DESENVOLVIMENTO, palavras: ['ferramenta', 'software', 'solução tecnológica', 'solucao tecnologica', 'aplicativo'] }
  ];

  for (const regra of regras) {
    if (regra.palavras.some((palavra) => texto.includes(palavra))) {
      return regra.tipo;
    }
  }

  return null;
}

export function normalizarTecnologia(tech: string): TecnologiaFoco {
  const mapa: { [key: string]: TecnologiaFoco } = {
    'ia & machine learning': TecnologiaFoco.IA_MACHINE_LEARNING,
    'big data & analytics': TecnologiaFoco.BIG_DATA,
    'cloud computing': TecnologiaFoco.CLOUD_COMPUTING,
    'segurança & criptografia': TecnologiaFoco.CYBERSECURITY,
    'devops & infraestrutura': TecnologiaFoco.DEVOPS,
    'web & mobile': TecnologiaFoco.WEB_MOBILE,
    'blockchain & web3': TecnologiaFoco.BLOCKCHAIN,
    'computação quântica': TecnologiaFoco.COMPUTACAO_QUANTICA,
    'iot & sistemas embarcados': TecnologiaFoco.IOT_SISTEMAS_EMBARCADOS,
    'data science': TecnologiaFoco.DATA_SCIENCE,
    'linguagens & compiladores': TecnologiaFoco.LINGUAGENS_E_COMPILADORES,
    'pesquisa acadêmica': TecnologiaFoco.PESQUISA_ACADEMICA,
    'desenvolvimento de soluções': TecnologiaFoco.DESENVOLVIMENTO_SOLUCOES,
    'inovação tecnológica': TecnologiaFoco.INOVACAO_TECNOLOGICA,
    'educação digital': TecnologiaFoco.EDUCACAO_DIGITAL,
    'transformação digital': TecnologiaFoco.TRANSFORMACAO_DIGITAL,
    'evento científico': TecnologiaFoco.EVENTO_CIENTIFICO,
    'outro - ti geral': TecnologiaFoco.OUTRO_COMPUTACAO,
    'outro - computação': TecnologiaFoco.OUTRO_COMPUTACAO
  };

  const chave = tech.toLowerCase();
  return mapa[chave] || TecnologiaFoco.OUTRO_COMPUTACAO;
}

export function normalizarTipo(tipo: string): TipoFerramenta {
  const mapa: { [key: string]: TipoFerramenta } = {
    'framework': TipoFerramenta.FRAMEWORK,
    'linguagem de programação': TipoFerramenta.LINGUAGEM,
    'banco de dados': TipoFerramenta.BANCO_DADOS,
    'ide/editor': TipoFerramenta.IDE,
    'plataforma': TipoFerramenta.PLATAFORMA,
    'biblioteca/pacote': TipoFerramenta.BIBLIOTECA,
    'ferramenta de desenvolvimento': TipoFerramenta.FERRAMENTA_DESENVOLVIMENTO,
    'solução corporativa': TipoFerramenta.OUTRO,
    'sistema educacional': TipoFerramenta.OUTRO,
    'solução acadêmica': TipoFerramenta.OUTRO,
    'outro': TipoFerramenta.OUTRO
  };

  const chave = tipo.toLowerCase();
  return mapa[chave] || TipoFerramenta.OUTRO;
}

export function calcularScoreFinal(
  whitelistScore: number,
  iaScore: number,
  termoEncontrados: number
): number {
  const normTermos = Math.min(100, termoEncontrados * 25);
  const final = (whitelistScore * 0.3) + (iaScore * 0.6) + (normTermos * 0.1);
  return Math.round(final);
}