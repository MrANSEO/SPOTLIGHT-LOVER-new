export enum CandidateStatus {
  PENDING = 'PENDING',       // En attente de validation
  APPROVED = 'APPROVED',     // Validé et publié
  REJECTED = 'REJECTED',     // Refusé
  SUSPENDED = 'SUSPENDED',   // Suspendu (anomalie détectée)
}
