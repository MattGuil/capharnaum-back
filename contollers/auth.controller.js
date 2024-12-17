const UserModel = require("../models/user.model");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

module.exports.signUp = async (req, res) => {
  const { nom, prenom, email, password, interests } = req.body;

  try {
    if (!nom || !prenom || !email || !password || interests.length == 0) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    // Génère un token
    const generateToken = () => {
      return crypto.randomBytes(32).toString("hex");
    };

    const user = await UserModel.create({
      nom,
      prenom,
      email,
      password,
      interests,
      confirmationToken: generateToken(),
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bouananiouahid@gmail.com",
        pass: "njxiepkddcyrcqaf",
      },
    });

    const confirmationUrl = `https://capharnaum.alwaysdata.net/api/user/confirm/${user.confirmationToken}`;

    const mailOptions = {
      from: "capharnaum@gmail.com",
      to: email,
      subject: "Confirmation de votre compte",
      text: `Bonjour ${prenom},\n\nMerci de vous être inscrit !\n\n Ceci est un email de confirmation de votre compte veuillez cliquer sur le lien suivant: \n\n ${confirmationUrl} \n\nCordialement,\nL'équipe`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erreur lors de l'envoi de l'email:", error);
      } else {
        console.log("Email envoyé:", info.response);
      }
    });

    res.status(201).json({ userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

module.exports.confirmEmail = async (req, res) => {
  const token = req.params.token;

  const user = await UserModel.findOne({ confirmationToken: token });

  if (!user) {
    return res.status(400).send("Token invalide ou utilisateur non trouvé.");
  }

  user.isConfirmed = true;
  user.confirmationToken = undefined; // Optionnel : supprimer le token après confirmation
  await user.save();

  res.send("Votre email a été confirmé avec succès !");
};

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.login(email, password);

    if (!user.isConfirmed) res.status(402).send("Email non confirmé");
    else {
      const token = createToken(user._id);
      res.cookie('token', token, { 
        httpOnly: false,
        secure: true,
        sameSite: 'None', 
        maxAge
      });
      res.status(200).json({ userId: user._id });
    }
  } catch (err) {
    res.status(201).json(err.message);
  }
};

module.exports.signOut = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: false,
      secure: true,
      sameSite: 'None',
      maxAge: 0
    });

    res.status(200).send("Déconnexion réussie");
  } catch (err) {
    console.error("Erreur lors de la déconnexion : ", err);
    res.status(500).send("Erreur serveur lors de la déconnexion.");
  }
};