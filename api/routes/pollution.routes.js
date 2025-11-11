

module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js");
  
    var router = require("express").Router();
  
    // Récupérer toutes les pollutions
    router.get("/", pollution.get);
    
    // Récupérer une pollution par ID
    router.get("/:id", pollution.getById);
    
    // Créer une nouvelle pollution
    router.post("/", pollution.create);
    
    // Mettre à jour une pollution
    router.put("/:id", pollution.update);
  
    app.use('/api/pollution', router);
  };
