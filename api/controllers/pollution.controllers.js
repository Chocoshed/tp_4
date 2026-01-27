const { v4: uuidv4 } = require ("uuid");


const db = require("../models");
const Pollution = db.pollution;
const Op = db.Sequelize.Op;

exports.get = (req, res) => {

     Pollution.findAll({
      include: [{
        model: db.utilisateurs,
        as: 'utilisateur',
        attributes: ['id', 'nom', 'prenom', 'login']
      }]
    })
    .then(data => {res.send(data);})
    .catch(err => {
      res.status(400).send({
        message: err.message
      });
    });

};

exports.create = (req, res) => {
  // Valider la requête
  if (!req.body.titre) {
    res.status(400).send({
      message: "Le titre ne peut pas être vide!"
    });
    return;
  }

  // Récupérer l'ID de l'utilisateur depuis le token JWT
  const utilisateurId = req.user.id;

  // Créer une pollution
  const pollution = {
    titre: req.body.titre,
    lieu: req.body.lieu,
    date_observation: req.body.date_observation,
    type_pollution: req.body.type_pollution,
    description: req.body.description,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    photo_url: req.body.photo_url,
    utilisateur_id: utilisateurId
  };

  // Sauvegarder la pollution dans la base de données
  Pollution.create(pollution)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la création de la pollution."
      });
    });
};

exports.getById = (req, res) => {
  const id = req.params.id;

  Pollution.findByPk(id, {
    include: [{
      model: db.utilisateurs,
      as: 'utilisateur',
      attributes: ['id', 'nom', 'prenom', 'login']
    }]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Pollution avec l'id=${id} non trouvée.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la récupération de la pollution avec l'id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const utilisateurId = req.user.id;

  // Valider la requête
  if (!req.body.titre) {
    res.status(400).send({
      message: "Le titre ne peut pas être vide!"
    });
    return;
  }

  // Vérifier que la pollution appartient à l'utilisateur
  Pollution.findByPk(id)
    .then(pollution => {
      if (!pollution) {
        return res.status(404).send({
          message: `Pollution avec l'id=${id} non trouvée.`
        });
      }

      if (pollution.utilisateur_id !== utilisateurId) {
        return res.status(403).send({
          message: "Vous n'êtes pas autorisé à modifier cette pollution."
        });
      }

      // Mise à jour autorisée
      Pollution.update(req.body, { where: { id: id } })
        .then(num => {
          if (num == 1) {
            // Récupérer la pollution mise à jour pour la retourner
            Pollution.findByPk(id, {
              include: [{
                model: db.utilisateurs,
                as: 'utilisateur',
                attributes: ['id', 'nom', 'prenom', 'login']
              }]
            })
              .then(data => {
                res.send(data);
              })
              .catch(err => {
                res.status(500).send({
                  message: "Erreur lors de la récupération de la pollution mise à jour"
                });
              });
          } else {
            res.status(404).send({
              message: `Impossible de mettre à jour la pollution avec l'id=${id}.`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Erreur lors de la mise à jour de la pollution avec l'id=" + id
          });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  const utilisateurId = req.user.id;

  // Vérifier que la pollution appartient à l'utilisateur
  Pollution.findByPk(id)
    .then(pollution => {
      if (!pollution) {
        return res.status(404).send({
          message: `Pollution avec l'id=${id} non trouvée.`
        });
      }

      if (pollution.utilisateur_id !== utilisateurId) {
        return res.status(403).send({
          message: "Vous n'êtes pas autorisé à supprimer cette pollution."
        });
      }

      // Suppression autorisée
      Pollution.destroy({ where: { id: id } })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Pollution supprimée avec succès!"
            });
          } else {
            res.status(404).send({
              message: `Impossible de supprimer la pollution avec l'id=${id}.`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Erreur lors de la suppression de la pollution avec l'id=" + id
          });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};