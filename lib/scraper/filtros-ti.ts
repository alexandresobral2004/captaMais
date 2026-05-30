import axios from 'axios';

/**
 * CATEGORIAS DE TECNOLOGIA PARA PESQUISA EM TI, DESENVOLVIMENTO E INOVAÇÃO
 */
// export enum TecnologiaFoco {
//   // TI Tradicional
//   IA_MACHINE_LEARNING = "IA & Machine Learning",
//   BIG_DATA = "Big Data & Analytics",
//   CLOUD_COMPUTING = "Cloud Computing",
//   CYBERSECURITY = "Segurança & Criptografia",
//   DEVOPS = "DevOps & Infraestrutura",
//   WEB_MOBILE = "Web & Mobile",
//   BLOCKCHAIN = "Blockchain & Web3",
//   QUANTUM = "Computação Quântica",
//   IOT = "IoT & Sistemas Embarcados",
//   DATA_SCIENCE = "Data Science",
//   LINGUAGENS = "Linguagens & Compiladores",

//   // Pesquisa e Desenvolvimento
//   PESQUISA_ACADEMICA = "Pesquisa Acadêmica",
//   DESENVOLVIMENTO_SOLUCOES = "Desenvolvimento de Soluções",
//   INOVACAO_TECNOLOGICA = "Inovação Tecnológica",
//   EDUCACAO_DIGITAL = "Educação Digital",
//   TRANSFORMACAO_DIGITAL = "Transformação Digital",

//   // Eventos Científicos
//   EVENTO_CIENTIFICO = "Evento Científico",

//   OUTRO_TI = "Outro - TI Geral"
// }

export enum TecnologiaFoco {
  // IA e Dados
  IA_MACHINE_LEARNING = "IA & Machine Learning",
  IA_GENERATIVA = "IA Generativa",
  NLP = "Processamento de Linguagem Natural",
  VISAO_COMPUTACIONAL = "Visão Computacional",
  SISTEMAS_RECOMENDACAO = "Sistemas de Recomendação",
  BIG_DATA = "Big Data & Analytics",
  DATA_SCIENCE = "Data Science",
  MINERACAO_DADOS = "Mineração de Dados",
  ENGENHARIA_DADOS = "Engenharia de Dados",
  VISUALIZACAO_DADOS = "Visualização de Dados",
  BANCO_DE_DADOS = "Banco de Dados",
  RECUPERACAO_INFORMACAO = "Recuperação de Informação",
  BIOINFORMATICA = "Bioinformática",

  // Engenharia de Software e Desenvolvimento
  ENGENHARIA_SOFTWARE = "Engenharia de Software",
  ARQUITETURA_SOFTWARE = "Arquitetura de Software",
  QUALIDADE_SOFTWARE = "Qualidade de Software",
  TESTE_SOFTWARE = "Teste de Software",
  MANUTENCAO_SOFTWARE = "Manutenção & Evolução de Software",
  DESENVOLVIMENTO_SOLUCOES = "Desenvolvimento de Soluções",
  WEB_MOBILE = "Web & Mobile",
  DESENVOLVIMENTO_JOGOS = "Jogos Digitais",
  COMPUTACAO_GRAFICA = "Computação Gráfica",

  // Sistemas, Infraestrutura e Redes
  CLOUD_COMPUTING = "Cloud Computing",
  DEVOPS = "DevOps & Infraestrutura",
  MLOPS = "MLOps",
  SISTEMAS_DISTRIBUIDOS = "Sistemas Distribuídos",
  SISTEMAS_OPERACIONAIS = "Sistemas Operacionais",
  ARQUITETURA_COMPUTADORES = "Arquitetura de Computadores",
  REDES_COMPUTADORES = "Redes de Computadores",
  EDGE_COMPUTING = "Edge Computing",
  HPC = "Computação de Alto Desempenho",

  // Segurança e Privacidade
  CYBERSECURITY = "Segurança & Criptografia",
  SEGURANCA_APLICACOES = "Segurança de Aplicações",
  PRIVACIDADE_DADOS = "Privacidade & Proteção de Dados",
  FORENSE_DIGITAL = "Forense Digital",
  LGPD_COMPLIANCE = "LGPD, Compliance & Gestão de Riscos",
  BLOCKCHAIN = "Blockchain & Web3",


