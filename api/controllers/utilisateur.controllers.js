const { v4: uuidv4 } = require ("uuid");


const db = require("../models");
const Utilisateurs = db.utilisateurs;
const Op = db.Sequelize.Op;

// Find a single Utilisateur with an login
exports.login = (req, res) => {
  const utilisateur = {
    login: req.body.login,
    password: req.body.password
  };

  // Test
  let pattern = /^[A-Za-z0-9]{1,20}$/;
  if (pattern.test(utilisateur.login) && pattern.test(utilisateur.password)) {
     Utilisateurs.findOne({ where: { login: utilisateur.login } })
    .then(data => {
      if (data) {
        const user = {
          id: data.id,
          name: data.nom,
          email: data.email
        };
      
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Utilisateur with login=${utilisateur.login}.`
        });
      }
    })
    .catch(err => {
      res.status(400).send({
        message: "Error retrieving Utilisateur with login=" + utilisateur.login
      });
    });
  } else {
    res.status(400).send({
      message: "Login ou password incorrect" 
    });
  }
};

exports.getAll = (req, res) => {
  Utilisateurs.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(400).send({
        message: err.message
      });
    });
};

exports.getById = (req, res) => {
  const id = req.params.id;

  Utilisateurs.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Utilisateur avec l'id=${id} non trouvé.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la récupération de l'utilisateur avec l'id=" + id
      });
    });
};

exports.create = (req, res) => {
  if (!req.body.nom || !req.body.login) {
    res.status(400).send({
      message: "Le nom et le login sont requis!"
    });
    return;
  }

  const utilisateur = {
    id: req.body.id || uuidv4(), // Générer un UUID si l'ID n'est pas fourni
    nom: req.body.nom,
    prenom: req.body.prenom,
    login: req.body.login,
    pass: req.body.pass
  };

  Utilisateurs.create(utilisateur)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la création de l'utilisateur."
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  if (!req.body.nom || !req.body.login) {
    res.status(400).send({
      message: "Le nom et le login sont requis!"
    });
    return;
  }

  Utilisateurs.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        Utilisateurs.findByPk(id)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message: "Erreur lors de la récupération de l'utilisateur mis à jour"
            });
          });
      } else {
        res.status(404).send({
          message: `Impossible de mettre à jour l'utilisateur avec l'id=${id}. Utilisateur non trouvé!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la mise à jour de l'utilisateur avec l'id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Utilisateurs.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Utilisateur supprimé avec succès!"
        });
      } else {
        res.status(404).send({
          message: `Impossible de supprimer l'utilisateur avec l'id=${id}. Utilisateur non trouvé!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la suppression de l'utilisateur avec l'id=" + id
      });
    });
};
