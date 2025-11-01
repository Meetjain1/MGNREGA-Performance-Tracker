-- CreateTable
CREATE TABLE "districts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameHindi" TEXT,
    "stateCode" TEXT NOT NULL,
    "stateName" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "population" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "cached_mgnrega_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "districtId" TEXT NOT NULL,
    "financialYear" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "jobCardsIssued" BIGINT,
    "activeJobCards" BIGINT,
    "activeWorkers" BIGINT,
    "householdsWorked" BIGINT,
    "personDaysGenerated" BIGINT,
    "womenPersonDays" BIGINT,
    "scPersonDays" BIGINT,
    "stPersonDays" BIGINT,
    "totalWorksStarted" BIGINT,
    "totalWorksCompleted" BIGINT,
    "totalWorksInProgress" BIGINT,
    "totalExpenditure" REAL,
    "wageExpenditure" REAL,
    "materialExpenditure" REAL,
    "averageDaysForPayment" REAL,
    "rawData" TEXT,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isStale" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "cached_mgnrega_data_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "api_request_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER,
    "responseTime" INTEGER,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "user_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT,
    "districtId" TEXT,
    "action" TEXT NOT NULL,
    "metadata" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "districts_code_key" ON "districts"("code");

-- CreateIndex
CREATE INDEX "districts_stateCode_idx" ON "districts"("stateCode");

-- CreateIndex
CREATE INDEX "districts_latitude_longitude_idx" ON "districts"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "cached_mgnrega_data_districtId_financialYear_idx" ON "cached_mgnrega_data"("districtId", "financialYear");

-- CreateIndex
CREATE INDEX "cached_mgnrega_data_fetchedAt_idx" ON "cached_mgnrega_data"("fetchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "cached_mgnrega_data_districtId_financialYear_month_key" ON "cached_mgnrega_data"("districtId", "financialYear", "month");

-- CreateIndex
CREATE INDEX "api_request_logs_createdAt_idx" ON "api_request_logs"("createdAt");

-- CreateIndex
CREATE INDEX "api_request_logs_endpoint_statusCode_idx" ON "api_request_logs"("endpoint", "statusCode");

-- CreateIndex
CREATE INDEX "user_activities_createdAt_idx" ON "user_activities"("createdAt");

-- CreateIndex
CREATE INDEX "user_activities_districtId_idx" ON "user_activities"("districtId");