  // Interação, Educação e Sociedade
  IHC = "Interação Humano-Computador",
  UX_UI = "UX/UI & Experiência do Usuário",
  ACESSIBILIDADE = "Acessibilidade Digital",
  EDUCACAO_DIGITAL = "Educação Digital",
  TECNOLOGIA_ASSISTIVA = "Tecnologia Assistiva",
  INCLUSAO_DIGITAL = "Inclusão Digital",
  IMPACTO_SOCIAL = "Tecnologia para Impacto Social",

  // IoT, Robótica e Computação Ubíqua
  IOT_SISTEMAS_EMBARCADOS = "IoT & Sistemas Embarcados",
  ROBOTICA_AUTOMACAO = "Robótica & Automação",
  COMPUTACAO_UBIQUA = "Computação Ubíqua",
  INDUSTRIA_4_0 = "Indústria 4.0",

  // Fundamentos da Computação
  ALGORITMOS_E_ESTRUTURAS = "Algoritmos & Estruturas de Dados",
  LINGUAGENS_E_COMPILADORES = "Linguagens & Compiladores",
  TEORIA_COMPUTACAO = "Teoria da Computação",
  METODOS_FORMAIS = "Métodos Formais & Verificação",
  OTIMIZACAO = "Otimização",
  COMPUTACAO_QUANTICA = "Computação Quântica",

  // Inovação e Transformação
  PESQUISA_ACADEMICA = "Pesquisa Acadêmica",
  INOVACAO_TECNOLOGICA = "Inovação Tecnológica",
  TRANSFORMACAO_DIGITAL = "Transformação Digital",
  EMPREENDEDORISMO_TECNOLOGICO = "Empreendedorismo Tecnológico",
  TRANSFERENCIA_TECNOLOGIA = "Transferência de Tecnologia",
  SUSTENTABILIDADE_TI = "TI Sustentável & Green IT",

  // Aplicações de domínio
  SAUDE_DIGITAL = "Saúde Digital",
  AGROTECH = "Agrotech & Tecnologia no Agro",
  SMART_CITIES = "Cidades Inteligentes",
  GOVTECH = "GovTech & Governo Digital",
  COMPUTACAO_APLICADA = "Computação Aplicada",

  // Tipos de oportunidade
  EVENTO_CIENTIFICO = "Evento Científico",
  BOLSA_INICIACAO_CIENTIFICA = "Bolsa de Iniciação Científica",
  BOLSA_POS_GRADUACAO = "Bolsa de Pós-Graduação",
  INTERCAMBIO_PESQUISA = "Intercâmbio & Mobilidade em Pesquisa",
  RESIDENCIA_TECNOLOGICA = "Residência Tecnológica",

  // Genérico
  MULTIDISCIPLINAR = "Multidisciplinar",
  OUTRO_COMPUTACAO = "Outro - Computação"
}

/**
 * TIPOS DE FERRAMENTA ESPERADOS
 */
export enum TipoFerramenta {
  FRAMEWORK = "Framework",
  LINGUAGEM = "Linguagem de Programação",
  BANCO_DADOS = "Banco de Dados",
  IDE = "IDE/Editor",
  PLATAFORMA = "Plataforma",
  BIBLIOTECA = "Biblioteca/Pacote",
  FERRAMENTA_DESENVOLVIMENTO = "Ferramenta de Desenvolvimento",
  OUTRO = "Outro"
}

/**
 * WHITELIST DE PALAVRAS-CHAVE EXPANDIDA
 * Termos que indicam relevância para:
 * - Software/Ferramentas de TI
 * - Pesquisa e Desenvolvimento
 * - Universidades, Institutos e Academia
 * - Inovação e Soluções tecnológicas
 */
