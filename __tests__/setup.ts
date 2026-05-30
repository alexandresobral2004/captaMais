import { vi, beforeEach } from 'vitest';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../lib/database/schema';

export function createTestDb() {
  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');

  const testDb = drizzle(sqlite, { schema });

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS editais (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      orgao TEXT NOT NULL,
      valor TEXT,
      valor_min REAL,
      valor_max REAL,
      data_publicacao TEXT,
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

  // FTS5 for SearchRepository tests
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

  return { db: testDb, rawDb: sqlite };
}

export function clearAllTables(rawDb: Database.Database) {
  rawDb.exec('DELETE FROM analise_pontos_fracos');
  rawDb.exec('DELETE FROM analise_criterios');
  rawDb.exec('DELETE FROM analise_documentos');
  rawDb.exec('DELETE FROM analise_itens_financiaveis');
  rawDb.exec('DELETE FROM analise_requisitos');
  rawDb.exec('DELETE FROM analise_ia');
  rawDb.exec('DELETE FROM palavras_chave');
  rawDb.exec('DELETE FROM arquivos_anexos');
  rawDb.exec('DELETE FROM motivos_pontuacao');
  rawDb.exec('DELETE FROM editais');
}

export function setupTestDbMock() {
  const { db: testDb, rawDb } = createTestDb();

  vi.doMock('../lib/database/db', () => ({
    db: testDb,
    getRawDb: () => rawDb,
    execSQL: (sql: string) => rawDb.exec(sql),
  }));

  return { db: testDb, rawDb };
}

beforeEach(() => {
  vi.restoreAllMocks();
});
