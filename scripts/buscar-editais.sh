#!/bin/bash

################################################################################
#                                                                              #
#           SCRIPT DE BUSCA DE EDITAIS - CaptaMais v3.0                      #
#                                                                              #
#  ÚNICO ponto de entrada para busca de novos editais.                      #
#  A interface web (/editais) apenas exibe editais JÁ CADASTRADOS.           #
#                                                                              #
#  FLUXO (v3.0):                                                              #
#    1. Buscar editais nos 5 portais (Prosas, FINEP, CNPq, CAPES, MCT)      #
#    2. Classificar com IA (confiança ≥70%)                                   #
#    3. Baixar PDFs originais (S3 > Link > HTML)                              #
#    4. Extrair texto dos PDFs                                                #
#    5. Salvar com status PENDENTE                                            #
#    6. Usuário analisa manualmente via UI                                    #
#                                                                              #
#  AVISO: A página /editais NÃO faz buscas automáticas na inicialização.    #
#         Para buscar novos editais, use este script EXCLUSIVAMENTE.          #
#                                                                              #
#  Uso:                                                                       #
#    ./scripts/buscar-editais.sh              # Execução manual              #
#    ./scripts/buscar-editais.sh --verbose    # Com logs detalhados         #
#    ./scripts/buscar-editais.sh --help       # Mostra ajuda                #
#                                                                              #
################################################################################

# Configurações
set -e
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/busca-editais-$(date +%Y%m%d-%H%M%S).log"
VERBOSE=false
API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:3000}"
SCAN_TOKEN="${SCAN_TOKEN:-}"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

################################################################################
# FUNÇÕES AUXILIARES
################################################################################

# Log estruturado
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        INFO)
            echo -e "${BLUE}[INFO]${NC} $timestamp - $message" | tee -a "$LOG_FILE"
            ;;
        SUCCESS)
            echo -e "${GREEN}[✓]${NC} $timestamp - $message" | tee -a "$LOG_FILE"
            ;;
        WARNING)
            echo -e "${YELLOW}[⚠]${NC} $timestamp - $message" | tee -a "$LOG_FILE"
            ;;
        ERROR)
            echo -e "${RED}[✗]${NC} $timestamp - $message" | tee -a "$LOG_FILE"
            ;;
        *)
            echo "$message" | tee -a "$LOG_FILE"
            ;;
    esac
}

