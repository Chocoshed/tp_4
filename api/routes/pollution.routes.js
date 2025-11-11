

module.exports = app => {
    const pollution = require("../controllers/pollution.controllers.js");
  
    var router = require("express").Router();
  
    // Récupérer toutes les pollutions
    router.get("/", pollution.get);
    
    // Créer une nouvelle pollution
    router.post("/", pollution.create);
  
    app.use('/api/pollution', router);
  };
