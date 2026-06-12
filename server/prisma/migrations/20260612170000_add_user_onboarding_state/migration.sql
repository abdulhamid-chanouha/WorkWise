-- AlterTable
ALTER TABLE "users"
ADD COLUMN "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "onboardingDismissed" BOOLEAN NOT NULL DEFAULT false;

-- Existing accounts predate this feature and should not be interrupted automatically.
UPDATE "users" SET "onboardingCompleted" = true;
