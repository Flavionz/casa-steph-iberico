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

module.exports = {
    sendOrderReadyEmail,
    sendOrderDeliveredEmail,
};