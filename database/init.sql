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
('Déchets plastiques sur la plage', 'Plage de Nice', '2025-12-15 14:30:00', 'Déchets', 'Nombreux déchets plastiques observés sur le sable', 43.695949, 7.271413, NULL, '550e8400-e29b-41d4-a716-446655440000'),
('Fuite d''huile moteur', 'Parking Leclerc, Lyon', '2026-01-05 10:15:00', 'Hydrocarbures', 'Grande flaque d''huile dans le parking', 45.764043, 4.835659, NULL, '550e8400-e29b-41d4-a716-446655440001'),
('Décharge sauvage en forêt', 'Forêt de Fontainebleau', '2026-01-08 09:00:00', 'Déchets', 'Plusieurs sacs poubelles abandonnés', 48.404842, 2.700348, NULL, '550e8400-e29b-41d4-a716-446655440000'),
('Pollution de rivière', 'Rivière Le Lez, Montpellier', '2026-01-10 16:45:00', 'Eau', 'Eau trouble avec mousse blanche suspecte', 43.610769, 3.876716, NULL, '550e8400-e29b-41d4-a716-446655440002'),
('Dépôt de gravats', 'Rue de la République, Marseille', '2026-01-12 11:20:00', 'Déchets', 'Tas de gravats déposé illégalement', 43.296482, 5.369780, NULL, '550e8400-e29b-41d4-a716-446655440001');

-- Affichage des statistiques
SELECT 'Utilisateurs créés:' AS info, COUNT(*) AS nombre FROM utilisateurs;
SELECT 'Pollutions créées:' AS info, COUNT(*) AS nombre FROM pollutions;
