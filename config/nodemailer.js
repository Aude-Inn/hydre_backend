import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,  // Ton email
    pass: process.env.EMAIL_PASSWORD,  // Le mot de passe 
  },
});


const sendResetPasswordEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`; 

  const mailOptions = {
    from: `"Hydre - Support" <${process.env.EMAIL_USER}>`,  
    to: email,  
    subject: "Réinitialisation de votre mot de passe", 
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
    await transporter.sendMail(mailOptions);  
    return true; 
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);  
    return false;  
  }
};

export { sendResetPasswordEmail };
