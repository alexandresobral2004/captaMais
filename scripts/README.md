# 🚀 Scripts de Busca de Editais

Scripts para execução manual e automática (via cron) da busca de editais.

## 📋 Arquivos

### `buscar-editais.sh`
Script principal que executa a busca semanal de editais com validação por keywords.

**Uso:**
```bash
./buscar-editais.sh                    # Execução padrão
./buscar-editais.sh --verbose          # Com logs detalhados
./buscar-editais.sh --dry-run          # Teste sem chamadas reais
./buscar-editais.sh --help             # Mostra ajuda
```

### `setup-cron.sh`
Script interativo para configurar execução automática com cron.

**Uso:**
```bash
./setup-cron.sh                        # Abre menu interativo
```

Menu oferece opções para:
- Agendar segunda-feira 08:00
- Agendar todos os dias 08:00
- Visualizar cron agendado
- Remover cron
- Testar script

## 🚀 Quick Start

### 1. Testar manualmente
```bash
cd /Users/alexandrerocha/captaMais
./scripts/buscar-editais.sh --dry-run
```

### 2. Agendar com cron
```bash
./scripts/setup-cron.sh
# Escolher opção 1 ou 2
```

### 3. Verificar agendamento
```bash
crontab -l | grep buscar-editais
```

### 4. Monitorar logs
```bash
tail -f logs/cron.log
```

## 📝 Documentação Completa

Veja `../GUIA_SCRIPTS_BUSCA.md` para:
- Explicação detalhada
- Todos os exemplos de uso
- Troubleshooting
- Configurações avançadas

## ✅ Checklist de Setup

- [ ] Executar `./buscar-editais.sh --dry-run`
- [ ] Verificar logs em `../logs/`
- [ ] Executar `./setup-cron.sh`
- [ ] Escolher opção 1 ou 2 no menu
- [ ] Confirmar com `crontab -l`
- [ ] Monitorar primeira execução

## 🔍 Locais Importantes

- **Logs de busca:** `../logs/busca-editais-*.log`
- **Logs de validação:** `../data/logs/validacoes/`
- **Editais processados:** `../data/editais.json`
- **Cron log:** `../logs/cron.log`

## 💡 Dicas

- Use `--verbose` para debug
- Use `--dry-run` para testar sem fazer chamadas
- Verifique `../logs/cron.log` para ver execuções agendadas
- Consulte `../GUIA_SCRIPTS_BUSCA.md` para mais detalhes
