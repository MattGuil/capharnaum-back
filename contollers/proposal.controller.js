// Importation du modèle Proposal, qui représente une proposition dans la base de données
const Proposal = require('../models/proposal.model');

// Fonction pour créer une nouvelle proposition
exports.createProposal = async (req, res) => {
  try {
    // On récupère les informations de la proposition depuis le corps de la requête
    const { title, description, author } = req.body;
    
    // On crée une nouvelle instance du modèle Proposal avec les informations récupérées
    const newProposal = new Proposal({ title, description, author });
    
    // On sauvegarde la nouvelle proposition dans la base de données
    await newProposal.save();
    
    // On retourne une réponse avec un statut 201 (création réussie) et les détails de la nouvelle proposition
    res.status(201).json({ message: 'Proposal created successfully', newProposal });
  } catch (error) {
    // En cas d'erreur, on retourne une réponse avec un statut 400 et le message d'erreur
    res.status(400).json({ error: error.message });
  }
};

// Fonction pour récupérer toutes les propositions
exports.getAllProposals = async (req, res) => {
  try {
    // On recherche toutes les propositions dans la base de données
    const proposals = await Proposal.find();
    
    // On retourne une réponse avec un statut 200 (OK) et la liste des propositions
    res.status(200).json(proposals);
  } catch (error) {
    // En cas d'erreur, on retourne une réponse avec un statut 400 et le message d'erreur
    res.status(400).json({ error: error.message });
  }
};

// Fonction pour récupérer une proposition par son ID
exports.getProposalById = async (req, res) => {
  try {
    // On cherche la proposition en utilisant l'ID passé dans les paramètres de la requête
    const proposal = await Proposal.findById(req.params.id);
    
    // Si la proposition n'est pas trouvée, on retourne une réponse 404 (non trouvée)
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    
    // Si la proposition est trouvée, on retourne une réponse 200 avec les détails de la proposition
    res.status(200).json(proposal);
  } catch (error) {
    // En cas d'erreur, on retourne une réponse avec un statut 400 et le message d'erreur
    res.status(400).json({ error: error.message });
  }
};

// Fonction pour mettre à jour une proposition
exports.updateProposal = async (req, res) => {
  try {
    // On cherche la proposition par son ID et on met à jour ses informations avec les données envoyées dans la requête
    const proposal = await Proposal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Si la proposition n'est pas trouvée, on retourne une réponse 404 (non trouvée)
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    
    // Si la mise à jour réussit, on retourne la proposition mise à jour avec un statut 200
    res.status(200).json(proposal);
  } catch (error) {
    // En cas d'erreur, on retourne une réponse avec un statut 400 et le message d'erreur
    res.status(400).json({ error: error.message });
  }
};

// Fonction pour supprimer une proposition
exports.deleteProposal = async (req, res) => {
  try {
    // On cherche la proposition à supprimer en utilisant son ID
    const proposal = await Proposal.findByIdAndDelete(req.params.id);
    
    // Si la proposition n'est pas trouvée, on retourne une réponse 404 (non trouvée)
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    
    // Si la suppression réussit, on retourne une réponse 200 avec un message de succès
    res.status(200).json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    // En cas d'erreur, on retourne une réponse avec un statut 400 et le message d'erreur
    res.status(400).json({ error: error.message });
  }
};