# Mostrar ajuda
show_help() {
    cat << EOF
╔════════════════════════════════════════════════════════════════╗
║          BUSCA DE EDITAIS - CaptaMais v3.0                    ║
║     Busca → Baixa PDFs → Extrai Texto → Análise Manual        ║
╚════════════════════════════════════════════════════════════════╝

DESCRIÇÃO:
  Script para buscar editais nos 5 portais brasileiros, baixar PDFs,
  extrair texto e preparar para análise manual com IA.

  IMPORTANTE: A página /editais NÃO faz buscas automáticas.
  Este script é o ÚNICO ponto de entrada para novas buscas.

FLUXO (v3.0):
  1. ✅ Busca editais nos 5 portais (Prosas, FINEP, CNPq, CAPES, MCT)
  2. ✅ Classifica com IA (confiança ≥70%)
  3. ✅ Baixa PDFs (S3 > Link direto > Página web)
  4. ✅ Extrai texto dos PDFs
  5. ✅ Armazena com status PENDENTE
  6. ⏳ Usuário revisa via interface /editais
  7. ⏳ Usuário clica "Analisar" nos interessantes
  8. ⏳ IA faz análise completa

ARQUITETURA:
  ┌─────────────────────────────────────────────────────────────┐
  │  Interface Web (/editais)                                   │
  │  → Exibe SOMENTE editais já cadastrados no banco           │
  │  → NÃO executa buscas automáticas na inicialização         │
  └─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (via script ONLY)
  ┌─────────────────────────────────────────────────────────────┐
  │  buscar-editais.sh                                          │
  │  → Busca em 5 portais                                       │
  │  → Salva no banco                                          │
  │  → Interface exibe resultados                              │
  └─────────────────────────────────────────────────────────────┘

OPÇÕES:
  --verbose      Exibe logs detalhados no console
  --dry-run      Simula execução sem fazer chamadas à API
  --url <URL>    Especifica URL da API (default: $API_URL)
  --token <TKN>  Token de segurança para execução
  --help         Mostra esta mensagem

EXEMPLOS:
  # Execução padrão (busca em todos os portais)
  ./scripts/buscar-editais.sh

  # Com modo verbose (mostra detalhes)
  ./scripts/buscar-editais.sh --verbose

  # Teste sem chamar API
  ./scripts/buscar-editais.sh --dry-run

  # Com token específico
  ./scripts/buscar-editais.sh --token seu-token-aqui

LOCALIZAÇÃO DOS ARQUIVOS:
  Logs de execução:     $LOG_DIR/
  PDFs baixados:        $PROJECT_ROOT/data/downloads/
  Editais processados:  $PROJECT_ROOT/data/editais.json
  Cron log:             $LOG_DIR/cron.log

CONFIGURAÇÃO DO CRON:
  Para agendar execução automática toda segunda às 08:00:
  
  0 8 * * 1 cd $PROJECT_ROOT && ./scripts/buscar-editais.sh >> $LOG_DIR/cron.log 2>&1

APÓS A BUSCA:
  1. Acesse http://localhost:3000/editais
  2. Veja lista de editais com status PENDENTE
  3. Revise e exclua os que não interessam
  4. Clique "Analisar" nos que gostaria de estudar
  5. IA fará análise completa (resumo, requisitos, etc)
  6. Revise resultado clicando "Ver Catálogo IA"

OBSERVAÇÕES:
  • Interface web NÃO faz buscas automáticas na inicialização
  • Este script é o ÚNICO ponto de entrada para novas buscas
  • PDFs são armazenados em data/downloads/
  • Texto é extraído do PDF real, não da descrição
  • Análise IA só acontece quando usuário clica "Analisar"

INFORMAÇÕES:
  Versão: 3.0
  Arquitetura: Interface apenas exibe | Script faz buscas
  Status: Análise manual via UI

EOF
}

# Validar pré-requisitos
validate_prerequisites() {
    log INFO "Validando pré-requisitos..."
    
    # Verificar se Node.js está instalado
    if ! command -v node &> /dev/null; then
        log ERROR "Node.js não encontrado. Por favor instale Node.js."
        exit 1
    fi
    log SUCCESS "Node.js encontrado: $(node --version)"
    
    # Verificar se npm está instalado
    if ! command -v npm &> /dev/null; then
        log ERROR "npm não encontrado. Por favor instale npm."
        exit 1
    fi
    log SUCCESS "npm encontrado: $(npm --version)"
    
    # Verificar se curl está instalado
    if ! command -v curl &> /dev/null; then
        log ERROR "curl não encontrado. Por favor instale curl."
        exit 1
    fi
    log SUCCESS "curl encontrado"
    
    # Verificar se diretório do projeto existe
    if [ ! -d "$PROJECT_ROOT" ]; then
        log ERROR "Diretório do projeto não encontrado: $PROJECT_ROOT"
        exit 1
    fi
    log SUCCESS "Projeto encontrado: $PROJECT_ROOT"
}

# Criar diretórios necessários
setup_directories() {
    log INFO "Configurando diretórios..."
    
    mkdir -p "$LOG_DIR"
    mkdir -p "$PROJECT_ROOT/data/logs/validacoes"
    mkdir -p "$PROJECT_ROOT/data/downloads"
    
    log SUCCESS "Diretórios criados/verificados"
}

