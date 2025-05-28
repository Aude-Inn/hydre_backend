import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Mail/Reset
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASSWORD,  
  },
});


const sendResetPasswordEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`; 

  const mailOptions = {
    from: `"Hydre - Support" <${process.env.EMAIL_USER}>`,  
    to: email,  
    subject: "Réinitialisation de votre mot de passe", 
    html: `  <!-- HTML contenu du message -->
      <h1>Hello ${name},</h1>
      <p>On dirait que tu as perdu ton mot de passe… Pas de stress, ça arrive aux meilleurs. On est là pour te filer un coup de main !</p>
      <p>Clique sur le bouton ci-dessous pour en créer un tout neuf (tout beau, tout sécurisé) :</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a>
      <p>Tu peux aussi copier-coller ce lien dans ton navigateur si tu préfères la méthode old-school :</p>
      <p>${resetUrl}</p>
      <p><strong>Attention : ce lien expire dans 1 heure ! Alors ne traîne pas trop </strong></p>
      <p>Si tu n’as pas demandé de réinitialisation, pas de souci — tu peux ignorer ce message. Rien ne sera modifié. À très vite,
      Hydre !</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);  
    return true; 
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);  
    return false;  
  }
};

export { sendResetPasswordEmail };