const WHITELIST_TI = {
  tecnologia: [
    // Termos genéricos
    'software', 'aplicação', 'ferramenta', 'framework', 'plataforma',
    'desenvolvimento', 'programação', 'sistema', 'código', 'sistema de informação',

    // IA e Machine Learning
    'inteligência artificial', 'machine learning', 'deep learning', 'llm',
    'neural', 'redes neurais', 'nlp', 'visão computacional', 'ia',
    'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'aprendizado de máquina',

    // Big Data
    'big data', 'data science', 'analytics', 'dados', 'análise de dados',
    'data engineering', 'data pipeline', 'etl', 'spark', 'hadoop',
    'business intelligence', 'inteligência de negócio',

    // Cloud
    'cloud', 'computação em nuvem', 'aws', 'azure', 'gcp', 'google cloud',
    'serverless', 'saas', 'paas', 'iaas', 'nuvem computacional',

    // Segurança
    'segurança', 'criptografia', 'blockchain', 'web3', 'crypto',
    'cybersecurity', 'penetration testing', 'vulnerabilidade', 'cibersegurança',

    // Web e Mobile
    'web', 'mobile', 'app', 'aplicativo', 'frontend', 'backend',
    'fullstack', 'react', 'angular', 'vue', 'svelte', 'nextjs',
    'flutter', 'react native', 'ios', 'android', 'aplicação web',

    // DevOps
    'devops', 'infraestrutura', 'container', 'docker', 'kubernetes', 'k8s',
    'ci/cd', 'gitops', 'infrastructure as code', 'terraform',
    'ansible', 'jenkins', 'gitlab ci', 'pipeline de entrega',

    // IoT
    'iot', 'internet das coisas', 'sistemas embarcados', 'edge computing',
    'mqtt', 'sensor', 'microcontroller', 'arduino', 'raspberry',
    'internet of things', 'sistemas ciber-físicos',

    // Computação Quântica
    'quantum', 'computação quântica', 'qubits', 'algoritmo quântico',

    // APIs e Integrações
    'api', 'rest', 'graphql', 'microservices', 'integração',
    'webhook', 'sdks', 'interface de programação', 'microsserviços',

    // Linguagens de Programação
    'python', 'java', 'javascript', 'typescript', 'go', 'rust',
    'c++', 'c#', 'php', 'kotlin', 'swift', 'scala', 'ruby',
    'groovy', 'perl', 'lua', 'r language', 'linguagem de programação',

    // Bancos de Dados
    'database', 'banco de dados', 'sql', 'nosql', 'elasticsearch',
    'mongodb', 'postgresql', 'mysql', 'redis', 'cassandra',
    'dynamodb', 'firestore', 'grafodb', 'banco relacional', 'base de dados',

    // Ferramentas e Plataformas
    'git', 'github', 'gitlab', 'bitbucket', 'svn',
    'linux', 'windows', 'macos', 'unix', 'windows server',
    'open source', 'código aberto', 'foss', 'software livre',

    // Metodologias
    'agile', 'scrum', 'kanban', 'tdd', 'bdd', 'clean code',
    'ágil', 'metodologia', 'práticas ágeis', 'devtest',

    // Arquitetura
    'microserviços', 'monolítico', 'serverless', 'event-driven',
    'orientado a objeto', 'funcional', 'design patterns', 'arquitetura de software',

    // Pesquisa e Desenvolvimento
    'pesquisa', 'desenvolvimento', 'inovação', 'prototipagem',
    'laboratório de inovação', 'fab lab', 'innovation lab',
    'investigação', 'estudo', 'análise técnica', 'prototipo',

    // Transformação Digital e Modernização
    'transformação digital', 'modernização', 'digital', 'automação',
    'modernização de sistemas', 'migração de sistemas', 'legacy',
    'atualização tecnológica', 'stack tecnológico',

    // Educação e Academia em TI
    'educação digital', 'ensino de programação', 'bootcamp', 'treinamento',
    'capacitação', 'formação profissional', 'letramento digital',
    'trilha de aprendizado', 'curso', 'currículo de ti',

    // Ecosistema de TI
    'startup tech', 'ecossistema de inovação', 'hub tecnológico',
    'centro de excelência', 'competência digital', 'maturidade digital',
  ],
  contexto_institucional: [
    // Universidades
    'universidade', 'universidade pública', 'universidade privada', 'ufmg', 'usp', 'uff', 'ufrj',
    'campus', 'faculdade', 'instituto de educação', 'ifc', 'ifet',
    'departamento de computação', 'centro de ciências tecnológicas',

    // Institutos Federais
    'instituto federal', 'ifsp', 'ifpb', 'ifmg', 'ifba', 'ifpr', 'ifes',
    'ifc', 'ifsc', 'ifal', 'ifce', 'ifpi', 'ifms', 'ifrn', 'ifrj', 'ifro',
    'if sudeste', 'if nordeste', 'if norte', 'if sul',
    'ensino técnico federal', 'educação tecnológica',

    // Pesquisa
    'pesquisa', 'pesquisador', 'pesquisa científica', 'pesquisa aplicada',
    'projeto de pesquisa', 'grupo de pesquisa', 'equipe de p&d',
    'investigação científica', 'estudo de caso',

    // Desenvolvimento
    'desenvolvimento', 'desenvolvimento de soluções', 'desenvolvimento tecnológico',
    'p&d', 'pesquisa e desenvolvimento', 'centro de desenvolvimento',
    'lab de inovação', 'innovation center',

    // Financiamento e Editais
    'edital', 'bolsa', 'auxílio', 'financiamento', 'investimento',
    'fomento', 'programa de apoio', 'fapesb', 'capes', 'cnpq', 'finep',
    'fapesp', 'fapemig', 'fundação de amparo',

    // Profissionais Acadêmicos
    'pesquisador', 'professor', 'cientista', 'engenheiro', 'desenvolvedor',
    'doutor', 'pesquisador sênior', 'coordenador de pesquisa',
    'mestrando', 'doutorando', 'pós-doc',

    // Contextos de Inovação
    'inovação', 'startup', 'empresa de tecnologia', 'scaleup',
    'ecossistema de inovação', 'parque tecnológico', 'hub tecnológico',
    'incubadora', 'aceleradora', 'centro de inovação',

    // Colaboração e Parceria
    'colaboração', 'parceria', 'cooperação técnica', 'consórcio',
    'rede de pesquisa', 'rede colaborativa', 'projeto colaborativo',
  ],
  contexto_geral: [
    'projeto', 'programa', 'solução', 'ferramenta',
    'bolsa', 'auxílio', 'investimento', 'edital',
    'engenheiro', 'desenvolvedor', 'cientista'
  ]
};

