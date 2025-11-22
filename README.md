# Project Tracker

A centralized dashboard application for tracking and managing applications across multiple development platforms including Replit, Lovable, Railway, and custom platforms.

## Features

- 🔒 **Secure Authentication** - Single-user password protection
- 📊 **Application Management** - Track projects across multiple platforms
- 🏷️ **Categorization** - Organize apps by platform, status, and category
- 🔍 **Search & Filter** - Quickly find applications
- 🌓 **Dark Mode** - Built-in theme toggle
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Wouter (routing)
- TanStack Query (data fetching)
- shadcn/ui + Tailwind CSS

**Backend:**
- Node.js + Express
- TypeScript
- Drizzle ORM
- PostgreSQL
- Passport.js (authentication)

## Local Development

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use Railway's PostgreSQL)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ProjectTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `AUTH_PASSWORD` - Admin password for login
   - `SESSION_SECRET` - Random string for session encryption

   Generate a session secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Push database schema**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`

### Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema to PostgreSQL

## Railway Deployment

### Quick Deploy

1. **Install Railway CLI** (optional but recommended)
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Create a new Railway project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Add PostgreSQL Database**
   - In your Railway project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically create and connect the database

4. **Set Environment Variables**
   
   In Railway dashboard, go to your service → Variables:
   
   ```
   AUTH_PASSWORD=your_secure_password
   SESSION_SECRET=your_generated_secret
   NODE_ENV=production
   ```
   
   Note: `DATABASE_URL` is automatically set by Railway when you add PostgreSQL

5. **Deploy**
   
   Railway will automatically:
   - Install dependencies
   - Run `npm run build`
   - Start the app with `npm start`

6. **Push Database Schema**
   
   After first deployment, push the schema:
   ```bash
   railway run npm run db:push
   ```
   
   Or from Railway dashboard → Service → Settings → Deploy trigger → Run command

### Manual Deployment Steps

If using Railway CLI:

```bash
# Link to your project
railway link

# Add PostgreSQL
railway add

# Set environment variables
railway variables set AUTH_PASSWORD=your_password
railway variables set SESSION_SECRET=your_secret

# Push database schema
railway run npm run db:push

# Deploy
railway up
```

### Post-Deployment

1. Get your deployment URL from Railway dashboard
2. Visit the URL and log in with:
   - Username: `admin`
   - Password: (the `AUTH_PASSWORD` you set)

## Database Schema

The app uses a single `apps` table:

| Column          | Type      | Description                           |
|-----------------|-----------|---------------------------------------|
| id              | UUID      | Primary key (auto-generated)          |
| name            | text      | Application name                      |
| platform        | text      | Platform (Replit, Lovable, etc.)      |
| status          | text      | Status (Active, In Development, etc.) |
| category        | text      | Category (Personal, Work, etc.)       |
| live_url        | text      | URL to live deployment (optional)     |
| repository_url  | text      | URL to source repository (optional)   |
| notes           | text      | Additional notes (optional)           |
| updated_at      | timestamp | Last update timestamp                 |

## Security Notes

- Single-user application designed for personal use
- Password is hashed with bcrypt
- Sessions are HTTP-only and use secure cookies in production
- CSRF protection via sameSite cookies
- All application routes require authentication

## Troubleshooting

### Database Connection Issues

If you see "DATABASE_URL not found" warning:
- Ensure PostgreSQL is added to your Railway project
- Check that `DATABASE_URL` variable is set
- Restart the deployment

### Build Failures

If build fails on Railway:
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check Railway build logs for specific errors

### Authentication Issues

If you can't log in:
- Verify `AUTH_PASSWORD` is set correctly
- Check `SESSION_SECRET` is set
- Clear browser cookies and try again

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
