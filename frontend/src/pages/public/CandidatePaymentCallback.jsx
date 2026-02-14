import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const CandidatePaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const fallbackStatus = (searchParams.get('status') || 'pending').toLowerCase();
  const reference = searchParams.get('reference');

  const [status, setStatus] = useState(fallbackStatus);
  const [candidateStatus, setCandidateStatus] = useState('');
  const [isLoading, setIsLoading] = useState(Boolean(reference));

  const shouldPoll = useMemo(() => Boolean(reference && (status === 'pending' || status === 'processing')), [reference, status]);

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
        setCandidateStatus((result?.data?.candidate_status || '').toUpperCase());

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

    if (!shouldPoll) {
      return;
    }

    const interval = setInterval(loadStatus, 5000);
    return () => clearInterval(interval);
  }, [reference, shouldPoll]);

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
      {candidateStatus && <p>Statut candidat: <strong>{candidateStatus}</strong></p>}
      <p>Si besoin, vous pouvez relancer le paiement depuis votre espace candidat.</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
};

export default CandidatePaymentCallback;
