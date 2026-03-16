const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendOrderReadyEmail = async (order, user) => {
    const items = JSON.parse(order.items);
    const itemsList = items.map(item =>
        `- ${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)}€`
    ).join('\n');

    const mailOptions = {
        from: process.env.SMTP_FROM || '"L\'Auberge Espagnole" <contact@auberge-espagnol.fr>',
        to: user.email,
        subject: `Votre commande #${order.id} est prête! 🎉`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C9A66B;">Excellente nouvelle!</h2>
        
        <p>Bonjour ${user.firstName},</p>
        
        <p>Votre commande est prête et sera livrée :</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${order.deliveryDate}</p>
          <p style="margin: 5px 0;"><strong>🕐 Créneau horaire:</strong> ${order.deliveryTimeSlot}</p>
          <p style="margin: 5px 0;"><strong>📍 Adresse:</strong> ${order.deliveryAddress}, ${order.postalCode}</p>
        </div>
        
        <h3 style="color: #C9A66B;">Détails de votre commande #${order.id}</h3>
        <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 8px;">
${itemsList}
        </pre>
        
        <p style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          Total: ${order.total.toFixed(2)}€
        </p>
        
        <p style="margin-top: 30px;">À très bientôt,<br><strong>L'Auberge Espagnole</strong></p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666;">
          Pour toute question, contactez-nous à contact@auberge-espagnol.fr
        </p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${user.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        return { success: false, error };
    }
};

const sendOrderDeliveredEmail = async (order, user) => {
    const mailOptions = {
        from: process.env.SMTP_FROM || '"L\'Auberge Espagnole" <contact@auberge-espagnol.fr>',
        to: user.email,
        subject: `Commande #${order.id} livrée - Merci! 🎉`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C9A66B;">Merci pour votre commande!</h2>
        
        <p>Bonjour ${user.firstName},</p>
        
        <p>Votre commande #${order.id} a été livrée avec succès.</p>
        
        <p>Nous espérons que vous apprécierez nos produits!</p>
        
        <p style="margin-top: 30px;">À très bientôt,<br><strong>L'Auberge Espagnole</strong></p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666;">
          N'hésitez pas à nous laisser un avis ou à nous contacter pour toute question.
        </p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Delivery confirmation sent to ${user.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        return { success: false, error };
    }
};

const sendPasswordResetEmail = async (user, resetLink) => {
    const mailOptions = {
        from: process.env.SMTP_FROM || '"L\'Auberge Espagnole" <contact@auberge-espagnol.fr>',
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C9A66B;">Réinitialisation de votre mot de passe</h2>
        <p>Bonjour${user.firstName ? ' ' + user.firstName : ''},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien est valable <strong>1 heure</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}"
             style="background-color: #C9A66B; color: #1a1714; padding: 14px 32px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Réinitialiser mon mot de passe
          </a>
        </div>
        <p style="color: #888; font-size: 13px;">Si vous n'avez pas fait cette demande, ignorez cet email. Votre mot de passe ne sera pas modifié.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">L'Auberge Espagnole — lauberge.espagnole.metz@gmail.com</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Reset email sent to ${user.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Reset email failed:', error);
        return { success: false, error };
    }
};

module.exports = {
    sendOrderReadyEmail,
    sendOrderDeliveredEmail,
    sendPasswordResetEmail,
};