-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "role" VARCHAR(255) DEFAULT 'job_seeker',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "company_name" VARCHAR(255),
    "salary_range" VARCHAR(255),
    "location" VARCHAR(255),

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);
