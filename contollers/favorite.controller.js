// Importation du modèle Favorite, qui représente les favoris dans la base de données
const Favorite = require('../models/favorite.model');

// Fonction pour ajouter un favori
exports.addFavorite = async (req, res) => {
  try {
    // On récupère les informations de l'utilisateur et de l'activité depuis le corps de la requête
    const { user, activity } = req.body;

    // On crée une nouvelle instance du modèle Favorite avec les informations de l'utilisateur et de l'activité
    const newFavorite = new Favorite({ user, activity });
    
    // On sauvegarde le nouveau favori dans la base de données
    await newFavorite.save();
    
    // On retourne une réponse avec un statut 201 (création réussie) et les détails du nouveau favori
    res.status(201).json({ message: 'Favorite added successfully', newFavorite });
  } catch (error) {
    // En cas d'erreur, on retourne une réponse avec un statut 400 et le message d'erreur
    res.status(400).json({ error: error.message });
  }
};

// Fonction pour supprimer un favori
exports.removeFavorite = async (req, res) => {
  try {
    // On tente de trouver et de supprimer le favori en utilisant l'ID fourni dans les paramètres de la requête
    const favorite = await Favorite.findByIdAndDelete(req.params.id);
    
    // Si le favori n'existe pas, on retourne une réponse 404 (non trouvé)
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    
    // Si la suppression réussit, on retourne une réponse 200 (OK)
    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    // En cas d'erreur, on retourne une réponse avec un statut 400 et le message d'erreur
    res.status(400).json({ error: error.message });
  }
};

// Fonction pour récupérer tous les favoris d'un utilisateur
exports.getFavoritesByUser = async (req, res) => {
  try {
    // On recherche tous les favoris associés à l'ID de l'utilisateur, et on les remplit avec les données de l'activité liée
    const favorites = await Favorite.find({ user: req.params.userId }).populate('activity');
    
    // Si tout se passe bien, on retourne une réponse 200 avec la liste des favoris
    res.status(200).json(favorites);
  } catch (error) {
    // En cas d'erreur, on retourne une réponse avec un statut 400 et le message d'erreur
    res.status(400).json({ error: error.message });
  }
};
