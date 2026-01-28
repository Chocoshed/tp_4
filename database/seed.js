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
    titre: 'Décharge sauvage près du chemin forestier',
    lieu: 'Forêt de la Robertsau',
    date_observation: new Date('2025-10-15'),
    type_pollution: 'Dépôt sauvage',
    description: 'Tas de déchets ménagers et plastiques abandonnés au bord du chemin.',
    latitude: 48.6275,
    longitude: 7.8032,
    photo_url: 'https://exemple.com/photos/depot1.jpg',
    utilisateur_id: null  // Sera défini après la création des utilisateurs
  },
  {
    titre: 'Pollution plastique dans la rivière',
    lieu: 'Rivière Ill, Strasbourg',
    date_observation: new Date('2025-09-28'),
    type_pollution: 'Plastique',
    description: 'Accumulation de bouteilles et emballages dans le cours d\'eau.',
    latitude: 48.5839,
    longitude: 7.7455,
    photo_url: 'https://exemple.com/photos/plastique2.jpg',
    utilisateur_id: null  // Sera défini après la création des utilisateurs
  },
  {
    titre: 'Fumées suspectes d\'une usine',
    lieu: 'Zone industrielle de Reichstett',
    date_observation: new Date('2025-10-10'),
    type_pollution: 'Air',
    description: 'Émission de fumées noires pendant plusieurs heures.',
    latitude: 48.6572,
    longitude: 7.7561,
    photo_url: 'https://exemple.com/photos/usine3.jpg',
    utilisateur_id: null  // Sera défini après la création des utilisateurs
  },
  {
    titre: 'Rejet chimique dans le canal',
    lieu: 'Canal du Rhône au Rhin, Neudorf',
    date_observation: new Date('2025-10-22'),
    type_pollution: 'Chimique',
    description: 'Substance huileuse et colorée observée à la surface de l\'eau.',
    latitude: 48.5608,
    longitude: 7.7654,
    photo_url: 'https://exemple.com/photos/produit4.jpg',
    utilisateur_id: null  // Sera défini après la création des utilisateurs
  },
  {
    titre: 'Déversement d\'eaux usées',
    lieu: 'Rue du Faubourg-National, Strasbourg',
    date_observation: new Date('2025-10-05'),
    type_pollution: 'Eau',
    description: 'Écoulement d\'eaux usées non traitées depuis une bouche d\'égout.',
    latitude: 48.5823,
    longitude: 7.7396,
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
