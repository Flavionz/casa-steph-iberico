const PDFDocument = require('pdfkit');

const SELLER = {
    name: "Casa Steph Iberico",
    owner: 'MILHAU Stéphane',
    address: '33 Rue des Chenevières',
    city: '57140 La Maxe',
    siren: '519 942 924',
    email: 'casastephiberico@gmail.com',
    phone: '+33 6 89 66 91 15',
};

const GOLD = '#CCA43B';
const DARK = '#1E1B18';
const GRAY = '#6B7280';

/**
 * Génère un numéro de facture séquentiel.
 * Format : AE-YYYY-XXXXXX (ex: AE-2026-000001)
 */
const generateInvoiceNumber = (orderId) => {
    const year = new Date().getFullYear();
    return `AE-${year}-${orderId.toString().padStart(6, '0')}`;
};

/**
 * Génère un PDF de facture et le pipe dans la réponse HTTP.
 * @param {object} order  - Objet order (Prisma)
 * @param {object} user   - { email, firstName, lastName, address, city, postalCode }
 * @param {object} res    - Express response object
 */
const generateInvoicePDF = (order, user, res) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    const invoiceNumber = order.invoiceNumber || generateInvoiceNumber(order.id);
    const invoiceDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const items = (() => {
        try {
            let parsed = JSON.parse(order.items);
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    })();

    const clientName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

    // Headers HTTP
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="facture-${invoiceNumber}.pdf"`);
    doc.pipe(res);

    // ── En-tête ─────────────────────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 120).fill(DARK);

    doc.fillColor(GOLD)
       .font('Helvetica-Bold')
       .fontSize(22)
       .text("Casa Steph Iberico", 50, 35);

    doc.fillColor('#FFFFFF')
       .font('Helvetica')
       .fontSize(9)
       .text('Charcuterie & fromages ibériques premium', 50, 62)
       .text(`${SELLER.address}, ${SELLER.city}`, 50, 75)
       .text(`SIREN : ${SELLER.siren}`, 50, 88)
       .text(SELLER.email, 50, 101);

    doc.fillColor(GOLD)
       .font('Helvetica-Bold')
       .fontSize(28)
       .text('FACTURE', 380, 35, { align: 'right' });

    doc.fillColor('#FFFFFF')
       .font('Helvetica')
       .fontSize(9)
       .text(`N° ${invoiceNumber}`, 380, 70, { align: 'right' })
       .text(`Date : ${invoiceDate}`, 380, 83, { align: 'right' });

    // ── Bloc client ──────────────────────────────────────────────────────────────
    doc.fillColor(DARK).font('Helvetica-Bold').fontSize(10).text('Facturer à :', 50, 145);
    doc.fillColor('#374151').font('Helvetica').fontSize(9)
       .text(clientName, 50, 160)
       .text(user.email, 50, 173);

    if (user.address) {
        doc.text(user.address, 50, 186);
        doc.text(`${user.postalCode || ''} ${user.city || ''}`.trim(), 50, 199);
    } else {
        doc.text(`Livraison : ${order.deliveryAddress}`, 50, 186)
           .text(order.postalCode, 50, 199);
    }

    // ── Tableau articles ─────────────────────────────────────────────────────────
    const tableTop = 240;
    const colRef   = 50;
    const colProd  = 110;
    const colQty   = 340;
    const colPU    = 390;
    const colTotal = 470;

    // En-tête tableau
    doc.rect(50, tableTop, doc.page.width - 100, 22).fill(DARK);

    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9)
       .text('Réf.', colRef, tableTop + 7)
       .text('Produit', colProd, tableTop + 7)
       .text('Qté', colQty, tableTop + 7, { width: 40, align: 'center' })
       .text('Prix unitaire', colPU, tableTop + 7, { width: 70, align: 'right' })
       .text('Total', colTotal, tableTop + 7, { width: 60, align: 'right' });

    // Lignes articles
    let y = tableTop + 30;
    items.forEach((item, index) => {
        const rowBg = index % 2 === 0 ? '#F9FAFB' : '#FFFFFF';
        doc.rect(50, y - 5, doc.page.width - 100, 20).fill(rowBg);

        const ref = `AE-P${String(index + 1).padStart(3, '0')}`;
        const lineTotal = (item.price * item.quantity).toFixed(2);

        doc.fillColor('#111827').font('Helvetica').fontSize(9)
           .text(ref, colRef, y)
           .text(item.name, colProd, y, { width: 220 })
           .text(String(item.quantity), colQty, y, { width: 40, align: 'center' })
           .text(`${item.price.toFixed(2)} €`, colPU, y, { width: 70, align: 'right' })
           .text(`${lineTotal} €`, colTotal, y, { width: 60, align: 'right' });

        y += 22;
    });

    // ── Totaux ───────────────────────────────────────────────────────────────────
    y += 10;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    doc.moveTo(350, y).lineTo(doc.page.width - 50, y).strokeColor('#E5E7EB').lineWidth(1).stroke();
    y += 10;

    doc.fillColor(GRAY).font('Helvetica').fontSize(9)
       .text('Sous-total :', 350, y, { width: 120, align: 'right' });
    doc.fillColor('#111827').text(`${subtotal.toFixed(2)} €`, colTotal, y, { width: 60, align: 'right' });
    y += 16;

    if (order.deliveryFee > 0) {
        doc.fillColor(GRAY).font('Helvetica').fontSize(9)
           .text('Frais de livraison :', 350, y, { width: 120, align: 'right' });
        doc.fillColor('#111827').text(`${order.deliveryFee.toFixed(2)} €`, colTotal, y, { width: 60, align: 'right' });
        y += 16;
    } else {
        doc.fillColor(GRAY).font('Helvetica').fontSize(9)
           .text('Frais de livraison :', 350, y, { width: 120, align: 'right' });
        doc.fillColor('#16A34A').text('Offerts', colTotal, y, { width: 60, align: 'right' });
        y += 16;
    }

    // Total final
    doc.rect(350, y, doc.page.width - 400, 26).fill(DARK);
    doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(11)
       .text('TOTAL TTC :', 354, y + 7, { width: 116, align: 'right' });
    doc.fillColor('#FFFFFF').text(`${order.total.toFixed(2)} €`, colTotal, y + 7, { width: 60, align: 'right' });
    y += 40;

    // ── Mention TVA ──────────────────────────────────────────────────────────────
    doc.rect(50, y, doc.page.width - 100, 28).fill('#FEF9EC');
    doc.fillColor('#92400E').font('Helvetica').fontSize(8)
       .text(
           'TVA non applicable — article 293 B du CGI',
           54, y + 10,
           { width: doc.page.width - 108 }
       );
    y += 44;

    // ── Mode de paiement ─────────────────────────────────────────────────────────
    const paymentLabel = order.paymentMethod === 'cash'
        ? 'Paiement à la livraison (espèces)'
        : 'Paiement par lien sécurisé';

    doc.fillColor(GRAY).font('Helvetica').fontSize(9)
       .text(`Mode de paiement : ${paymentLabel}`, 50, y);

    // ── Pied de page ─────────────────────────────────────────────────────────────
    doc.rect(0, doc.page.height - 50, doc.page.width, 50).fill(DARK);
    doc.fillColor('#9CA3AF').font('Helvetica').fontSize(7.5)
       .text(
           `${SELLER.name}  •  ${SELLER.owner}  •  SIREN ${SELLER.siren}  •  ${SELLER.email}  •  ${SELLER.phone}`,
           50,
           doc.page.height - 30,
           { align: 'center', width: doc.page.width - 100 }
       );

    doc.end();
};

module.exports = { generateInvoicePDF, generateInvoiceNumber };
