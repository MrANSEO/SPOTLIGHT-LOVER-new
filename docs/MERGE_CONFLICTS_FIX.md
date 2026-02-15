# Résoudre les conflits de merge (branche `work`)

Tu as signalé des conflits sur ces fichiers :

- `backend/src/modules/candidates/candidates.controller.ts`
- `backend/src/modules/candidates/candidates.service.ts`
- `backend/src/modules/users/users.service.ts`
- `frontend/src/pages/public/CandidateApply.jsx`
- `frontend/src/pages/public/CandidatePaymentCallback.jsx`

## Option rapide (recommandée ici)

Si tu veux **garder la version actuelle de la branche `work`** pour ces 5 fichiers (c’est la version la plus récente qu’on a stabilisée), fais :

```bash
# 1) Lance ton merge/rebase jusqu'au stop sur conflits
# ex: git merge main

# 2) Depuis la racine du repo, exécute:
./resolve_conflicts_keep_work.sh

# 3) Continue:
git merge --continue
# ou
git rebase --continue
```

## Option manuelle (si tu veux mixer les changements)

```bash
# Voir les conflits
git status

# Ouvrir chaque fichier, garder les blocs utiles, enlever:
# <<<<<<<
# =======
# >>>>>>>

# Puis:
git add backend/src/modules/candidates/candidates.controller.ts
git add backend/src/modules/candidates/candidates.service.ts
git add backend/src/modules/users/users.service.ts
git add frontend/src/pages/public/CandidateApply.jsx
git add frontend/src/pages/public/CandidatePaymentCallback.jsx

git merge --continue  # ou rebase --continue
```

## Vérification après résolution

```bash
# Plus aucun conflit
git status

# Build frontend
cd frontend && npm run build
```

> Note: le backend peut encore échouer à build dans certains environnements sans dépendances Node installées (`nest: not found`).
