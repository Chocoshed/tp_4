const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/password.helper");
const { ACCESS_TOKEN_SECRET } = require("../config");

const db = require("../models");
const Utilisateurs = db.utilisateurs;
const Op = db.Sequelize.Op;

/**
 * Inscription d'un nouvel utilisateur
 */
exports.register = async (req, res) => {
  try {
    // Validation des données
    if (!req.body.nom || !req.body.login || !req.body.pass) {
      return res.status(400).send({
        message: "Le nom, le login et le mot de passe sont requis!"
      });
    }

    // Valider la longueur du login et password
    if (req.body.login.length < 3 || req.body.pass.length < 4) {
      return res.status(400).send({
        message: "Le login doit avoir au moins 3 caractères et le mot de passe au moins 4 caractères."
      });
    }

    // Vérifier si le login existe déjà
    const existingUser = await Utilisateurs.findOne({ 
      where: { login: req.body.login } 
    });

    if (existingUser) {
      return res.status(409).send({
        message: "Ce login est déjà utilisé."
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(req.body.pass);

    // Créer l'utilisateur
    const utilisateur = {
      id: uuidv4(),
      nom: req.body.nom,
      prenom: req.body.prenom || null,
      login: req.body.login,
      pass: hashedPassword
    };

    const data = await Utilisateurs.create(utilisateur);

    // Générer le JWT
    const token = jwt.sign(
      { 
        id: data.id, 
        login: data.login, 
        nom: data.nom 
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    // Retourner l'utilisateur (sans le mot de passe) et le token
    res.status(201).send({
      user: {
        id: data.id,
        nom: data.nom,
        prenom: data.prenom,
        login: data.login
      },
      token: token
    });

  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur s'est produite lors de l'inscription."
    });
  }
};

/**
 * Connexion d'un utilisateur
 */
exports.login = async (req, res) => {
  try {
    // Validation des données
    if (!req.body.login || !req.body.password) {
      return res.status(400).send({
        message: "Le login et le mot de passe sont requis!"
      });
    }

    // Récupérer l'utilisateur par login
    const data = await Utilisateurs.findOne({ 
      where: { login: req.body.login } 
    });

    if (!data) {
      return res.status(401).send({
        message: "Login ou mot de passe incorrect."
      });
    }

    // Vérifier le mot de passe
    const passwordMatch = await comparePassword(req.body.password, data.pass);

    if (!passwordMatch) {
      return res.status(401).send({
        message: "Login ou mot de passe incorrect."
      });
    }

    // Générer le JWT
    const token = jwt.sign(
      { 
        id: data.id, 
        login: data.login, 
        nom: data.nom 
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    // Retourner l'utilisateur (sans le mot de passe) et le token
    res.send({
      user: {
        id: data.id,
        nom: data.nom,
        prenom: data.prenom,
        login: data.login
      },
      token: token
    });

  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur s'est produite lors de la connexion."
    });
  }
};

/**
 * Récupérer l'utilisateur connecté
 */
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user est ajouté par le middleware d'authentification
    const userId = req.user.id;

    const data = await Utilisateurs.findByPk(userId);

    if (!data) {
      return res.status(404).send({
        message: "Utilisateur non trouvé."
      });
    }

    // Retourner l'utilisateur sans le mot de passe
    res.send({
      id: data.id,
      nom: data.nom,
      prenom: data.prenom,
      login: data.login
    });

  } catch (err) {
    res.status(500).send({
      message: err.message || "Erreur lors de la récupération de l'utilisateur."
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

exports.create = async (req, res) => {
  try {
    if (!req.body.nom || !req.body.login || !req.body.pass) {
      return res.status(400).send({
        message: "Le nom, le login et le mot de passe sont requis!"
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(req.body.pass);

    const utilisateur = {
      id: req.body.id || uuidv4(),
      nom: req.body.nom,
      prenom: req.body.prenom,
      login: req.body.login,
      pass: hashedPassword
    };

    const data = await Utilisateurs.create(utilisateur);
    
    // Retourner sans le mot de passe
    res.send({
      id: data.id,
      nom: data.nom,
      prenom: data.prenom,
      login: data.login
    });

  } catch (err) {
    res.status(500).send({
      message: err.message || "Une erreur s'est produite lors de la création de l'utilisateur."
    });
  }
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