# Verificar servidor está rodando
check_server() {
    log INFO "Verificando servidor em $API_URL..."
    
    if [ "$DRY_RUN" = true ]; then
        log WARNING "[DRY-RUN] Pulando verificação do servidor"
        return 0
    fi
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL" || echo "000")
    
    if [ "$response" = "000" ]; then
        log ERROR "Servidor não está acessível em $API_URL"
        log INFO "Iniciando servidor..."
        
        # Tentar iniciar servidor
        cd "$PROJECT_ROOT"
        npm run dev > /dev/null 2>&1 &
        sleep 5
        
        # Verificar novamente
        response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL" || echo "000")
        if [ "$response" = "000" ]; then
            log ERROR "Falha ao iniciar servidor"
            exit 1
        fi
    fi
    
    log SUCCESS "Servidor está acessível"
}

# Disparar busca via API
execute_search() {
    log INFO "═══════════════════════════════════════════════════════════════"
    log INFO "FLUXO v3.0: Buscar → Classificar IA → Baixar PDFs → Extrair Texto"
    log INFO "═══════════════════════════════════════════════════════════════"
    log INFO "Disparando busca de editais nos 5 portais..."
    
    if [ "$DRY_RUN" = true ]; then
        log WARNING "[DRY-RUN] Pulando chamada à API (simulação)"
        return 0
    fi
    
    local endpoint="$API_URL/api/jobs/run-weekly-scan"
    local payload="{\"token\":\"$SCAN_TOKEN\"}"
    
    log INFO "Endpoint: $endpoint"
    log INFO "Fase 1: Buscando editais nos 5 portais..."
    log INFO "Fase 2: Classificando com IA (confiança ≥70%)..."
    log INFO "Fase 3: Baixando PDFs originais..."
    log INFO "Fase 4: Extraindo texto e armazenando..."
    log INFO "Iniciando requisição POST..."
    
    local start_time=$(date +%s)
    local response=$(curl -s -X POST "$endpoint" \
        -H "Content-Type: application/json" \
        -d "$payload" 2>&1)
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    log INFO "Resposta recebida em ${duration}s"
    
    if [ "$VERBOSE" = true ]; then
        log INFO "Resposta completa da API:"
        echo "$response" | tee -a "$LOG_FILE"
    fi
    
    # Verificar se resposta é JSON válido
    if echo "$response" | jq . >/dev/null 2>&1; then
        log SUCCESS "Resposta JSON válida"
        
        # Extrair informações da resposta
        local success=$(echo "$response" | jq -r '.success // false')
        local encontrados=$(echo "$response" | jq -r '.estatisticas.totalEditaisValidos // 0')
        local baixados=$(echo "$response" | jq -r '.quantidade // 0')
        
        if [ "$success" = "true" ]; then
            log SUCCESS "✅ Busca concluída com sucesso!"
            log SUCCESS "   • Editais encontrados: $encontrados"
            log SUCCESS "   • PDFs baixados e texto extraído: $baixados"
            log SUCCESS "   • Status: PENDENTE (aguardando análise manual)"
            log INFO ""
            log INFO "📋 PRÓXIMOS PASSOS:"
            log INFO "   1. Acesse http://localhost:3000/editais"
            log INFO "   2. Veja a lista de editais com status PENDENTE"
            log INFO "   3. Revise e exclua os que não interessam"
            log INFO "   4. Clique 'Analisar' nos que gostaria de estudar"
            log INFO "   5. IA fará análise completa (resumo, requisitos, etc)"
            log INFO ""
            log INFO "📁 ARQUIVOS:"
            log INFO "   • PDFs salvos em: $PROJECT_ROOT/data/downloads/"
            log INFO "   • Editais em: $PROJECT_ROOT/data/editais.json"
            log INFO "   • Logs em: $LOG_DIR/"
        else
            log WARNING "Busca retornou sucesso=false"
            log INFO "Detalhes: $response"
        fi
    else
        log WARNING "Resposta não é JSON válido"
        log INFO "Resposta: $response"
    fi
}

