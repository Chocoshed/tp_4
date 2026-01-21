

module.exports = app => {
    const utilisateur = require("../controllers/utilisateur.controllers.js");
    const { verifyToken } = require("../middleware/auth.middleware.js");
  
    var router = require("express").Router();
  
    // Routes publiques
    // Inscription d'un nouvel utilisateur
    router.post("/register", utilisateur.register);
    
    // Connexion utilisateur
    router.post("/login", utilisateur.login);
    
    // Déconnexion utilisateur
    router.post("/logout", utilisateur.logout);
    
    // Routes protégées (nécessitent authentification)
    // Récupérer l'utilisateur connecté
    router.get("/me", verifyToken, utilisateur.getCurrentUser);
    
    // Récupérer tous les utilisateurs
    router.get("/", utilisateur.getAll);
    
    // Récupérer un utilisateur par ID
    router.get("/:id", utilisateur.getById);
    
    // Créer un nouvel utilisateur (admin)
    router.post("/", utilisateur.create);
    
    // Mettre à jour un utilisateur
    router.put("/:id", utilisateur.update);
    
    // Supprimer un utilisateur
    router.delete("/:id", utilisateur.delete);
  
    app.use('/api/utilisateur', router);
  };
