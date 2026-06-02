import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db', 'editais.db');

// Garantir que o diretorio existe
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Criar conexao SQLite
const sqlite = new Database(DB_PATH);

// Configuracoes de performance e integridade
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');
sqlite.pragma('synchronous = NORMAL');
sqlite.pragma('cache_size = -64000'); // 64MB cache

// Criar instancia Drizzle
export const db = drizzle(sqlite, { schema });

// Funcao para executar SQL bruto
export function execSQL(sql: string) {
  sqlite.exec(sql);
}

// Funcao para obter a conexao raw
export function getRawDb() {
  return sqlite;
}

// Funcao para configurar FTS5
export function setupFTS() {
  sqlite.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS editais_fts USING fts5(
      titulo,
      descricao,
      conteudo_completo,
      orgao,
      content='editais',
      content_rowid='rowid',
      tokenize="unicode61 remove_diacritics 2"
    );
  `);

  // Criar triggers para manter FTS sincronizado
  sqlite.exec(`
    CREATE TRIGGER IF NOT EXISTS editais_fts_insert AFTER INSERT ON editais BEGIN
      INSERT INTO editais_fts(rowid, titulo, descricao, conteudo_completo, orgao)
      VALUES (new.rowid, new.titulo, new.descricao, new.conteudo_completo, new.orgao);
    END;
  `);

  sqlite.exec(`
    CREATE TRIGGER IF NOT EXISTS editais_fts_delete AFTER DELETE ON editais BEGIN
      DELETE FROM editais_fts WHERE rowid = old.rowid;
    END;
  `);

  sqlite.exec(`
    CREATE TRIGGER IF NOT EXISTS editais_fts_update AFTER UPDATE ON editais BEGIN
      DELETE FROM editais_fts WHERE rowid = old.rowid;
      INSERT INTO editais_fts(rowid, titulo, descricao, conteudo_completo, orgao)
      VALUES (new.rowid, new.titulo, new.descricao, new.conteudo_completo, new.orgao);
    END;
  `);
}

// Funcao para criar tabelas (primeira execucao)
export function createTables() {
  try {
    // Evitar múltiplas inicializações
    sqlite.exec(`
    CREATE TABLE IF NOT EXISTS editais (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      orgao TEXT NOT NULL,
      valor TEXT,
      valor_min REAL,
      valor_max REAL,
      data_publicacao TEXT,
      data_abertura TEXT,
      data_limite TEXT NOT NULL,
      data_resultado TEXT,
      status TEXT NOT NULL DEFAULT 'Aberto',
      status_analise TEXT DEFAULT 'pendente',
      modalidade TEXT,
      abrangencia TEXT,
      tipo_proponente TEXT,
      areas_tematicas TEXT,
      tipo_edital TEXT,
      descricao TEXT,
      link TEXT NOT NULL,
      pdf_url TEXT,
      pdf_path TEXT,
      conteudo_completo TEXT,
      fonte_conteudo TEXT,
      arquivos_anexos TEXT,
      tecnologia_foco TEXT,
      tipo_ferramenta TEXT,
      score_relevancia INTEGER,
      score_confianca_ia INTEGER,
      validado_por_ia INTEGER DEFAULT 0,
      motivo_rejeicao TEXT,
      fora_do_escopo INTEGER DEFAULT 0,
      data_validacao_ia TEXT,
      score_pontuacao INTEGER,
      nivel_pontuacao TEXT,
      motivos_pontuacao TEXT,
      modo_analise_ia TEXT,
      hash_pontuacao TEXT,
      cache_classificacao_usado INTEGER DEFAULT 0,
      confianca_por_campo TEXT,
      criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS analise_ia (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edital_id TEXT NOT NULL UNIQUE,
      resumo TEXT,
      objetivo TEXT,
      elegibilidade TEXT,
      contato_edital TEXT,
      score_adequacao INTEGER,
      criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (edital_id) REFERENCES editais(id) ON DELETE CASCADE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS analise_requisitos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      analise_id INTEGER NOT NULL,
      requisito TEXT NOT NULL,
      ordem INTEGER DEFAULT 0,
      FOREIGN KEY (analise_id) REFERENCES analise_ia(id) ON DELETE CASCADE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS analise_itens_financiaveis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      analise_id INTEGER NOT NULL,
      item TEXT NOT NULL,
      ordem INTEGER DEFAULT 0,
      FOREIGN KEY (analise_id) REFERENCES analise_ia(id) ON DELETE CASCADE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS analise_documentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      analise_id INTEGER NOT NULL,
      documento TEXT NOT NULL,
      ordem INTEGER DEFAULT 0,
      FOREIGN KEY (analise_id) REFERENCES analise_ia(id) ON DELETE CASCADE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS analise_criterios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      analise_id INTEGER NOT NULL,
      criterio TEXT NOT NULL,
      ordem INTEGER DEFAULT 0,
      FOREIGN KEY (analise_id) REFERENCES analise_ia(id) ON DELETE CASCADE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS analise_pontos_fracos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      analise_id INTEGER NOT NULL,
      ponto_fraco TEXT NOT NULL,
      ordem INTEGER DEFAULT 0,
      FOREIGN KEY (analise_id) REFERENCES analise_ia(id) ON DELETE CASCADE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS palavras_chave (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edital_id TEXT NOT NULL,
      palavra TEXT NOT NULL,
      frequencia INTEGER DEFAULT 1,
      FOREIGN KEY (edital_id) REFERENCES editais(id) ON DELETE CASCADE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS arquivos_anexos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edital_id TEXT NOT NULL,
      descricao TEXT,
      url TEXT,
      tipo TEXT,
      caminho_local TEXT,
      tamanho_bytes INTEGER,
      hash_arquivo TEXT,
      criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (edital_id) REFERENCES editais(id) ON DELETE CASCADE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS motivos_pontuacao (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edital_id TEXT NOT NULL,
      motivo TEXT NOT NULL,
      FOREIGN KEY (edital_id) REFERENCES editais(id) ON DELETE CASCADE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS areas_tematicas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS tipos_proponente (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'leitor',
      status TEXT NOT NULL DEFAULT 'ativo',
      criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS projetos (
      id TEXT PRIMARY KEY,
      edital_id TEXT NOT NULL,
      titulo TEXT NOT NULL,
      descricao TEXT,
      area_atuacao TEXT,
      proposta_usuario TEXT,
      resumo_executivo TEXT,
      justificativa TEXT,
      objetivos TEXT,
      metodologia TEXT,
      resultados_esperados TEXT,
      cronograma TEXT,
      orcamento_detalhado TEXT,
      valor_solicitado REAL,
      prazo_meses INTEGER,
      equipe TEXT,
      criterios_atendidos TEXT,
      criterios_pendentes TEXT,
      score_compliance INTEGER,
      status TEXT DEFAULT 'rascunho',
      versao INTEGER DEFAULT 1,
      prompt_original TEXT,
      criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (edital_id) REFERENCES editais(id) ON DELETE CASCADE
    );
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS logs_sistema (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nivel TEXT NOT NULL CHECK(nivel IN ('error', 'warning', 'info')),
      mensagem TEXT NOT NULL,
      cenario_falha TEXT,
      acao_tomada TEXT CHECK(acao_tomada IN ('retry', 'mark_error', 'human_review', 'skip', 'fallback', 'ignore')),
      repeticoes INTEGER DEFAULT 0,
      contexto TEXT,
      caminho TEXT,
      detalhes TEXT,
      usuario_id TEXT,
      ip TEXT,
      user_agent TEXT,
      criado_em TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Criar indices
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_editais_status ON editais(status);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_editais_data_limite ON editais(data_limite);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_editais_orgao ON editais(orgao);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_editais_score ON editais(score_relevancia);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_editais_tecnologia ON editais(tecnologia_foco);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_editais_criado_em ON editais(criado_em);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_palavras_edital ON palavras_chave(edital_id);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_arquivos_edital ON arquivos_anexos(edital_id);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_projetos_edital_id ON projetos(edital_id);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_projetos_status ON projetos(status);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_projetos_criado_em ON projetos(criado_em);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_logs_nivel ON logs_sistema(nivel);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_logs_criado_em ON logs_sistema(criado_em);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_logs_contexto ON logs_sistema(contexto);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_logs_cenario ON logs_sistema(cenario_falha);`);
  sqlite.exec(`CREATE INDEX IF NOT EXISTS idx_logs_acao ON logs_sistema(acao_tomada);`);

  // Setup FTS
  setupFTS();
  } catch (error) {
    console.warn('Erro ao criar tabelas do banco:', error);
  }
}

// Migração: adicionar colunas novas que podem não existir em bancos antigos
function migrateSchema() {
  try {
    // Migração da tabela editais
    const columns = sqlite.prepare("PRAGMA table_info(editais)").all() as any[];

    const hasDataAbertura = columns.some((col: any) => col.name === 'data_abertura');
    if (!hasDataAbertura) {
      sqlite.exec(`ALTER TABLE editais ADD COLUMN data_abertura TEXT`);
      console.log('✅ Migração: coluna data_abertura adicionada');
    }

    const hasConfiancaPorCampo = columns.some((col: any) => col.name === 'confianca_por_campo');
    if (!hasConfiancaPorCampo) {
      sqlite.exec(`ALTER TABLE editais ADD COLUMN confianca_por_campo TEXT`);
      console.log('✅ Migração: coluna confianca_por_campo adicionada');
    }

    // Migração: adicionar coluna codigo na tabela editais
    const hasCodigo = columns.some((col: any) => col.name === 'codigo');
    if (!hasCodigo) {
      sqlite.exec(`ALTER TABLE editais ADD COLUMN codigo TEXT UNIQUE`);
      console.log('✅ Migração: coluna codigo adicionada à tabela editais');
    }

    // Migração: adicionar coluna fontes na tabela projetos
    const projColumns = sqlite.prepare("PRAGMA table_info(projetos)").all() as any[];
    const hasFontes = projColumns.some((col: any) => col.name === 'fontes');
    if (!hasFontes) {
      sqlite.exec(`ALTER TABLE projetos ADD COLUMN fontes TEXT`);
      console.log('✅ Migração: coluna fontes adicionada à tabela projetos');
    }

    // Migração: adicionar colunas na tabela logs_sistema
    const logColumns = sqlite.prepare("PRAGMA table_info(logs_sistema)").all() as any[];

    const hasCenarioFalha = logColumns.some((col: any) => col.name === 'cenario_falha');
    if (!hasCenarioFalha) {
      sqlite.exec(`ALTER TABLE logs_sistema ADD COLUMN cenario_falha TEXT`);
      console.log('✅ Migração: coluna cenario_falha adicionada à tabela logs_sistema');
    }

    const hasAcaoTomada = logColumns.some((col: any) => col.name === 'acao_tomada');
    if (!hasAcaoTomada) {
      sqlite.exec(`ALTER TABLE logs_sistema ADD COLUMN acao_tomada TEXT CHECK(acao_tomada IN ('retry', 'mark_error', 'human_review', 'skip', 'fallback', 'ignore'))`);
      console.log('✅ Migração: coluna acao_tomada adicionada à tabela logs_sistema');
    }

    const hasRepeticoes = logColumns.some((col: any) => col.name === 'repeticoes');
    if (!hasRepeticoes) {
      sqlite.exec(`ALTER TABLE logs_sistema ADD COLUMN repeticoes INTEGER DEFAULT 0`);
      console.log('✅ Migração: coluna repeticoes adicionada à tabela logs_sistema');
    }
  } catch (error: any) {
    // Coluna já existe ou outro erro irrelevante — silenciar
    if (!error.message?.includes('duplicate column')) {
      console.warn('Erro na migração:', error.message);
    }
  }
}

// Inicializar tabelas na primeira execucao (server-side only)
let initialized = false;

if (typeof window === 'undefined') {
  try {
    if (!initialized) {
      initialized = true;
      createTables();
      migrateSchema();
    }
  } catch (error) {
    console.warn('Erro ao criar tabelas:', error);
  }
}
