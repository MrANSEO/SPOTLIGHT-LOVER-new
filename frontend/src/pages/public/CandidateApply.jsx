import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  age: 18,
  country: '',
  city: '',
  bio: '',
  videoUrl: '',
  videoDuration: 60,
};

const CandidateApply = () => {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          videoDuration: Number(form.videoDuration),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setError(data?.message || 'Échec inscription candidat');
        return;
      }

      setResult(data?.data || null);
    } catch {
      setError('Erreur réseau pendant inscription candidat.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '1rem' }}>
      <h1>🎬 Devenir candidat</h1>
      <p>Inscription concours (paiement 500 FCFA requis pour activation).</p>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <input placeholder="Nom" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => onChange('email', e.target.value)} required />
        <input placeholder="Téléphone" value={form.phone} onChange={(e) => onChange('phone', e.target.value)} required />
        <input type="number" min="18" max="99" placeholder="Âge" value={form.age} onChange={(e) => onChange('age', e.target.value)} required />
        <input placeholder="Pays" value={form.country} onChange={(e) => onChange('country', e.target.value)} required />
        <input placeholder="Ville" value={form.city} onChange={(e) => onChange('city', e.target.value)} required />
        <textarea placeholder="Bio" value={form.bio} onChange={(e) => onChange('bio', e.target.value)} required />
        <input placeholder="URL vidéo" value={form.videoUrl} onChange={(e) => onChange('videoUrl', e.target.value)} required />
        <input type="number" min="30" max="120" placeholder="Durée vidéo (sec)" value={form.videoDuration} onChange={(e) => onChange('videoDuration', e.target.value)} required />
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Inscription...' : '✅ S’inscrire et initier paiement'}</button>
      </form>

      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '1rem' }}>
          <p>✅ Candidature créée: <strong>{result.id}</strong></p>
          <p>Référence paiement: <strong>{result?.registrationPayment?.reference}</strong></p>
          <p>
            Suivre le paiement: 
            <Link to={`/candidate/payment-callback?reference=${result?.registrationPayment?.reference || ''}`}> ouvrir la page callback</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default CandidateApply;
