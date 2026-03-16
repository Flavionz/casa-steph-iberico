import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock, AlertCircle, CreditCard } from 'lucide-react';

interface StripePaymentFormProps {
    clientSecret: string;
    total: number;
    onSuccess: (paymentIntentId: string) => void;
    onError: (message: string) => void;
}

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#ffffff',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased' as const,
            fontSize: '16px',
            '::placeholder': { color: '#6b7280' },
        },
        invalid: {
            color: '#ef4444',
            iconColor: '#ef4444',
        },
    },
};

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
    clientSecret,
    total,
    onSuccess,
    onError,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardError, setCardError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setCardError(null);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement },
        });

        if (error) {
            const msg = error.message ?? 'Erreur de paiement';
            setCardError(msg);
            onError(msg);
            setIsProcessing(false);
            return;
        }

        if (paymentIntent?.status === 'succeeded') {
            onSuccess(paymentIntent.id);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Card input */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                    Numéro de carte
                </label>
                <div className="bg-[#1E1B18] border border-gray-600 rounded-lg px-4 py-4 focus-within:border-gold transition-colors">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
            </div>

            {/* Card error */}
            {cardError && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{cardError}</span>
                </div>
            )}

            {/* Security note */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
                <Lock size={12} className="shrink-0" />
                <span>Paiement sécurisé par Stripe — vos données ne transitent pas par nos serveurs.</span>
            </div>

            {/* Test mode hint (retirer en production) */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-300 space-y-0.5">
                <p className="font-semibold">Carte de test Stripe :</p>
                <p>N° : <span className="font-mono">4242 4242 4242 4242</span></p>
                <p>Expiration : <span className="font-mono">12/34</span> — CVC : <span className="font-mono">123</span></p>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full py-4 bg-gold text-dark font-bold uppercase tracking-wider rounded hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <CreditCard size={18} />
                {isProcessing ? 'Paiement en cours...' : `Payer ${total.toFixed(2)} €`}
            </button>
        </form>
    );
};
