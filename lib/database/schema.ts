import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ============================================================
// TABELA PRINCIPAL - EDITAIS
// ============================================================
export const editais = sqliteTable('editais', {
  id: text('id').primaryKey(),
  titulo: text('titulo').notNull(),
  orgao: text('orgao').notNull(),

  // Financeiro
  valor: text('valor'),
  valorMin: real('valor_min'),
  valorMax: real('valor_max'),

  // Datas
  dataPublicacao: text('data_publicacao'),
  dataLimite: text('data_limite').notNull(),
  dataResultado: text('data_resultado'),

  // Status
  status: text('status', {
    enum: ['Aberto', 'Prorrogado', 'Em Analise', 'Fechado']
  }).notNull().default('Aberto'),
  statusAnalise: text('status_analise', {
    enum: ['pendente', 'pdf_baixado', 'analisado', 'sem_pdf', 'descartado', 'erro']
  }).default('pendente'),
  modalidade: text('modalidade'),
  abrangencia: text('abrangencia'),

  // Classificacao
  tipoProponente: text('tipo_proponente'), // JSON array serializado
  areasTematicas: text('areas_tematicas'), // JSON array serializado
  tipoEdital: text('tipo_edital', {
    enum: ['chamada_publica', 'evento_cientifico', 'outro']
  }),

  // Conteudo
  descricao: text('descricao'),
  link: text('link').notNull(),
  pdfUrl: text('pdf_url'),
  pdfPath: text('pdf_path'), // Caminho relativo do PDF local
  conteudoCompleto: text('conteudo_completo'),
  fonteConteudo: text('fonte_conteudo', {
    enum: ['pdf_s3', 'pdf_link', 'html_link', 'descricao_api', 'mock', 'sem_pdf']
  }),

  // Anexo JSON serializado (arquivos do S3)
  arquivosAnexos: text('arquivos_anexos'), // JSON array serializado

  // Analise TI
  tecnologiaFoco: text('tecnologia_foco'),
  tipoFerramenta: text('tipo_ferramenta'),
  scoreRelevancia: integer('score_relevancia'),
  scoreConfiancaIa: integer('score_confianca_ia'),
  validadoPorIa: integer('validado_por_ia', { mode: 'boolean' }).default(false),
  motivoRejeicao: text('motivo_rejeicao'),
  foraDoEscopo: integer('fora_do_escopo', { mode: 'boolean' }).default(false),
  dataValidacaoIa: text('data_validacao_ia'),
  scorePontuacao: integer('score_pontuacao'),
  nivelPontuacao: text('nivel_pontuacao', {
    enum: ['baixo', 'medio', 'alto']
  }),
  motivosPontuacao: text('motivos_pontuacao'), // JSON array serializado
  modoAnaliseIa: text('modo_analise_ia', {
    enum: ['ignorar', 'simplificado', 'completo']
  }),
  hashPontuacao: text('hash_pontuacao'),
  cacheClassificacaoUsado: integer('cache_classificacao_usado', { mode: 'boolean' }).default(false),
  confiancaPorCampo: text('confianca_por_campo'), // JSON object serializado

  // Timestamps
  criadoEm: text('criado_em').default('CURRENT_TIMESTAMP'),
  atualizadoEm: text('atualizado_em').default('CURRENT_TIMESTAMP'),
}, (table) => {
  return {
    statusIdx: index('idx_editais_status').on(table.status),
    dataLimiteIdx: index('idx_editais_data_limite').on(table.dataLimite),
    orgaoIdx: index('idx_editais_orgao').on(table.orgao),
    scoreIdx: index('idx_editais_score').on(table.scoreRelevancia),
    tecnologiaIdx: index('idx_editais_tecnologia').on(table.tecnologiaFoco),
    criadoEmIdx: index('idx_editais_criado_em').on(table.criadoEm),
  };
});

// ============================================================
// RELACIONAMENTOS
// ============================================================
export const editaisRelations = relations(editais, ({ many, one }) => ({
  analiseIa: one(analiseIa, {
    fields: [editais.id],
    references: [analiseIa.editalId],
  }),
  palavrasChave: many(palavrasChave),
  arquivosAnexos: many(arquivosAnexos),
  motivosPontuacao: many(motivosPontuacao),
}));

// ============================================================
// TABELA ANALISE IA
// ============================================================
export const analiseIa = sqliteTable('analise_ia', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  editalId: text('edital_id').notNull().unique().references(() => editais.id, { onDelete: 'cascade' }),
  resumo: text('resumo'),
  objetivo: text('objetivo'),
  elegibilidade: text('elegibilidade'),
  contatoEdital: text('contato_edital'),
  scoreAdequacao: integer('score_adequacao'),
  criadoEm: text('criado_em').default('CURRENT_TIMESTAMP'),
  atualizadoEm: text('atualizado_em').default('CURRENT_TIMESTAMP'),
});

export const analiseIaRelations = relations(analiseIa, ({ one, many }) => ({
  edital: one(editais, {
    fields: [analiseIa.editalId],
    references: [editais.id],
  }),
  requisitos: many(analiseRequisitos),
  itensFinanciaveis: many(analiseItensFinanciaveis),
  documentos: many(analiseDocumentos),
  criterios: many(analiseCriterios),
  pontosFracos: many(analisePontosFracos),
}));

// ============================================================
// TABELA REQUISITOS DA ANALISE
// ============================================================
export const analiseRequisitos = sqliteTable('analise_requisitos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  analiseId: integer('analise_id').notNull().references(() => analiseIa.id, { onDelete: 'cascade' }),
  requisito: text('requisito').notNull(),
  ordem: integer('ordem').default(0),
});