/**
 * BLACKLIST DE PALAVRAS-CHAVE
 * Termos que indicam que o edital NÃO é sobre TI
 */
const BLACKLIST = [
  // Artes
  'arte', 'artes plásticas', 'música', 'dança', 'teatro', 'cinema',
  'audiovisual', 'pintura', 'escultura',

  // Humanidades
  'história', 'filosofia', 'sociologia', 'humanidades', 'literatura',
  'linguística', 'antropologia',

  // Saúde
  'biologia', 'medicina', 'saúde', 'farmacêutica', 'clínico',
  'hospitalar', 'enfermagem', 'odontologia',

  // Ambiente
  'agricultura', 'pecuária', 'meio ambiente', 'ecologia', 'florestal',
  'zootecnia', 'agropecuária', 'bioma',

  // Educação (genérico)
  'educação', 'pedagogia', 'ensino', 'didática', 'alfabetização',

  // Negócios e Gestão
  'administração', 'contabilidade', 'gestão', 'recursos humanos', 'rh',
  'auditoria', 'compliance', 'controladoria',

  // Marketing e Comunicação
  'marketing', 'publicidade', 'propaganda', 'comunicação', 'jornalismo',
  'audiovisual', 'mídia', 'redes sociais',

  // Direito
  'direito', 'jurisprudência', 'legal', 'advocacia', 'constitucional',

  // Psicologia e Comportamento
  'psicologia', 'psicanálise', 'comportamento', 'psiquiatria',

  // Construção e Arquitetura
  'arquitetura', 'construção', 'engenharia civil', 'imóvel', 'propriedade',
  'obra', 'reforma',

  // Design (genérico)
  'design', 'moda', 'vestuário', 'têxtil', 'decoração',
];

/**
 * CACHE EM MEMÓRIA PARA EVITAR CHAMADAS DUPLICADAS À OPENAI
 */
const cacheValidacao = new Map<string, any>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

/**
 * Gera chave única para um edital (hash do título + descrição)
 */
function gerarChaveCache(titulo: string, descricao: string): string {
  const str = `${titulo}|${descricao}`;
  return Buffer.from(str).toString('base64').substring(0, 32);
}

/**
 * Validação rápida com whitelist expandida
 * Retorna se contém termo relevante para TI, Pesquisa, Universidades ou Desenvolvimento
 */
