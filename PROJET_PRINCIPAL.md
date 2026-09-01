# ✅ DOSSIER PRINCIPAL — C'EST ICI QU'IL FAUT TRAVAILLER

Ce dossier est le **vrai dépôt git** connecté à GitHub et déployé sur Netlify.

- **Site en ligne** : https://apptrad.netlify.app
- **GitHub** : https://github.com/lambinetarnaud-create/traduction-fronti-re
- **Branche** : main

## Fichiers du projet

| Fichier | Rôle |
|---|---|
| `index.html` | Page principale — structure HTML, styles inlinés, meta PWA |
| `app.js` | Données (20 langues × 20 phrases, liens, codes visa) + logique |
| `legislation.html` / `legislation.js` | Page législation (Irlande/Chypre, codes IATA, tableau visas) |
| `legislation_full.html` / `legislation_full.js` | Variante longue de la page législation |
| `404.html` | Page d'erreur personnalisée |
| `manifest.json` | Manifeste PWA (installation sur téléphone) |
| `sw.js` | Service worker — fonctionnement hors-ligne |
| `fonts.css` + `fonts/` | Polices auto-hébergées (DM Sans, Playfair Display) |
| `netlify.toml` | Headers de sécurité (CSP), types MIME, caches |
| `icons/` | Icônes PWA — dont `icon-512-maskable.png` pour Android |
| `Audio/` | 380 MP3, un dossier par langue (Q1→Q20) |

⚠️ Il n'y a **pas** de `style.css` : tous les styles sont dans le `<style>` d'`index.html`.

## ⚠️ Après une modification importante

Changer le numéro de version en haut de `sw.js` :

```js
const VERSION = "apptrad-v1";   // → "apptrad-v2", etc.
```

Sans ça, les téléphones qui ont déjà installé l'app continuent d'afficher
l'ancienne version depuis leur cache.

## Pour déployer

```bash
cd "C:\Users\souve\Documents\web\appli trad\traduction-fronti-re"
git add .
git commit -m "votre message"
git push
```

Netlify redéploie automatiquement après le push.

---
⚠️ Ne rien modifier dans `../_archive/` : ce sont d'anciennes copies, jamais déployées.
