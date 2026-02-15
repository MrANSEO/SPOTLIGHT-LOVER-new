import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const CandidatePaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fallbackStatus = (searchParams.get('status') || 'pending').toLowerCase();
  const reference = searchParams.get('reference');

  const [status, setStatus] = useState(fallbackStatus);
  const [candidateStatus, setCandidateStatus] = useState('');
  const [isLoading, setIsLoading] = useState(Boolean(reference));
  const [attemptCount, setAttemptCount] = useState(0);
  const [candidateId, setCandidateId] = useState('');
  const [retryMessage, setRetryMessage] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  const isReferenceValid = useMemo(() => Boolean(reference && reference.startsWith('REG-')), [reference]);

  const shouldPoll = useMemo(
    () => Boolean(isReferenceValid && (status === 'pending' || status === 'processing') && attemptCount < 12),
    [isReferenceValid, status, attemptCount],
  );

  useEffect(() => {
    const loadStatus = async () => {
      if (!isReferenceValid) {
        return;
      }

      setAttemptCount((prev) => prev + 1);

      try {
        const response = await fetch(`${API_BASE_URL}/candidates/registration-payment/${reference}`);
        if (!response.ok) {
          return;
        }

        const result = await response.json();
        const paymentStatus = (result?.data?.status || '').toLowerCase();
        setCandidateStatus((result?.data?.candidate_status || '').toUpperCase());
        setCandidateId(result?.data?.candidate_id || '');

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
  }, [reference, isReferenceValid, shouldPoll]);

  const isSuccess = status === 'success' || status === 'completed';
  const isFailed = status === 'failed' || status === 'cancelled';
  const canRetry = Boolean(candidateId && (isFailed || attemptCount >= 12));


  const handleRetryPayment = async () => {
    if (!candidateId) {
      setRetryMessage('❌ Impossible de relancer: candidat introuvable pour cette référence.');
      return;
    }

    setIsRetrying(true);
    setRetryMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/registration-payment`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        setRetryMessage('❌ Relance échouée. Réessayez plus tard.');
        return;
      }

      const nextReference = result?.data?.reference;
      if (nextReference && nextReference !== reference) {
        navigate(`/candidate/payment-callback?reference=${encodeURIComponent(nextReference)}`, {
          replace: true,
        });
      }

      setRetryMessage('✅ Paiement relancé. Vérifiez votre téléphone pour confirmer la transaction.');
      setStatus('pending');
      setAttemptCount(0);
    } catch {
      setRetryMessage('❌ Erreur réseau pendant la relance du paiement.');
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: 720, margin: '0 auto' }}>
      <h1>💳 Paiement inscription candidat</h1>
      {!isReferenceValid && <p>❌ Référence de paiement invalide ou manquante.</p>}
      {isLoading && <p>⏳ Vérification du statut de paiement...</p>}
      {!isLoading && isSuccess && <p>✅ Paiement confirmé. Votre compte candidat est en cours d'activation.</p>}
      {!isLoading && isFailed && <p>❌ Le paiement a échoué ou a été annulé. Veuillez réessayer.</p>}
      {!isLoading && !isSuccess && !isFailed && <p>⏳ Paiement en cours de confirmation. Revenez dans quelques instants.</p>}
      {!isLoading && !isSuccess && !isFailed && attemptCount >= 12 && (
        <p>⚠️ La confirmation prend plus de temps que prévu. Utilisez votre référence pour vérifier plus tard.</p>
      )}

      {reference && <p>Référence: <strong>{reference}</strong></p>}
      {candidateStatus && <p>Statut candidat: <strong>{candidateStatus}</strong></p>}
      <p>Si besoin, vous pouvez relancer le paiement ci-dessous.</p>
      {canRetry && (
        <button onClick={handleRetryPayment} disabled={isRetrying}>
          {isRetrying ? 'Relance en cours...' : '🔁 Relancer le paiement'}
        </button>
      )}
      {retryMessage && <p>{retryMessage}</p>}
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
};

export default CandidatePaymentCallback;