export function validarWhitelistTI(titulo: string, descricao: string): {
  válido: boolean;
  confidence: 'alta' | 'média' | 'baixa';
  termoEncontrado?: string;
  termosBranco: string[];
  categoria?: string;
} {
  const textoCompleto = `${titulo} ${descricao}`.toLowerCase();
  const termosBranco: string[] = [];
  let categoria = 'Geral';

  // 1. Verificar whitelist de tecnologia
  for (const termo of WHITELIST_TI.tecnologia) {
    if (textoCompleto.includes(termo.toLowerCase())) {
      termosBranco.push(termo);
    }
  }

  // Se encontrou 2+ termos técnicos, confidence alta
  if (termosBranco.length >= 2) {
    return {
      válido: true,
      confidence: 'alta',
      termoEncontrado: termosBranco[0],
      termosBranco,
      categoria: 'Tecnologia TI'
    };
  }

  // Se encontrou 1 termo técnico, confidence média
  if (termosBranco.length === 1) {
    return {
      válido: true,
      confidence: 'média',
      termoEncontrado: termosBranco[0],
      termosBranco,
      categoria: 'Tecnologia TI'
    };
  }

  // 2. Verificar contexto institucional (Universidades, Institutos, Pesquisa)
  for (const termo of WHITELIST_TI.contexto_institucional) {
    if (textoCompleto.includes(termo.toLowerCase())) {
      termosBranco.push(termo);
      return {
        válido: true,
        confidence: 'alta',
        termoEncontrado: termo,
        termosBranco,
        categoria: 'Pesquisa & Academia'
      };
    }
  }

  // 3. Verificar contexto geral (projeto, programa, bolsa, etc)
  for (const termo of WHITELIST_TI.contexto_geral) {
    if (textoCompleto.includes(termo.toLowerCase())) {
      termosBranco.push(termo);
      return {
        válido: true,
        confidence: 'baixa',
        termoEncontrado: termo,
        termosBranco,
        categoria: 'Desenvolvimento & Inovação'
      };
    }
  }

  return {
    válido: false,
    confidence: 'alta',
    termosBranco: [],
    categoria: 'Não identificado'
  };
}

/**
 * EXCEÇÕES DA BLACKLIST: Termos compostos legítimos que NÃO devem ser bloqueados
 * mesmo que contenham uma palavra-chave da blacklist.
 */
const EXCECOES_BLACKLIST: { [termoBlacklist: string]: string[] } = {
  'saúde': ['saúde digital', 'healthtech', 'saúde eletrônica', 'tecnologia na saúde', 'telessaúde', 'e-health'],
  'educação': ['educação digital', 'tecnologia educacional', 'edtech', 'ensino de programação', 'letramento digital', 'educação tecnológica'],
  'ensino': ['ensino de programação', 'ensino de computação', 'ensino de tecnologia', 'ensino tecnológico', 'ensino técnico federal'],
  'arquitetura': ['arquitetura de software', 'arquitetura de computadores', 'arquitetura de redes', 'arquitetura de sistemas', 'arquitetura de microserviços', 'arquitetura de microsserviços'],
  'gestão': ['gestão de riscos', 'gestão de ti', 'gestão de dados', 'gestão tecnológica', 'gestão de projetos de ti', 'gestão de identidade', 'lgpd, compliance & gestão de riscos'],
  'design': ['design de interface', 'design de software', 'design de interação', 'design patterns', 'ux/ui design', 'ux/ui & experiência do usuário', 'design de experiência'],
  'comunicação': ['comunicação de dados', 'tecnologias de informação e comunicação', 'comunicação em rede', 'comunicação sem fio', 'redes de comunicação', 'tic'],
  'administração': ['administração de redes', 'administração de sistemas', 'administração de banco de dados', 'administração de servidores'],
  'direito': ['direito digital', 'direito autoral de software', 'direitos de propriedade intelectual', 'direitos autorais'],
  'agricultura': ['agrotech', 'tecnologia no agro', 'agricultura de precisão', 'agricultura inteligente', 'agronegócio tecnológico'],
  'agropecuária': ['agrotech', 'tecnologia no agro', 'agropecuária de precisão'],
  'arte': ['arte digital', 'arte generativa', 'tecnologia e arte', 'instalações interativas'],
};

/**
 * Validação final com blacklist (DESATIVADA por solicitação do usuário)
 * Retorna sempre true para não aplicar nenhum filtro de blacklist.
 */
export function validarBlacklist(titulo: string, descricao: string): boolean {
  return true;
}


