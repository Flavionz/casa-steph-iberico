// ─── Règles métier livraison — L'Auberge Espagnole ───────────────────────────

export const DELIVERY_ZONE_1_FREE = ['57000', '57050', '57070', '57140', '57155', '57160', '57950']; // ≤ 7 km
export const DELIVERY_ZONE_2_FEE  = ['57130', '57170', '57245', '57420', '57530', '57645', '57685']; // 7-15 km

export const ALL_ELIGIBLE_POSTCODES = [...DELIVERY_ZONE_1_FREE, ...DELIVERY_ZONE_2_FEE];

export const ZONE_2_DELIVERY_FEE      = 5;    // €
export const FREE_DELIVERY_THRESHOLD  = 100;  // € — gratuit en zone 2 au-dessus de ce montant
export const MIN_CART_AMOUNT          = 30;   // € — panier minimum

export const getDeliveryFee = (postalCode: string, cartTotal: number): number => {
    if (DELIVERY_ZONE_1_FREE.includes(postalCode)) return 0;
    if (DELIVERY_ZONE_2_FEE.includes(postalCode)) {
        return cartTotal >= FREE_DELIVERY_THRESHOLD ? 0 : ZONE_2_DELIVERY_FEE;
    }
    return 0; // hors zone — bloqué en amont
};

export const getZoneLabel = (postalCode: string): string | null => {
    if (DELIVERY_ZONE_1_FREE.includes(postalCode)) return 'Zone 1 — Livraison gratuite';
    if (DELIVERY_ZONE_2_FEE.includes(postalCode))  return 'Zone 2 — 5 € (offerte dès 100 €)';
    return null;
};
