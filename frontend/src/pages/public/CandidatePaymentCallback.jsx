import { Link, useSearchParams } from 'react-router-dom';

const CandidatePaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const status = (searchParams.get('status') || 'pending').toLowerCase();

  const isSuccess = status === 'success' || status === 'completed';
  const isFailed = status === 'failed' || status === 'cancelled';

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: 720, margin: '0 auto' }}>
      <h1>💳 Paiement inscription candidat</h1>
      {isSuccess && <p>✅ Paiement confirmé. Votre compte candidat est en cours d'activation.</p>}
      {isFailed && <p>❌ Le paiement a échoué ou a été annulé. Veuillez réessayer.</p>}
      {!isSuccess && !isFailed && <p>⏳ Paiement en cours de confirmation. Revenez dans quelques instants.</p>}

      <p>Si besoin, vous pouvez relancer le paiement depuis votre espace candidat.</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
};

export default CandidatePaymentCallback;
