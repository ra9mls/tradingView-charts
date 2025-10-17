# Deployment Guide

## Deploying to Vercel

This application is optimized for deployment on Vercel. Follow these steps:

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Prepare your repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub** (if not already done)
   ```bash
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

4. **Done!** Your app will be live at `https://your-project.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Method 3: One-Click Deploy

Click the button below to deploy directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

## Environment Variables

This project does not require environment variables as the GraphQL endpoints are configured in the application.

## Custom Domain

To add a custom domain:

1. Go to your project in Vercel Dashboard
2. Click "Settings" > "Domains"
3. Add your domain
4. Update your DNS settings as instructed

## Troubleshooting

### Build fails
- Ensure all dependencies are in `package.json`
- Check that `npm run build` works locally
- Review build logs in Vercel dashboard

### Runtime errors
- Check the Vercel function logs
- Verify GraphQL endpoints are accessible
- Ensure token addresses are valid

## Performance Tips

- The app uses Next.js 15 with App Router for optimal performance
- Static generation is used where possible
- Lightweight Charts library is efficiently bundled

## Sharing with Testers

After deployment, share the Vercel URL with your testers:
```
https://your-project-name.vercel.app
```

You can also:
- Set up password protection in Vercel settings
- Create preview deployments for each branch
- Use Vercel's collaboration features to invite team members
