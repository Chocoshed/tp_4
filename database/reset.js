/**
 * Script de réinitialisation de la base de données
 * Supprime toutes les données mais garde la structure des tables
 * 
 * Usage: npm run db:reset (depuis le dossier api/api)
 */

const db = require('../api/models');

async function resetDatabase() {
  try {
    console.log('🔄 Connexion à la base de données...');
    
    await db.sequelize.authenticate();
    console.log('✅ Connexion établie.');

    console.log('\n⚠️  Suppression de toutes les données...');
    
    // Supprimer toutes les pollutions AVANT les utilisateurs (à cause de la clé étrangère)
    const deletedPollutions = await db.pollution.destroy({
      where: {},
      truncate: true
    });
    console.log(`✅ Pollutions supprimées.`);

    // Supprimer tous les utilisateurs avec CASCADE pour gérer les contraintes
    const deletedUtilisateurs = await db.utilisateurs.destroy({
      where: {},
      truncate: { cascade: true }
    });
    console.log(`✅ Utilisateurs supprimés.`);

    console.log('\n✨ Base de données réinitialisée avec succès!');
    
    await db.sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    process.exit(1);
  }
}

resetDatabase();
