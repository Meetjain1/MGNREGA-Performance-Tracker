# Database Setup Guide

## Production (Vercel)

### ✅ Current Setup
- **Database**: PostgreSQL (Vercel Postgres - prisma-postgres-blue-kite)
- **Provider**: Prisma with PostgreSQL
- **Status**: Configured in Vercel environment variables

### 🔧 What Happens on Deployment
When you push to `main`, Vercel automatically:
1. Runs `prisma generate` - Creates the Prisma Client
2. Runs `prisma migrate deploy` - Applies database migrations
3. Runs `npm run seed:safe` - Seeds the database with districts data
4. Builds the Next.js application

### 📊 Database Tables Created
- `districts` - 115 MGNREGA districts across 5 states
- `cached_mgnrega_data` - Cached API responses
- `api_request_logs` - API request tracking
- `user_activities` - User activity logs

## Local Development

### Option 1: Use Vercel PostgreSQL (Recommended)
**Pros**: Same database as production, no sync issues
**Cons**: Requires internet connection

1. Go to Vercel Dashboard → Storage → prisma-postgres-blue-kite
2. Copy the `DATABASE_POSTGRES_URL` 
3. Update `.env.local`:
   ```bash
   DATABASE_URL="postgres://[your-connection-string-from-vercel]"
   ```
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

### Option 2: Use Local PostgreSQL
**Pros**: Works offline
**Cons**: Need to install PostgreSQL locally

1. Install PostgreSQL locally
2. Create a database:
   ```bash
   createdb mgnrega_dev
   ```
3. Update `.env.local`:
   ```bash
   DATABASE_URL="postgresql://localhost:5432/mgnrega_dev"
   ```
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

### Option 3: Use SQLite (Quick Testing Only)
**Pros**: No setup needed
**Cons**: Different from production, not recommended

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `.env.local`:
   ```bash
   DATABASE_URL="file:./prisma/dev.db"
   ```
3. Run migrations:
   ```bash
   npx prisma migrate dev
   npm run seed
   ```

## Troubleshooting

### "Database error" in Vercel Logs
**Cause**: Migrations haven't run or failed
**Solution**: 
1. Check Vercel build logs for migration errors
2. Manually run migrations: `vercel env pull && npx prisma migrate deploy`

### "No districts found"
**Cause**: Database is empty (seeding failed)
**Solution**:
1. Connect to database: `npx prisma studio`
2. Check if tables exist and have data
3. Re-run seed: `npm run seed`

### "Invalid provider"
**Cause**: Mismatch between schema.prisma provider and DATABASE_URL
**Solution**: Ensure `schema.prisma` has `provider = "postgresql"` for production

## Current Status ✅

- ✅ Schema configured for PostgreSQL
- ✅ Migrations set up
- ✅ Seeding configured
- ✅ Vercel environment variables set
- ✅ Build command includes migrations
- 🔄 Next deployment will initialize database properly

## Commands Reference

```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations
npx prisma migrate deploy

# Seed database
npm run seed

# Open database browser
npx prisma studio

# Create new migration (after schema changes)
npx prisma migrate dev --name description
```
