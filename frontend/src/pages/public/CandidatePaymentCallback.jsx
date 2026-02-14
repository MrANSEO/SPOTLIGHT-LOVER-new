import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const CandidatePaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const fallbackStatus = (searchParams.get('status') || 'pending').toLowerCase();
  const reference = searchParams.get('reference');

  const [status, setStatus] = useState(fallbackStatus);
  const [isLoading, setIsLoading] = useState(Boolean(reference));

  useEffect(() => {
    const loadStatus = async () => {
      if (!reference) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/candidates/registration-payment/${reference}`);
        if (!response.ok) {
          return;
        }

        const result = await response.json();
        const paymentStatus = (result?.data?.status || '').toLowerCase();

        if (paymentStatus === 'completed' || paymentStatus === 'success') {
          setStatus('completed');
        } else if (paymentStatus === 'failed' || paymentStatus === 'cancelled') {
          setStatus('failed');
        } else {
          setStatus('pending');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadStatus();
  }, [reference]);

  const isSuccess = status === 'success' || status === 'completed';
  const isFailed = status === 'failed' || status === 'cancelled';

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: 720, margin: '0 auto' }}>
      <h1>💳 Paiement inscription candidat</h1>
      {isLoading && <p>⏳ Vérification du statut de paiement...</p>}
      {!isLoading && isSuccess && <p>✅ Paiement confirmé. Votre compte candidat est en cours d'activation.</p>}
      {!isLoading && isFailed && <p>❌ Le paiement a échoué ou a été annulé. Veuillez réessayer.</p>}
      {!isLoading && !isSuccess && !isFailed && <p>⏳ Paiement en cours de confirmation. Revenez dans quelques instants.</p>}

      {reference && <p>Référence: <strong>{reference}</strong></p>}
      <p>Si besoin, vous pouvez relancer le paiement depuis votre espace candidat.</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
};

export default CandidatePaymentCallback;
