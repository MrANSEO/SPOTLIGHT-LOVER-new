-- Supprimer les admins existants
DELETE FROM admins;

-- Créer admin (password hashé = Admin123!)
INSERT INTO admins (id, email, password, name, role, two_factor_enabled, is_active, failed_login_attempts, created_at, updated_at)
VALUES (
  'admin-001',
  'admin@spotlightlover.cm',
  '$2b$10$vVHxXzD.xOd.1bPbKpZ1uO7V6FxYZJZR4x2KNQVgxJxrOD9xJPqNa',
  'Admin Principal',
  'SUPER_ADMIN',
  0,
  1,
  0,
  datetime('now'),
  datetime('now')
);
