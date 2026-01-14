# Scripts de base de données

Ce dossier contient les scripts pour initialiser et gérer la base de données PostgreSQL.

## 📋 Scripts disponibles

### 1. `init.sql` - Script SQL brut
Script SQL pur pour créer les tables et insérer des données de test.

**Usage avec psql :**
```bash
psql -h dpg-d4i74gi4d50c73cojs30-a.oregon-postgres.render.com -U pollution_user -d pollution -f database/init.sql
```

**Ou depuis la racine du projet API :**
```bash
npm run db:init:sql
```

### 2. `seed.js` - Peuplement avec Sequelize
Script Node.js qui utilise Sequelize pour créer les tables et insérer des données.
**Attention : Ce script supprime et recrée toutes les tables (force: true).**

**Usage :**
```bash
node database/seed.js
```

**Ou avec npm :**
```bash
npm run db:seed
```

### 3. `reset.js` - Réinitialisation
Script pour supprimer toutes les données sans détruire la structure des tables.

**Usage :**
```bash
node database/reset.js
```

**Ou avec npm :**
```bash
npm run db:reset
```

## 🗄️ Structure de la base de données

### Table `utilisateurs`
- `id` (VARCHAR) - Clé primaire, UUID
- `nom` (VARCHAR) - Nom de l'utilisateur (obligatoire)
- `prenom` (VARCHAR) - Prénom
- `login` (VARCHAR) - Identifiant unique (obligatoire)
- `pass` (VARCHAR) - Mot de passe

### Table `pollutions`
- `id` (SERIAL) - Clé primaire auto-incrémentée
- `titre` (VARCHAR) - Titre du signalement (obligatoire)
- `lieu` (VARCHAR) - Lieu de l'observation
- `date_observation` (TIMESTAMP) - Date et heure
- `type_pollution` (VARCHAR) - Type (Déchets, Eau, Hydrocarbures...)
- `description` (TEXT) - Description détaillée
- `latitude` (DECIMAL) - Coordonnée GPS
- `longitude` (DECIMAL) - Coordonnée GPS
- `photo_url` (VARCHAR) - URL de la photo

## 🚀 Workflows recommandés

### Première initialisation
```bash
npm run db:seed
```

### Vider les données mais garder les tables
```bash
npm run db:reset
```

### Re-peupler après un reset
```bash
npm run db:seed
```

## ⚠️ Notes importantes

- Le script `seed.js` utilise `sync({ force: true })` qui **SUPPRIME ET RECRÉE** toutes les tables
- Assurez-vous d'avoir les bonnes credentials dans `api/config.js`
- La connexion SSL est activée pour Render
- Les timestamps Sequelize sont désactivés (`timestamps: false`)
