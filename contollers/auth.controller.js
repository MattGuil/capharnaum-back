const UserModel = require("../models/user.model");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

module.exports.signUp = async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  try {
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    // Génère un token
    const generateToken = () => {
      return crypto.randomBytes(32).toString("hex"); // Génère un token de 32 octets en hexadécimal
    };

    const user = await UserModel.create({
      nom,
      prenom,
      email,
      password,
      confirmationToken: generateToken(),
    });

    // Configurer le transporteur d'email
    const transporter = nodemailer.createTransport({
      service: "gmail", // ou un autre service
      auth: {
        user: "bouananiouahid@gmail.com", //  adresse email
        pass: "njxiepkddcyrcqaf", // un mot de passe d'application
      },
    });

    // Creation de l'Url de confirmation
    const confirmationUrl = `https://capharnaum.alwaysdata.net/api/user/confirm/${user.confirmationToken}`;

    // Options de l'email
    const mailOptions = {
      from: "ton-email@gmail.com",
      to: email,
      subject: "Confirmation de votre compte",
      text: `Bonjour ${prenom},\n\nMerci de vous être inscrit !\n\n Ceci est un email de confirmation de votre compte veuillez cliquer sur le lien suivant: \n\n ${confirmationUrl} \n\nCordialement,\nL'équipe`,
    };

    // Envoyer l'email
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
// Create Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.login(email, password);
    if (!user.isConfirmed) res.status(402).send("email non confirmé");

    else {
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge });
      res.status(200).json({ token: token, user: JSON.stringify(user) });
    }
  } catch (err) {
    res.status(201).json(err.message);
  }
};

module.exports.logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};