# Gerar relatório de PDFs baixados
generate_report() {
    log INFO ""
    log INFO "═══════════════════════════════════════════════════════════════"
    log INFO "📊 RELATÓRIO DE EXECUÇÃO"
    log INFO "═══════════════════════════════════════════════════════════════"
    
    # Contar PDFs baixados
    local pdf_count=$(find "$PROJECT_ROOT/data/downloads" -name "edital-*.pdf" 2>/dev/null | wc -l)
    if [ "$pdf_count" -gt 0 ]; then
        log SUCCESS "PDFs baixados e armazenados: $pdf_count"
        
        # Tamanho total dos PDFs
        local total_size=$(du -sh "$PROJECT_ROOT/data/downloads" 2>/dev/null | cut -f1)
        log INFO "   Tamanho total: $total_size"
    fi
    
    # Contar editais no banco
    if [ -f "$PROJECT_ROOT/data/editais.json" ]; then
        local edital_count=$(jq 'length' "$PROJECT_ROOT/data/editais.json" 2>/dev/null || echo "0")
        log SUCCESS "Editais no banco: $edital_count"
        
        # Contar por status
        local pendentes=$(jq '[.[] | select(.statusAnalise == "pendente")] | length' "$PROJECT_ROOT/data/editais.json" 2>/dev/null || echo "0")
        local analisados=$(jq '[.[] | select(.statusAnalise == "analisado")] | length' "$PROJECT_ROOT/data/editais.json" 2>/dev/null || echo "0")
        
        log INFO "   • Status PENDENTE: $pendentes (aguardando análise)"
        log INFO "   • Status ANALISADO: $analisados (análise completa)"
    fi
    
    log INFO ""
}

# Salvar resultado
save_result() {
    log INFO "Salvando resultado da execução..."
    
    local result_file="$LOG_DIR/resultado-$(date +%Y%m%d-%H%M%S).json"
    
    cat > "$result_file" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "concluído",
  "api_url": "$API_URL",
  "log_file": "$LOG_FILE",
  "projeto": "$PROJECT_ROOT",
  "modo_verbose": $VERBOSE,
  "dry_run": $DRY_RUN
}
EOF
    
    log SUCCESS "Resultado salvo em: $result_file"
}

################################################################################
# MAIN
################################################################################

main() {
    # Parse argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            --verbose)
                VERBOSE=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --url)
                API_URL="$2"
                shift 2
                ;;
            --token)
                SCAN_TOKEN="$2"
                shift 2
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                log ERROR "Opção desconhecida: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Cabeçalho
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║       🚀 BUSCA DE EDITAIS - CaptaMais v3.0                    ║"
    echo "║    Buscar → Baixar PDFs → Extrair Texto → Análise Manual      ║"
    echo "║    ⚠️  Interface /editais NÃO faz buscas automáticas          ║"
    echo "║          Data: $(date '+%d/%m/%Y %H:%M:%S')                       ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Setup
    setup_directories
    
    log INFO "Log será salvo em: $LOG_FILE"
    log INFO ""
    
    # Validar pré-requisitos
    validate_prerequisites
    
    # Verificar servidor
    check_server
    
    # Executar busca
    execute_search
    
    # Gerar relatório
    generate_report
    
    # Salvar resultado
    save_result
    
    # Rodapé
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                ✅ EXECUÇÃO CONCLUÍDA COM SUCESSO               ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📁 ARQUIVOS GERADOS:"
    echo "   Logs:          $LOG_DIR/"
    echo "   Editais:       $PROJECT_ROOT/data/editais.json"
    echo "   PDFs:          $PROJECT_ROOT/data/downloads/"
    echo ""
    echo "📋 ACESSE A INTERFACE:"
    echo "   → http://localhost:3000/editais"
    echo "   → Veja os editais buscados com status PENDENTE"
    echo ""
    echo "⚠️  LEMBRETE:"
    echo "   • Interface /editais NÃO faz buscas automáticas"
    echo "   • Para buscar novos editais, execute este script"
    echo "   • Cron pode automatizar execução (0 8 * * 1)"
    echo ""
}

# Executar main
main "$@"
