# Backend Repository Structure

This is the **Spark LMS Backend** repository.

## Location

- **Local Path**: `e:/Spark LMS/backend`
- **GitHub Repo**: `https://github.com/UmurAwais/Spark-LMS-Backend.git`
- **Vercel Deployment**: `https://spark-lms-backend.vercel.app`

## Environment Variables Required on Vercel

1. `MONGODB_URI` - MongoDB Atlas connection string
2. `FIREBASE_SERVICE_ACCOUNT` - Firebase Admin SDK service account JSON (as string)
3. `ADMIN_PASSWORD` - Admin panel password

## Deployment

- **Auto-deploy**: Enabled for `main` branch
- **Platform**: Vercel (serverless functions)

## Latest Version

- Version: 2.0-firebase-admin-enabled
- Firebase Admin: ✅ Enabled
- MongoDB: ✅ Connected

## Testing

- Health check: `https://spark-lms-backend.vercel.app/api/health`
- Version check: `https://spark-lms-backend.vercel.app/api/version`
