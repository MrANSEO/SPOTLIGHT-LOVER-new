-- CreateTable
CREATE TABLE IF NOT EXISTS "system_settings" (
  "key" TEXT NOT NULL PRIMARY KEY,
  "value" TEXT NOT NULL,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "candidate_registration_payments" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "reference" TEXT NOT NULL,
  "candidate_id" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "status" TEXT NOT NULL,
  "provider_reference" TEXT,
  "payload" TEXT,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "candidate_registration_payments_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "candidate_registration_payments_reference_key" ON "candidate_registration_payments"("reference");
CREATE INDEX IF NOT EXISTS "candidate_registration_payments_candidate_id_idx" ON "candidate_registration_payments"("candidate_id");
CREATE INDEX IF NOT EXISTS "candidate_registration_payments_status_idx" ON "candidate_registration_payments"("status");
