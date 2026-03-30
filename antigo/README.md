# Backup — Código React/TypeScript (v1)

Este directório contém o backup completo do site **Editora Graça** na versão React + TypeScript + Vite.

**Data do backup:** 2026-03-30  
**Motivação:** Migração para PHP + HTML + JS vanilla, mantendo Firebase/Firestore como base de dados.

## Conteúdo

| Pasta/Ficheiro | Descrição |
| --- | --- |
| `src/` | Código fonte completo (componentes, páginas, serviços) |
| `index.html` | Entry point da SPA |
| `package.json` | Dependências npm |
| `vite.config.ts` | Configuração do bundler Vite |
| `tsconfig.json` | Configuração TypeScript |
| `firestore.rules` | Regras de segurança Firestore |
| `storage.rules` | Regras de segurança Firebase Storage |
| `vercel.json` | Configuração de deploy Vercel |

## Para restaurar

O histório Git completo está sempre disponível:

```bash
git log --oneline   # ver todos os commits
git checkout <hash> # voltar a qualquer versão
```