/**
 * Chamada para OpenAI gpt-4o para validação completa
 * Fallback: se timeout ou erro → ACEITAR edital (permissivo)
 */
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

    // Verificar cache
    const cacheEntry = cacheValidacao.get(chaveCache);
    if (cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_TTL) {
      console.log(`   💾 Cache hit: ${titulo.substring(0, 40)}...`);
      return { ...cacheEntry.data, usouCache: true };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const modelo = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      console.warn(`   ⚠️ OPENAI_API_KEY não configurada. Fallback: ACEITAR automaticamente (sem erro).`);
      return gerarFallbackAceitar(titulo);
    }

    const termosBrancoStr = termosBranco?.join(', ') || 'nenhum';

    // Ajustar prompt se for evento científico
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
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

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
      console.warn(`   ⚠️ Resposta OpenAI vazia. Fallback: ACEITAR automaticamente (sem erro).`);
      return gerarFallbackAceitar(titulo);
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.warn(`   ⚠️ Resposta OpenAI sem JSON. Fallback: ACEITAR automaticamente (sem erro).`);
      return gerarFallbackAceitar(titulo);
    }

    let resultado;
    try {
      resultado = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.warn(`   ⚠️ JSON inválido: ${(parseError as Error).message}. Fallback: ACEITAR automaticamente (sem erro).`);
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
      // Tentar inferir antes de usar padrão
      const tecnologiaInferida = inferirTecnologiaPorContexto(titulo, descricao, termosBranco);
      tecnologiaNormalizada = tecnologiaInferida || 'Outro - TI Geral';
    }

    const brutoTipo = pegarCampo(['tipo', 'tipoFerramenta', 'classificacao', 'classificação', 'categoria_tipo']);
    let tipoNormalizado = '';

    if (typeof brutoTipo === 'string' && brutoTipo.trim().length > 0) {
      tipoNormalizado = brutoTipo.trim();
    } else {
      camposAjustados.add('tipo');
      // Tentar inferir antes de usar padrão
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
      console.warn(`   ⚠️ Resposta OpenAI com campos faltantes (${camposRestantes.join(', ')}). Valores padrão aplicados.`);
    }

    // Normalizar categoria se necessário
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

    // Salvar no cache
    cacheValidacao.set(chaveCache, {
      data: resultadoFinal,
      timestamp: Date.now()
    });

    return resultadoFinal;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn(`   ⏱️ Timeout OpenAI (>10s). Fallback: ACEITAR automaticamente (sem erro).`);
    } else {
      console.warn(`   ⚠️ Erro OpenAI: ${error.message}. Fallback: ACEITAR automaticamente (sem erro).`);
    }

    // Fallback permissivo - aceita automaticamente sem pedir confirmação
    return gerarFallbackAceitar(titulo);
  }
}

/**
 * Fallback quando OpenAI falha: aceitar edital conservadoramente
 */
function gerarFallbackAceitar(titulo: string): {
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

function inferirTecnologiaPorContexto(
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

function inferirTipoFerramentaPorContexto(
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

/**
 * Normalizar nome da tecnologia para enum (incluindo categorias expandidas)
 */
function normalizarTecnologia(tech: string): TecnologiaFoco {
  const mapa: { [key: string]: TecnologiaFoco } = {
    // TI Tradicional
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

    // Pesquisa e Desenvolvimento
    'pesquisa acadêmica': TecnologiaFoco.PESQUISA_ACADEMICA,
    'desenvolvimento de soluções': TecnologiaFoco.DESENVOLVIMENTO_SOLUCOES,
    'inovação tecnológica': TecnologiaFoco.INOVACAO_TECNOLOGICA,
    'educação digital': TecnologiaFoco.EDUCACAO_DIGITAL,
    'transformação digital': TecnologiaFoco.TRANSFORMACAO_DIGITAL,

    // Eventos Científicos
    'evento científico': TecnologiaFoco.EVENTO_CIENTIFICO,

    'outro - ti geral': TecnologiaFoco.OUTRO_COMPUTACAO
  };

  const chave = tech.toLowerCase();
  return mapa[chave] || TecnologiaFoco.OUTRO_COMPUTACAO;
}

/**
 * Normalizar tipo de ferramenta para enum (incluindo novos tipos)
 */
function normalizarTipo(tipo: string): TipoFerramenta {
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

/**
 * Calcular score final baseado em múltiplos critérios
 * Weighted: whitelist 30% + IA 60% + termos encontrados 10%
 */
export function calcularScoreFinal(
  whitelistScore: number,
  iaScore: number,
  termoEncontrados: number
): number {
  const normTermos = Math.min(100, termoEncontrados * 25); // 4 termos = 100
  const final = (whitelistScore * 0.3) + (iaScore * 0.6) + (normTermos * 0.1);
  return Math.round(final);
}

/**
 * Limpar cache (útil para testes)
 */
export function limparCache(): void {
  cacheValidacao.clear();
  console.log('✨ Cache de validação TI limpo.');
}
