

module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js");
    const { verifyToken } = require("../middleware/auth.middleware.js");
  
    var router = require("express").Router();
  
    // Routes publiques (lecture)
    // Recherche de pollutions
    router.get("/search", pollution.search);
    
    // Récupérer toutes les pollutions
    router.get("/", pollution.get);
    
    // Récupérer une pollution par ID
    router.get("/:id", pollution.getById);
    
    // Routes protégées (nécessitent authentification)
    // Créer une nouvelle pollution
    router.post("/", verifyToken, pollution.create);
    
    // Mettre à jour une pollution
    router.put("/:id", verifyToken, pollution.update);
    
    // Supprimer une pollution
    router.delete("/:id", verifyToken, pollution.delete);
  
    app.use('/api/pollution', router);
  };
