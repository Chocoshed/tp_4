const bcrypt = require('bcryptjs');

/**
 * Helper pour gérer le hashage et la vérification des mots de passe
 */

/**
 * Hasher un mot de passe avec bcrypt
 * @param {string} password - Le mot de passe en clair
 * @returns {Promise<string>} Le mot de passe hashé
 */
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Comparer un mot de passe avec son hash
 * @param {string} password - Le mot de passe en clair
 * @param {string} hash - Le hash à comparer
 * @returns {Promise<boolean>} True si le mot de passe correspond
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword
};
