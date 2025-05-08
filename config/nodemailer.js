import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configuration du transporteur pour Nodemailer (Service Gmail ici)
const transporter = nodemailer.createTransport({
  service: "gmail", // Utilisation du service Gmail pour l'envoi
  auth: {
    user: process.env.EMAIL_USER,  // Ton email
    pass: process.env.EMAIL_PASSWORD,  // Le mot de passe ou l'App Password Gmail
  },
});

// Fonction pour envoyer l'email de réinitialisation
const sendResetPasswordEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`; // Lien de réinitialisation généré avec le token

  const mailOptions = {
    from: `"Hydre - Support" <${process.env.EMAIL_USER}>`,  // Nom de l'expéditeur avec l'adresse email
    to: email,  // L'email du destinataire
    subject: "Réinitialisation de votre mot de passe",  // Sujet de l'email
    html: `  <!-- HTML contenu du message -->
      <h1>Bonjour ${name},</h1>
      <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
      <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a>
      <p>Ou copiez ce lien dans votre navigateur :</p>
      <p>${resetUrl}</p>
      <p><strong>Ce lien expire dans 1 heure.</strong></p>
      <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, vous pouvez ignorer cet email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);  // Envoi de l'email
    return true;  // Retourne true si l'email a été envoyé avec succès
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);  // Log l'erreur
    return false;  // Retourne false si l'envoi a échoué
  }
};

export { sendResetPasswordEmail };
