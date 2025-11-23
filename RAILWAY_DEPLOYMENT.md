# Railway Deployment Checklist

## Pre-Deployment

- [ ] All platform-specific code removed
- [ ] PostgreSQL storage implementation complete
- [ ] Environment variables documented in `.env.example`
- [ ] `.gitignore` updated with `.env` files
- [ ] README.md updated with Railway instructions

## Railway Setup

### 1. Create Railway Project
- [ ] Sign up/login to [Railway](https://railway.app)
- [ ] Create new project
- [ ] Connect GitHub repository

### 2. Add PostgreSQL Database
- [ ] Click "New" in Railway project
- [ ] Select "Database" → "PostgreSQL"
- [ ] Wait for database to provision
- [ ] Verify `DATABASE_URL` is automatically added to variables

### 3. Configure Environment Variables
Set these in Railway Dashboard → Variables:

- [ ] `AUTH_PASSWORD` - Set your admin password
- [ ] `SESSION_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] `NODE_ENV` - Set to `production`
- [ ] `DATABASE_URL` - Should be auto-set by Railway

### 4. Deploy Application
- [ ] Push code to GitHub
- [ ] Railway will auto-deploy
- [ ] Check deployment logs for errors

### 5. Initialize Database
After first successful deployment:

Option A - Using Railway CLI:
```bash
railway run npm run db:push
```

Option B - Using Railway Dashboard:
- Go to your service
- Click "Settings" → "Deploy"
- Add one-time command: `npm run db:push`

### 6. Verify Deployment
- [ ] Get deployment URL from Railway dashboard
- [ ] Visit the URL
- [ ] Test login with username: `admin` and your `AUTH_PASSWORD`
- [ ] Create a test application entry
- [ ] Verify data persists after page refresh

## Post-Deployment

### Optional: Custom Domain
- [ ] Go to Railway project → Settings → Domains
- [ ] Add custom domain
- [ ] Update DNS records as instructed

### Optional: Enable Automatic Deployments
- [ ] Settings → Service → GitHub Integration
- [ ] Enable automatic deployments on push

## Troubleshooting

### Build Fails
1. Check Railway build logs
2. Verify all dependencies in package.json
3. Ensure Node.js version compatibility

### Database Connection Error
1. Verify PostgreSQL service is running
2. Check `DATABASE_URL` is set
3. Run `npm run db:push` to initialize schema

### Authentication Not Working
1. Verify `AUTH_PASSWORD` is set
2. Check `SESSION_SECRET` is set
3. Clear browser cookies and retry

### App Crashes on Start
1. Check start logs in Railway dashboard
2. Verify environment variables are set
3. Ensure PORT is not hardcoded (Railway sets it automatically)

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| DATABASE_URL | Yes (auto) | PostgreSQL connection string | Set by Railway |
| AUTH_PASSWORD | Yes | Admin login password | `SecurePass123!` |
| SESSION_SECRET | Yes | Session encryption key | `64-char-hex-string` |
| NODE_ENV | Recommended | Environment mode | `production` |
| PORT | No (auto) | Server port | Set by Railway |

## Commands Reference

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# View logs
railway logs

# Run database migration
railway run npm run db:push

# Open Railway dashboard
railway open

# Deploy manually
railway up
```

## Monitoring

After deployment, monitor:
- Response times in Railway dashboard
- Error logs
- Database usage
- Memory/CPU usage

## Updates

To deploy updates:
1. Commit changes to git
2. Push to GitHub
3. Railway auto-deploys (if enabled)
4. Monitor deployment logs

---

**Need help?** Check the [README.md](./README.md) or Railway documentation at [docs.railway.app](https://docs.railway.app)
