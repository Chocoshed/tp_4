-- Script d'initialisation de la base de données PostgreSQL
-- Base de données : pollution

-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS pollutions CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;

-- Création de la table utilisateurs
CREATE TABLE utilisateurs (
    id VARCHAR(255) PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255),
    login VARCHAR(255) NOT NULL UNIQUE,
    pass VARCHAR(255)
);

-- Création de la table pollutions
CREATE TABLE pollutions (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    lieu VARCHAR(255),
    date_observation TIMESTAMP,
    type_pollution VARCHAR(255),
    description TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    photo_url VARCHAR(255),
    utilisateur_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- Insertion de données de test pour les utilisateurs
INSERT INTO utilisateurs (id, nom, prenom, login, pass) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Dupont', 'Jean', 'jean.dupont', 'password123'),
('550e8400-e29b-41d4-a716-446655440001', 'Martin', 'Sophie', 'sophie.martin', 'password456'),
('550e8400-e29b-41d4-a716-446655440002', 'Bernard', 'Luc', 'luc.bernard', 'password789');

-- Insertion de données de test pour les pollutions
INSERT INTO pollutions (titre, lieu, date_observation, type_pollution, description, latitude, longitude, photo_url, utilisateur_id) VALUES
('Décharge sauvage près du chemin forestier', 'Forêt de la Robertsau', '2025-10-15', 'Dépôt sauvage', 'Tas de déchets ménagers et plastiques abandonnés au bord du chemin.', 48.6275, 7.8032, 'https://exemple.com/photos/depot1.jpg', '550e8400-e29b-41d4-a716-446655440000'),
('Pollution plastique dans la rivière', 'Rivière Ill, Strasbourg', '2025-09-28', 'Plastique', 'Accumulation de bouteilles et emballages dans le cours d''eau.', 48.5839, 7.7455, 'https://exemple.com/photos/plastique2.jpg', '550e8400-e29b-41d4-a716-446655440001'),
('Fumées suspectes d''une usine', 'Zone industrielle de Reichstett', '2025-10-10', 'Air', 'Émission de fumées noires pendant plusieurs heures.', 48.6572, 7.7561, 'https://exemple.com/photos/usine3.jpg', '550e8400-e29b-41d4-a716-446655440000'),
('Rejet chimique dans le canal', 'Canal du Rhône au Rhin, Neudorf', '2025-10-22', 'Chimique', 'Substance huileuse et colorée observée à la surface de l''eau.', 48.5608, 7.7654, 'https://exemple.com/photos/produit4.jpg', '550e8400-e29b-41d4-a716-446655440002'),
('Déversement d''eaux usées', 'Rue du Faubourg-National, Strasbourg', '2025-10-05', 'Eau', 'Écoulement d''eaux usées non traitées depuis une bouche d''égout.', 48.5823, 7.7396, NULL, '550e8400-e29b-41d4-a716-446655440001');

-- Affichage des statistiques
SELECT 'Utilisateurs créés:' AS info, COUNT(*) AS nombre FROM utilisateurs;
SELECT 'Pollutions créées:' AS info, COUNT(*) AS nombre FROM pollutions;
