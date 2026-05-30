
import fs from 'fs';
import path from 'path';

export interface PortalConfig {
  id: string;
  nome: string;
  urlBusca: string;
  tipo: 'rss' | 'html' | 'api' | 'session';
  categoria: string;
}

const DEFAULT_PORTAIS: PortalConfig[] = [
  {
    id: 'finep',
    nome: 'FINEP - Chamadas Públicas',
    urlBusca: 'http://www.finep.gov.br/chamadas-publicas?format=feed&type=rss',
    tipo: 'rss',
    categoria: 'Inovação e Tecnologia'
  },
  {
    id: 'cnpq',
    nome: 'CNPq - Chamadas Abertas',
    urlBusca: 'https://www.gov.br/cnpq/pt-br/financiamento/chamadas-abertas',
    tipo: 'html',
    categoria: 'Pesquisa e Acadêmico'
  },
  {
    id: 'fapesp',
    nome: 'FAPESP - Oportunidades',
    urlBusca: 'https://fapesp.br/oportunidades/oportunidades.xml',
    tipo: 'rss',
    categoria: 'Pesquisa e Ciência'
  },
  {
    id: 'bndes',
    nome: 'BNDES - Editais de Apoio',
    urlBusca: 'https://www.bndes.gov.br/wps/portal/site/home/onde-atuamos/social/apoio-a-projetos-sociais',
    tipo: 'html',
    categoria: 'Social e Infraestrutura'
  }
];

const CONFIG_FILE = path.join(process.cwd(), 'data', 'portais-config.json');

export function getPortais(): PortalConfig[] {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_PORTAIS, null, 2), 'utf8');
    return DEFAULT_PORTAIS;
  }

  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler portais-config.json:', error);
    return DEFAULT_PORTAIS;
  }
}

export function removerPortal(id: string): void {
  const portais = getPortais();
  const novosPortais = portais.filter(p => p.id !== id);
  
  if (novosPortais.length < portais.length) {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(novosPortais, null, 2), 'utf8');
    console.log(`❌ Portal [${id}] fora do ar. Removido permanentemente da lista de buscas automáticas.`);
  }
}
