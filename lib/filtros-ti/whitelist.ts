const WHITELIST_TI = {
  tecnologia: [
    'software', 'aplicação', 'ferramenta', 'framework', 'plataforma',
    'desenvolvimento', 'programação', 'sistema', 'código', 'sistema de informação',

    'inteligência artificial', 'machine learning', 'deep learning', 'llm',
    'neural', 'redes neurais', 'nlp', 'visão computacional', 'ia',
    'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'aprendizado de máquina',

    'big data', 'data science', 'analytics', 'dados', 'análise de dados',
    'data engineering', 'data pipeline', 'etl', 'spark', 'hadoop',
    'business intelligence', 'inteligência de negócio',

    'cloud', 'computação em nuvem', 'aws', 'azure', 'gcp', 'google cloud',
    'serverless', 'saas', 'paas', 'iaas', 'nuvem computacional',

    'segurança', 'criptografia', 'blockchain', 'web3', 'crypto',
    'cybersecurity', 'penetration testing', 'vulnerabilidade', 'cibersegurança',

    'web', 'mobile', 'app', 'aplicativo', 'frontend', 'backend',
    'fullstack', 'react', 'angular', 'vue', 'svelte', 'nextjs',
    'flutter', 'react native', 'ios', 'android', 'aplicação web',

    'devops', 'infraestrutura', 'container', 'docker', 'kubernetes', 'k8s',
    'ci/cd', 'gitops', 'infrastructure as code', 'terraform',
    'ansible', 'jenkins', 'gitlab ci', 'pipeline de entrega',

    'iot', 'internet das coisas', 'sistemas embarcados', 'edge computing',
    'mqtt', 'sensor', 'microcontroller', 'arduino', 'raspberry',
    'internet of things', 'sistemas ciber-físicos',

    'quantum', 'computação quântica', 'qubits', 'algoritmo quântico',

    'api', 'rest', 'graphql', 'microservices', 'integração',
    'webhook', 'sdks', 'interface de programação', 'microsserviços',

    'python', 'java', 'javascript', 'typescript', 'go', 'rust',
    'c++', 'c#', 'php', 'kotlin', 'swift', 'scala', 'ruby',
    'groovy', 'perl', 'lua', 'r language', 'linguagem de programação',

    'database', 'banco de dados', 'sql', 'nosql', 'elasticsearch',
    'mongodb', 'postgresql', 'mysql', 'redis', 'cassandra',
    'dynamodb', 'firestore', 'grafodb', 'banco relacional', 'base de dados',

    'git', 'github', 'gitlab', 'bitbucket', 'svn',
    'linux', 'windows', 'macos', 'unix', 'windows server',
    'open source', 'código aberto', 'foss', 'software livre',

    'agile', 'scrum', 'kanban', 'tdd', 'bdd', 'clean code',
    'ágil', 'metodologia', 'práticas ágeis', 'devtest',

    'microserviços', 'monolítico', 'serverless', 'event-driven',
    'orientado a objeto', 'funcional', 'design patterns', 'arquitetura de software',

    'pesquisa', 'desenvolvimento', 'inovação', 'prototipagem',
    'laboratório de inovação', 'fab lab', 'innovation lab',
    'investigação', 'estudo', 'análise técnica', 'prototipo',

    'transformação digital', 'modernização', 'digital', 'automação',
    'modernização de sistemas', 'migração de sistemas', 'legacy',
    'atualização tecnológica', 'stack tecnológico',

    'educação digital', 'ensino de programação', 'bootcamp', 'treinamento',
    'capacitação', 'formação profissional', 'letramento digital',
    'trilha de aprendizado', 'curso', 'currículo de ti',

    'startup tech', 'ecossistema de inovação', 'hub tecnológico',
    'centro de excelência', 'competência digital', 'maturidade digital',
  ],
  contexto_institucional: [
    'universidade', 'universidade pública', 'universidade privada', 'ufmg', 'usp', 'uff', 'ufrj',
    'campus', 'faculdade', 'instituto de educação', 'ifc', 'ifet',
    'departamento de computação', 'centro de ciências tecnológicas',

    'instituto federal', 'ifsp', 'ifpb', 'ifmg', 'ifba', 'ifpr', 'ifes',
    'ifc', 'ifsc', 'ifal', 'ifce', 'ifpi', 'ifms', 'ifrn', 'ifrj', 'ifro',
    'if sudeste', 'if nordeste', 'if norte', 'if sul',
    'ensino técnico federal', 'educação tecnológica',

    'pesquisa', 'pesquisador', 'pesquisa científica', 'pesquisa aplicada',
    'projeto de pesquisa', 'grupo de pesquisa', 'equipe de p&d',
    'investigação científica', 'estudo de caso',

    'desenvolvimento', 'desenvolvimento de soluções', 'desenvolvimento tecnológico',
    'p&d', 'pesquisa e desenvolvimento', 'centro de desenvolvimento',
    'lab de inovação', 'innovation center',

    'edital', 'bolsa', 'auxílio', 'financiamento', 'investimento',
    'fomento', 'programa de apoio', 'fapesb', 'capes', 'cnpq', 'finep',
    'fapesp', 'fapemig', 'fundação de amparo',

    'pesquisador', 'professor', 'cientista', 'engenheiro', 'desenvolvedor',
    'doutor', 'pesquisador sênior', 'coordenador de pesquisa',
    'mestrando', 'doutorando', 'pós-doc',

    'inovação', 'startup', 'empresa de tecnologia', 'scaleup',
    'ecossistema de inovação', 'parque tecnológico', 'hub tecnológico',
    'incubadora', 'aceleradora', 'centro de inovação',

    'colaboração', 'parceria', 'cooperação técnica', 'consórcio',
    'rede de pesquisa', 'rede colaborativa', 'projeto colaborativo',
  ],
  contexto_geral: [
    'projeto', 'programa', 'solução', 'ferramenta',
    'bolsa', 'auxílio', 'investimento', 'edital',
    'engenheiro', 'desenvolvedor', 'cientista'
  ]
};

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

  for (const termo of WHITELIST_TI.tecnologia) {
    if (textoCompleto.includes(termo.toLowerCase())) {
      termosBranco.push(termo);
    }
  }

  if (termosBranco.length >= 2) {
    return {
      válido: true,
      confidence: 'alta',
      termoEncontrado: termosBranco[0],
      termosBranco,
      categoria: 'Tecnologia TI'
    };
  }

  if (termosBranco.length === 1) {
    return {
      válido: true,
      confidence: 'média',
      termoEncontrado: termosBranco[0],
      termosBranco,
      categoria: 'Tecnologia TI'
    };
  }

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

export { WHITELIST_TI };