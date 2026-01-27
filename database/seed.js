/**
 * Script de peuplement (seed) de la base de données
 * Utilise Sequelize pour créer les tables et insérer des données de test
 * 
 * Usage: npm run db:seed (depuis le dossier api/api)
 */

const { v4: uuidv4 } = require('../api/node_modules/uuid');
const db = require('../api/models');

const utilisateursData = [
  {
    id: uuidv4(),
    nom: 'Dupont',
    prenom: 'Jean',
    login: 'jean.dupont',
    pass: 'password123'
  },
  {
    id: uuidv4(),
    nom: 'Martin',
    prenom: 'Sophie',
    login: 'sophie.martin',
    pass: 'password456'
  },
  {
    id: uuidv4(),
    nom: 'Bernard',
    prenom: 'Luc',
    login: 'luc.bernard',
    pass: 'password789'
  }
];

const pollutionsData = [
  {
    titre: 'Déchets plastiques sur la plage',
    lieu: 'Plage de Nice',
    date_observation: new Date('2025-12-15 14:30:00'),
    type_pollution: 'Déchets',
    description: 'Nombreux déchets plastiques observés sur le sable',
    latitude: 43.695949,
    longitude: 7.271413,
    photo_url: null,
    utilisateur_id: null  // Sera défini après la création des utilisateurs
  },
  {
    titre: 'Fuite d\'huile moteur',
    lieu: 'Parking Leclerc, Lyon',
    date_observation: new Date('2026-01-05 10:15:00'),
    type_pollution: 'Hydrocarbures',
    description: 'Grande flaque d\'huile dans le parking',
    latitude: 45.764043,
    longitude: 4.835659,
    photo_url: null,
    utilisateur_id: null  // Sera défini après la création des utilisateurs
  },
  {
    titre: 'Décharge sauvage en forêt',
    lieu: 'Forêt de Fontainebleau',
    date_observation: new Date('2026-01-08 09:00:00'),
    type_pollution: 'Déchets',
    description: 'Plusieurs sacs poubelles abandonnés',
    latitude: 48.404842,
    longitude: 2.700348,
    photo_url: null,
    utilisateur_id: null  // Sera défini après la création des utilisateurs
  },
  {
    titre: 'Pollution de rivière',
    lieu: 'Rivière Le Lez, Montpellier',
    date_observation: new Date('2026-01-10 16:45:00'),
    type_pollution: 'Eau',
    description: 'Eau trouble avec mousse blanche suspecte',
    latitude: 43.610769,
    longitude: 3.876716,
    photo_url: null,
    utilisateur_id: null  // Sera défini après la création des utilisateurs
  },
  {
    titre: 'Dépôt de gravats',
    lieu: 'Rue de la République, Marseille',
    date_observation: new Date('2026-01-12 11:20:00'),
    type_pollution: 'Déchets',
    description: 'Tas de gravats déposé illégalement',
    latitude: 43.296482,
    longitude: 5.369780,
    photo_url: null,
    utilisateur_id: null  // Sera défini après la création des utilisateurs
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Connexion à la base de données...');
    
    // Tester la connexion
    await db.sequelize.authenticate();
    console.log('✅ Connexion établie avec succès.');

    console.log('\n🔄 Synchronisation des modèles (création des tables)...');
    // Force: true va supprimer et recréer les tables
    await db.sequelize.sync({ force: true });
    console.log('✅ Tables créées avec succès.');

    console.log('\n🔄 Insertion des utilisateurs...');
    const utilisateurs = await db.utilisateurs.bulkCreate(utilisateursData);
    console.log(`✅ ${utilisateurs.length} utilisateurs créés.`);

    // Assigner les utilisateurs aux pollutions
    pollutionsData[0].utilisateur_id = utilisateurs[0].id;  // Jean Dupont
    pollutionsData[1].utilisateur_id = utilisateurs[1].id;  // Sophie Martin
    pollutionsData[2].utilisateur_id = utilisateurs[0].id;  // Jean Dupont
    pollutionsData[3].utilisateur_id = utilisateurs[2].id;  // Luc Bernard
    pollutionsData[4].utilisateur_id = utilisateurs[1].id;  // Sophie Martin

    console.log('\n🔄 Insertion des pollutions...');
    const pollutions = await db.pollution.bulkCreate(pollutionsData);
    console.log(`✅ ${pollutions.length} pollutions créées.`);

    console.log('\n📊 Récapitulatif:');
    console.log(`   - Utilisateurs: ${await db.utilisateurs.count()}`);
    console.log(`   - Pollutions: ${await db.pollution.count()}`);

    console.log('\n✨ Base de données initialisée avec succès!');
    
    // Fermer la connexion
    await db.sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

// Exécuter le script
seedDatabase();
