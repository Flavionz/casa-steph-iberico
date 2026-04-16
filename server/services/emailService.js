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
        from: process.env.SMTP_FROM || '"Casa Steph Iberico" <casastephiberico@gmail.com>',
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
        
        <p style="margin-top: 30px;">À très bientôt,<br><strong>Casa Steph Iberico</strong></p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666;">
          Pour toute question, contactez-nous à casastephiberico@gmail.com
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
        from: process.env.SMTP_FROM || '"Casa Steph Iberico" <casastephiberico@gmail.com>',
        to: user.email,
        subject: `Commande #${order.id} livrée - Merci! 🎉`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C9A66B;">Merci pour votre commande!</h2>
        
        <p>Bonjour ${user.firstName},</p>
        
        <p>Votre commande #${order.id} a été livrée avec succès.</p>
        
        <p>Nous espérons que vous apprécierez nos produits!</p>
        
        <p style="margin-top: 30px;">À très bientôt,<br><strong>Casa Steph Iberico</strong></p>
        
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
        from: process.env.SMTP_FROM || '"Casa Steph Iberico" <casastephiberico@gmail.com>',
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
        <p style="font-size: 12px; color: #666;">Casa Steph Iberico — casastephiberico@gmail.com</p>
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

const sendOrderConfirmationEmail = async (order, user) => {
    const items = JSON.parse(order.items);
    const itemsHtml = items.map(item => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toFixed(2)} €</td>
        </tr>
    `).join('');

    const orderNumber = `AE-${order.id.toString().padStart(6, '0')}`;
    const paymentLabel = order.paymentMethod === 'cash'
        ? 'Espèces à la livraison'
        : 'Lien de paiement (envoyé par Stéphane)';

    const mailOptions = {
        from: process.env.SMTP_FROM || '"Casa Steph Iberico" <casastephiberico@gmail.com>',
        to: user.email,
        subject: `Confirmation de commande ${orderNumber}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a1714; padding: 30px; text-align: center;">
          <h1 style="color: #C9A66B; margin: 0; font-size: 24px;">Casa Steph Iberico</h1>
          <p style="color: #888; margin: 5px 0 0 0; font-size: 13px;">Charcuterie & fromages ibériques · Metz</p>
        </div>

        <div style="padding: 40px 30px;">
          <h2 style="color: #1a1714;">Merci pour votre commande${user.firstName ? ', ' + user.firstName : ''} !</h2>
          <p>Votre commande <strong>${orderNumber}</strong> a bien été reçue. Nous la préparons dès que possible.</p>

          <div style="background-color: #f9f6f2; border-left: 4px solid #C9A66B; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 6px 0;"><strong>📍 Adresse de livraison :</strong> ${order.deliveryAddress}, ${order.postalCode}</p>
            <p style="margin: 0 0 6px 0;"><strong>💳 Paiement :</strong> ${paymentLabel}</p>
            <p style="margin: 0;"><strong>📋 Statut :</strong> En attente de préparation</p>
          </div>

          <h3 style="color: #1a1714; border-bottom: 2px solid #C9A66B; padding-bottom: 8px;">Détail de la commande</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="color: #888; font-size: 13px;">
                <th style="text-align: left; padding-bottom: 8px;">Produit</th>
                <th style="text-align: center; padding-bottom: 8px;">Qté</th>
                <th style="text-align: right; padding-bottom: 8px;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <table style="width: 100%; margin-top: 15px;">
            ${order.deliveryFee > 0 ? `
            <tr>
              <td style="padding: 4px 0; color: #666;">Livraison</td>
              <td style="text-align: right; color: #666;">${order.deliveryFee.toFixed(2)} €</td>
            </tr>` : `
            <tr>
              <td style="padding: 4px 0; color: #666;">Livraison</td>
              <td style="text-align: right; color: #2e7d32;">Gratuite</td>
            </tr>`}
            <tr>
              <td style="padding: 8px 0; font-size: 18px; font-weight: bold;">Total</td>
              <td style="text-align: right; font-size: 18px; font-weight: bold; color: #C9A66B;">${order.total.toFixed(2)} €</td>
            </tr>
          </table>

          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Des questions ? Contactez-nous par WhatsApp au <strong>+33 6 89 66 91 15</strong> ou par email à <a href="mailto:casastephiberico@gmail.com" style="color: #C9A66B;">casastephiberico@gmail.com</a>.
          </p>
        </div>

        <div style="background-color: #f5f5f5; padding: 20px 30px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #999;">
            Casa Steph Iberico — Metz, France<br>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="color: #C9A66B; text-decoration: none;">casasteph.fr</a>
          </p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Order confirmation sent to ${user.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Order confirmation email failed:', error);
        return { success: false, error };
    }
};

