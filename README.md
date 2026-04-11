# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Prerequisites

### ENV

Create a .env file with the following information:

| Key          | Value                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| DATABASE_URL | URL to connect to the database. (eg) `postgresql://<user>:<password>@<host>:<port>/<database>?schema=<schema>` |
| JWT_KEY      | A secret string to encrypt the JWT (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| BCRYPT_SALT  | Password hashing rounds (use 10 for dev, 12 for production). Do not change after initial use.                  |
| FRONTEND_URL | Your frontend URL (e.g., `http://localhost:3000` for dev, your domain for production)                          |
| NODE_ENV     | Environment: `development` or `production`                                                                      |
| SMTP_HOST    | SendGrid SMTP server: `smtp.sendgrid.net`                                                                      |
| SMTP_PORT    | SMTP port: `587`                                                                                                |
| SMTP_USER    | Always use: `apikey`                                                                                            |
| SMTP_PASS    | Your SendGrid API key (starts with `SG.`)                                                                       |
| EMAIL_FROM   | Verified sender email (must be verified in SendGrid)                                                            |
| TEST_EMAIL   | (Optional) In development, send all emails to this address for testing                                          |

```m
// Example
// .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mentoring?schema=public"
JWT_KEY="21599a2a88858fcfa81c5162d12a5d8d0dfefc2ab06daeed82392424b7066128"
BCRYPT_SALT=12
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="SG.your-sendgrid-api-key-here"
EMAIL_FROM="noreply@nitt.edu"
TEST_EMAIL="your-test-email@gmail.com"
```

### ORM
You need to generate Prisma types and make sure that it is up to date with the DB

```bash
npm run prisma-generate

npm run db_push
```

### INITIAL USE
If this is the initial use, you need to create an admin account so that you can create other accounts:

```bash
npm run create-user <username> <password> 3
```

You can create departments here or directly in the DB
```bash
npm run create-dept <dept_id eg. CSE> <full name eg. Computer Science>
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev 

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

You can deploy the site using

```bash
node .output/server/index.mjs
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Features

### Security
- **JWT Authentication**: Secure token-based authentication with httpOnly cookies
- **Password Security**: Bcrypt hashing with configurable salt rounds
- **Rate Limiting**: Protection against brute force attacks (5 login attempts per 15 minutes)
- **Input Validation**: Zod schema validation on all API endpoints
- **Audit Logging**: All critical actions logged to database with IP and user agent
- **Token Revocation**: Logout invalidates JWT tokens immediately
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, CSP, etc.

### Password Management
1. **User Self-Service**: `/dashboard/password` - Change your own password
2. **Forgot Password**: `/forgot-password` - Email-based password reset with 6-digit codes (10-minute expiry)
3. **Admin Reset**: `/admin/pass/edit` - Admins can reset any user's password

### Role-Based Access Control
- **Level 0**: Student
- **Level 1**: Faculty
- **Level 2**: HOD (Head of Department)
- **Level 3**: Admin (full access)

### Email Integration
- **SendGrid SMTP**: For password reset emails
- **Development Mode**: Optional TEST_EMAIL to redirect all emails during testing
- **Production Ready**: Domain authentication support for deliverability

## Available Routes

### Public Routes
- `/login` - Login page
- `/forgot-password` - Password reset (step 1: request code, step 2: verify & reset)

### User Routes (Requires Login)
- `/dashboard` - Main dashboard
- `/dashboard/password` - Change your own password
- `/dashboard/mentees` - View assigned mentees (Faculty/HOD)
- `/dashboard/mentees/[regno]` - View mentee details
- `/dashboard/mentees/[regno]/meetings` - View meetings with mentee

### Admin Routes (Requires Level 3)
- `/admin` - Admin dashboard
- `/admin/users` - Manage all users
- `/admin/faculty/new` - Add new faculty member
- `/admin/students/new` - Add new student
- `/admin/pass/edit` - Reset any user's password (NEW)

### HOD Routes (Requires Level 2)
- `/hod/faculty` - View department faculty
- `/hod/students` - View department students

## Testing

### Test Login Flow:
1. Create test user: `npm run create-user testuser Password123 0`
2. Login at http://localhost:3000/login
3. Should redirect to dashboard

### Test Password Reset:
1. Go to http://localhost:3000/forgot-password
2. Enter username, receive 6-digit code in email
3. Enter code and new password
4. Login with new password

### Test Admin Password Reset:
1. Login as admin (level 3)
2. Go to http://localhost:3000/admin/pass/edit
3. Enter target username and new password
4. Target user can now login with new password

## Production Checklist

- [ ] Set `NODE_ENV=production` in .env
- [ ] Use strong JWT_KEY (256-bit minimum)
- [ ] Set `BCRYPT_SALT=12` or higher
- [ ] Configure SendGrid domain authentication (SPF/DKIM)
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Set up database backups
- [ ] Monitor Neon DB usage (free tier: 512MB storage, ~192 compute hours/month)
- [ ] Review audit logs regularly
- [ ] Remove TEST_EMAIL from production .env

## Troubleshooting

### Login is slow
- First login: ~5 seconds (database warmup + bcrypt)
- Subsequent logins: <1 second
- Reduce BCRYPT_SALT to 10 for development (faster, less secure)

### Email not sending
- Check SendGrid API key is correct
- Verify EMAIL_FROM address in SendGrid dashboard
- Check spam folder
- View SendGrid Activity tab for delivery status
- In development, set TEST_EMAIL to redirect to your inbox

### Token expired errors
- JWT tokens expire after 2 hours
- Revoked tokens (after logout) cannot be reused
- Clear browser cookies and login again