export const analiseRequisitosRelations = relations(analiseRequisitos, ({ one }) => ({
  analise: one(analiseIa, {
    fields: [analiseRequisitos.analiseId],
    references: [analiseIa.id],
  }),
}));

// ============================================================
// TABELA ITENS FINANCIAVEIS DA ANALISE
// ============================================================
export const analiseItensFinanciaveis = sqliteTable('analise_itens_financiaveis', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  analiseId: integer('analise_id').notNull().references(() => analiseIa.id, { onDelete: 'cascade' }),
  item: text('item').notNull(),
  ordem: integer('ordem').default(0),
});

export const analiseItensFinanciaveisRelations = relations(analiseItensFinanciaveis, ({ one }) => ({
  analise: one(analiseIa, {
    fields: [analiseItensFinanciaveis.analiseId],
    references: [analiseIa.id],
  }),
}));

// ============================================================
// TABELA DOCUMENTOS NECESSARIOS
// ============================================================
export const analiseDocumentos = sqliteTable('analise_documentos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  analiseId: integer('analise_id').notNull().references(() => analiseIa.id, { onDelete: 'cascade' }),
  documento: text('documento').notNull(),
  ordem: integer('ordem').default(0),
});

export const analiseDocumentosRelations = relations(analiseDocumentos, ({ one }) => ({
  analise: one(analiseIa, {
    fields: [analiseDocumentos.analiseId],
    references: [analiseIa.id],
  }),
}));

// ============================================================
// TABELA CRITERIOS DE AVALIACAO
// ============================================================
export const analiseCriterios = sqliteTable('analise_criterios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  analiseId: integer('analise_id').notNull().references(() => analiseIa.id, { onDelete: 'cascade' }),
  criterio: text('criterio').notNull(),
  ordem: integer('ordem').default(0),
});

export const analiseCriteriosRelations = relations(analiseCriterios, ({ one }) => ({
  analise: one(analiseIa, {
    fields: [analiseCriterios.analiseId],
    references: [analiseIa.id],
  }),
}));

// ============================================================
// TABELA PONTOS FRACOS
// ============================================================
export const analisePontosFracos = sqliteTable('analise_pontos_fracos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  analiseId: integer('analise_id').notNull().references(() => analiseIa.id, { onDelete: 'cascade' }),
  pontoFraco: text('ponto_fraco').notNull(),
  ordem: integer('ordem').default(0),
});

export const analisePontosFracosRelations = relations(analisePontosFracos, ({ one }) => ({
  analise: one(analiseIa, {
    fields: [analisePontosFracos.analiseId],
    references: [analiseIa.id],
  }),
}));

// ============================================================
// TABELA PALAVRAS CHAVE
// ============================================================
export const palavrasChave = sqliteTable('palavras_chave', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  editalId: text('edital_id').notNull().references(() => editais.id, { onDelete: 'cascade' }),
  palavra: text('palavra').notNull(),
  frequencia: integer('frequencia').default(1),
});

export const palavrasChaveRelations = relations(palavrasChave, ({ one }) => ({
  edital: one(editais, {
    fields: [palavrasChave.editalId],
    references: [editais.id],
  }),
}));

// ============================================================
// TABELA ARQUIVOS ANEXOS
// ============================================================
export const arquivosAnexos = sqliteTable('arquivos_anexos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  editalId: text('edital_id').notNull().references(() => editais.id, { onDelete: 'cascade' }),
  descricao: text('descricao'),
  url: text('url'),
  tipo: text('tipo'),
  caminhoLocal: text('caminho_local'),
  tamanhoBytes: integer('tamanho_bytes'),
  hashArquivo: text('hash_arquivo'),
  criadoEm: text('criado_em').default('CURRENT_TIMESTAMP'),
});

export const arquivosAnexosRelations = relations(arquivosAnexos, ({ one }) => ({
  edital: one(editais, {
    fields: [arquivosAnexos.editalId],
    references: [editais.id],
  }),
}));

// ============================================================
// TABELA MOTIVOS DE PONTUACAO
// ============================================================
export const motivosPontuacao = sqliteTable('motivos_pontuacao', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  editalId: text('edital_id').notNull().references(() => editais.id, { onDelete: 'cascade' }),
  motivo: text('motivo').notNull(),
});

export const motivosPontuacaoRelations = relations(motivosPontuacao, ({ one }) => ({
  edital: one(editais, {
    fields: [motivosPontuacao.editalId],
    references: [editais.id],
  }),
}));

// ============================================================
// TABELA USUARIOS
// ============================================================
export const usuarios = sqliteTable('usuarios', {
  id: text('id').primaryKey(),
  nome: text('nome').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'editor', 'leitor'] }).notNull().default('leitor'),
  status: text('status', { enum: ['ativo', 'inativo'] }).notNull().default('ativo'),
  criadoEm: text('criado_em').default('CURRENT_TIMESTAMP'),
  atualizadoEm: text('atualizado_em').default('CURRENT_TIMESTAMP'),
});

// ============================================================
// TABELA AREAS TEMATICAS
// ============================================================
export const areasTematicas = sqliteTable('areas_tematicas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull().unique(),
});

// ============================================================
// TABELA TIPOS DE PROPONENTE
// ============================================================
export const tiposProponente = sqliteTable('tipos_proponente', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull().unique(),
});