const sendWelcomeEmail = async (user) => {
    const mailOptions = {
        from: process.env.SMTP_FROM || '"Casa Steph Iberico" <casastephiberico@gmail.com>',
        to: user.email,
        subject: 'Bienvenue chez Casa Steph Iberico !',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a1714; padding: 30px; text-align: center;">
          <h1 style="color: #C9A66B; margin: 0; font-size: 24px;">Casa Steph Iberico</h1>
          <p style="color: #888; margin: 5px 0 0 0; font-size: 13px;">Charcuterie & fromages ibériques · Metz</p>
        </div>

        <div style="padding: 40px 30px;">
          <h2 style="color: #1a1714;">Bienvenue${user.firstName ? ' ' + user.firstName : ''} !</h2>

          <p>Votre compte a été créé avec succès. Vous pouvez dès maintenant parcourir notre boutique et passer commande.</p>

          <div style="background-color: #f9f6f2; border-left: 4px solid #C9A66B; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Votre email :</strong> ${user.email}</p>
            <p style="margin: 0; color: #666; font-size: 13px;">Conservez ces informations pour vous connecter.</p>
          </div>

          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/boutique"
               style="background-color: #C9A66B; color: #1a1714; padding: 14px 36px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Découvrir la boutique
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            Des questions ? Contactez-nous par WhatsApp au <strong>+33 6 89 66 91 15</strong> ou par email à <a href="mailto:casastephiberico@gmail.com" style="color: #C9A66B;">casastephiberico@gmail.com</a>.
          </p>
        </div>

        <div style="background-color: #f5f5f5; padding: 20px 30px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #999;">
            Casa Steph Iberico — Metz, France<br>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="color: #C9A66B; text-decoration: none;">casasteph.fr</a>
          </p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${user.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Welcome email failed:', error);
        return { success: false, error };
    }
};

const sendPaymentLinkEmail = async (order, user, sumupLink) => {
    const orderNumber = `AE-${order.id.toString().padStart(6, '0')}`;

    const orderDate = new Date(order.createdAt);
    const orderDateFr = orderDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const orderTimeFr = orderDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    let items = [];
    try {
        items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        if (typeof items === 'string') items = JSON.parse(items);
    } catch (_) { items = []; }

    const itemsHtml = items.length > 0 ? items.map(item => `
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid #eee; color: #333;">${item.name}</td>
          <td style="padding: 9px 0; border-bottom: 1px solid #eee; text-align: center; color: #666;">×${item.quantity}</td>
          <td style="padding: 9px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600; color: #1a1714;">${(item.price * item.quantity).toFixed(2)} €</td>
        </tr>
    `).join('') : `<tr><td colspan="3" style="padding: 10px 0; color: #999; font-style: italic;">Détail non disponible</td></tr>`;

    const mailOptions = {
        from: process.env.SMTP_FROM || '"Casa Steph Iberico" <casastephiberico@gmail.com>',
        to: user.email,
        subject: `Votre lien de paiement sécurisé (${orderNumber})`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">

        <!-- Header -->
        <div style="background-color: #1a1714; padding: 32px 30px; text-align: center;">
          <h1 style="color: #C9A66B; margin: 0; font-size: 26px; letter-spacing: 1px;">Casa Steph Iberico</h1>
          <p style="color: #888; margin: 6px 0 0 0; font-size: 13px;">Charcuterie & fromages ibériques · Metz</p>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px;">

          <h2 style="color: #1a1714; margin-top: 0;">
            Bonjour ${user.firstName ? user.firstName : ''}, votre lien de paiement est disponible !
          </h2>

          <p style="color: #444; font-size: 15px; line-height: 1.6;">
            Nous vous remercions pour votre commande passée le <strong>${orderDateFr} à ${orderTimeFr}</strong>.
            Voici votre lien de paiement sécurisé pour finaliser votre achat.
          </p>

          <!-- Order info -->
          <div style="background-color: #f9f6f2; border-left: 4px solid #C9A66B; padding: 18px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>📋 Référence :</strong> ${orderNumber}</p>
            <p style="margin: 0; font-size: 14px;"><strong>💰 Montant à régler :</strong> <span style="color: #C9A66B; font-size: 16px; font-weight: bold;">${order.total.toFixed(2)} €</span></p>
          </div>

          <!-- Items recap -->
          <h3 style="color: #1a1714; border-bottom: 2px solid #C9A66B; padding-bottom: 8px; font-size: 15px;">Récapitulatif de votre commande</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                <th style="text-align: left; padding-bottom: 8px;">Produit</th>
                <th style="text-align: center; padding-bottom: 8px;">Qté</th>
                <th style="text-align: right; padding-bottom: 8px;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <table style="width: 100%; margin-top: 10px; font-size: 14px;">
            ${order.deliveryFee > 0
                ? `<tr><td style="padding: 4px 0; color: #666;">Livraison</td><td style="text-align: right; color: #666;">${Number(order.deliveryFee).toFixed(2)} €</td></tr>`
                : `<tr><td style="padding: 4px 0; color: #666;">Livraison</td><td style="text-align: right; color: #2e7d32; font-weight: 600;">Gratuite</td></tr>`
            }
            <tr>
              <td style="padding: 10px 0 0 0; font-size: 17px; font-weight: bold; color: #1a1714;">Total</td>
              <td style="text-align: right; padding-top: 10px; font-size: 17px; font-weight: bold; color: #C9A66B;">${order.total.toFixed(2)} €</td>
            </tr>
          </table>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0 30px 0;">
            <a href="${sumupLink}"
               style="background-color: #C9A66B; color: #1a1714; padding: 16px 44px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
              Régler ma commande (${order.total.toFixed(2)} €)
            </a>
          </div>

          <p style="color: #888; font-size: 12px; text-align: center; margin-bottom: 30px;">
            Lien sécurisé via SumUp. Si le bouton ne s'ouvre pas, copiez ce lien dans votre navigateur :<br>
            <a href="${sumupLink}" style="color: #C9A66B; word-break: break-all; font-size: 12px;">${sumupLink}</a>
          </p>

          <!-- Next steps -->
          <div style="background-color: #f0f7f0; border-left: 4px solid #4caf50; padding: 18px 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #2e7d32; font-size: 14px;">Prochaines étapes</p>
            <p style="margin: 0; color: #444; font-size: 14px; line-height: 1.7;">
              Dès réception de votre paiement, nous procéderons à la <strong>préparation de votre commande</strong>.<br>
              Vous serez tenu informé par email à chaque étape : préparation, prêt à livrer, et livraison.
            </p>
          </div>

          <p style="color: #666; font-size: 14px;">
            Des questions ? Contactez-nous par WhatsApp au <strong>+33 6 89 66 91 15</strong> ou par email à
            <a href="mailto:casastephiberico@gmail.com" style="color: #C9A66B;">casastephiberico@gmail.com</a>.
          </p>

          <p style="margin-top: 30px; color: #444; font-size: 14px;">
            À très bientôt,<br>
            <strong>L'équipe Casa Steph Iberico</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f5f5f5; padding: 20px 30px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #999;">
            Casa Steph Iberico, Metz, France<br>
            <a href="mailto:casastephiberico@gmail.com" style="color: #C9A66B; text-decoration: none;">casastephiberico@gmail.com</a>
          </p>
        </div>

      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Payment link email sent to ${user.email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Payment link email failed:', error);
        return { success: false, error };
    }
};

module.exports = {
    sendOrderReadyEmail,
    sendOrderDeliveredEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
    sendPaymentLinkEmail,
};