const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../config");

/**
 * Middleware pour vérifier le token JWT
 */
const verifyToken = (req, res, next) => {
  // Récupérer le token depuis le header Authorization
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).send({
      message: "Accès refusé. Aucun token fourni."
    });
  }

  // Le format attendu est "Bearer TOKEN"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({
      message: "Accès refusé. Token invalide."
    });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    
    // Ajouter les données décodées dans req.user
    req.user = decoded;
    
    // Continuer vers la route suivante
    next();
    
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send({
        message: "Token expiré. Veuillez vous reconnecter."
      });
    }
    
    return res.status(403).send({
      message: "Token invalide."
    });
  }
};

module.exports = {
  verifyToken
};
