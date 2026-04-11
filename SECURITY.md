# Security Improvements Applied

This document outlines the security vulnerabilities that have been fixed in the NITT Mentoring application.

## ✅ Fixed Vulnerabilities (18/18)

### 1. **JWT Secret Security** ✅
- **Before**: Weak, predictable secret ("computatrum scientia")
- **After**: 256-bit cryptographically secure random key
- **Impact**: Prevents token forgery attacks
- **File**: `.env`

### 2. **Password Security** ✅
- **Before**: BCRYPT_SALT=10 (weak)
- **After**: BCRYPT_SALT=12 (stronger)
- **Impact**: Slower brute-force attacks on leaked password hashes
- **File**: `.env`

### 3. **Input Validation** ✅
- **Before**: No validation, vulnerable to injection attacks
- **After**: Zod validation schemas for all user inputs
- **Impact**: Prevents SQL injection, XSS, and malformed data
- **Files**:
  - `server/utils/validation.ts` - Validation schemas
  - `server/api/users/me.post.ts` - Login validation
  - `server/api/users/password.patch.ts` - Password change validation
  - `server/api/mentees/new.post.ts` - Student creation validation
  - `server/api/users/new.post.ts` - User creation validation
  - `server/api/users/edit.patch.ts` - User editing validation
  - `server/api/faculty/new.post.ts` - Faculty creation validation

### 4. **Rate Limiting** ✅
- **Before**: No rate limiting, vulnerable to brute force
- **After**: Rate limiting on all API endpoints
- **Limits**:
  - Login: 5 attempts per 15 minutes
  - Password Reset: 3 attempts per hour
  - General API: 100 requests per minute
- **File**: `server/middleware/rateLimit.ts`

### 5. **Mass Assignment Prevention** ✅
- **Before**: User could inject extra fields (e.g., set level=3 to become admin)
- **After**: Explicitly whitelist allowed fields with Zod schemas
- **Impact**: Prevents privilege escalation
- **Files**: All POST/PATCH endpoints now use Zod validation

### 6. **Error Message Security** ✅
- **Before**: Exposed internal errors ("User not found" vs "Invalid password")
- **After**: Generic error messages, detailed logs server-side only
- **Impact**: Attackers can't enumerate users or gather system information
- **Files**: All API endpoints

### 7. **Security Headers** ✅
- **Before**: No security headers
- **After**: Added security headers in `nuxt.config.ts`:
  - `X-Frame-Options: SAMEORIGIN` - Prevents clickjacking
  - `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
  - `X-XSS-Protection: 1; mode=block` - XSS protection
  - `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()` - Restricts feature access

### 8. **Environment Variables** ✅
- **Before**: Hardcoded secrets in code
- **After**: All secrets in environment variables loaded via `nuxt.config.ts`
- **Files**:
  - `.env` - Contains secrets (never commit!)
  - `.env.example` - Template for developers
  - `.gitignore` - Ensures .env is never committed
  - `nuxt.config.ts` - Runtime config with private/public separation

### 9. **Authorization Improvements** ✅
- **Before**: Inconsistent permission checks
- **After**: 
  - Users can only change their own password
  - Proper level checks (403 instead of 401 for forbidden)
  - JWT expiry validation on all protected endpoints
  - Token revocation on logout
- **Files**: All protected API endpoints

### 10. **Audit Logging** ✅
- **Added**: `server/utils/auditLog.ts`
- **Database**: `audit_logs` table in Prisma schema
- **Logs**: User actions (login, logout, password changes), IP addresses, timestamps
- **Files**:
  - `server/utils/auditLog.ts` - Logging utility
  - `server/utils/prisma/schema.prisma` - Database schema
  - `server/api/users/me.post.ts` - Login audit
  - `server/api/users/logout.post.ts` - Logout audit
  - `server/api/users/password.patch.ts` - Password change audit

### 11. **HTTP Cookie Security** ✅
- **Before**: Cookies accessible via JavaScript (XSS vulnerability)
- **After**: 
  - `httpOnly: true` - Prevents JavaScript access
  - `secure: true` - Only over HTTPS in production
  - `sameSite: 'strict'` - CSRF protection
  - `maxAge: 7200` - 2 hours (matches JWT expiration)
- **Impact**: Prevents XSS attacks from stealing tokens
- **Files**:
  - `server/api/users/me.post.ts` - Sets secure cookie on login
  - `composables/useAuthToken.ts` - Centralized cookie configuration

### 12. **Password Reset Security** ✅
- **Before**: JWT token in URL (logged in browser history, server logs)
- **After**: 6-digit codes sent via email, stored in memory for 10 minutes
- **Impact**: Prevents token leakage via URL
- **Files**:
  - `server/utils/passwordResetCodes.ts` - Code generation and verification
  - `server/api/users/password-reset.post.ts` - Send reset code
  - `server/api/users/password-reset.patch.ts` - Verify code and reset password
  - `server/utils/validation.ts` - Password reset validation schemas

### 13. **CORS Configuration** ✅
- **Before**: No CORS policy
- **After**: Configured CORS in `nuxt.config.ts`
  - Allows credentials (cookies)
  - Restricts methods to GET, POST, PUT, PATCH, DELETE, OPTIONS
  - Applied to all `/api/**` routes
- **File**: `nuxt.config.ts`

### 14. **CSRF Protection** ✅
- **Implementation**: `sameSite: 'strict'` cookie attribute
- **Impact**: Browser automatically blocks cross-site requests with cookies
- **Additional**: For sensitive state-changing operations, consider adding CSRF tokens
- **Files**:
  - `server/api/users/me.post.ts` - Cookie configuration
  - `nuxt.config.ts` - CORS policy

### 15. **Token Revocation** ✅
- **Before**: Tokens valid until expiration even after logout
- **After**: Revoked tokens tracked in memory, checked on every request
- **Impact**: Immediate logout takes effect, prevents token reuse
- **Files**:
  - `server/utils/tokenRevocation.ts` - Revocation system
  - `server/api/users/logout.post.ts` - Revokes token on logout
  - `server/utils/jwt.ts` - Checks revocation on verification

### 16. **Strong Password Policy** ✅
- **Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- **Files**:
  - `server/utils/validation.ts` - Password validation schemas
  - All user/student/faculty creation endpoints

### 17. **Account Lockout** ✅
- **Implementation**: Rate limiting on login and password reset
- **Details**:
  - Login: 5 attempts per 15 minutes → 15 minute lockout
  - Password reset: 3 attempts per hour → 1 hour lockout
  - Reset code verification: 5 attempts per code → code invalidated
- **File**: `server/middleware/rateLimit.ts`

### 18. **Token Expiration Enforcement** ✅
- **Before**: Inconsistent expiration checks
- **After**: All protected endpoints check JWT expiration
- **Default**: 2 hours
- **Files**: All protected API endpoints check `(Date.now() / 1000) > jwtPayload.exp`

## 📋 Production Recommendations

### High Priority
1. **HTTPS Enforcement** - Enable in production (configure reverse proxy/load balancer)
2. **Email Storage** - Store actual email addresses instead of computed `username@nitt.edu`
3. **Redis for Distributed Systems** - Replace in-memory storage (reset codes, revoked tokens) with Redis
4. **Secrets Management** - Use AWS Secrets Manager, Azure Key Vault, or HashiCorp Vault
5. **Database Backups** - Enable automated backups for PostgreSQL

### Medium Priority
1. **Two-Factor Authentication (2FA)** - Optional 2FA for admin accounts
2. **Password History** - Prevent reusing last 5 passwords
3. **Security Monitoring** - Integrate with Sentry or CloudWatch for alerts
4. **Penetration Testing** - Regular security audits
5. **Dependency Scanning** - Automated vulnerability scanning (Snyk, Dependabot)

### Nice to Have
1. **IP Whitelisting** - Restrict admin access to specific IPs
2. **Biometric Authentication** - WebAuthn/FIDO2 support
3. **Session Management UI** - Let users view and revoke active sessions
4. **Anomaly Detection** - Alert on suspicious login patterns

## 🔧 Setup Instructions

### 1. Database Migration
Run the Prisma migration to create the audit_logs table:
```bash
cd server/utils
npx prisma migrate dev --name add_audit_logs
```

### 2. Generate New JWT Key (if needed)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in the values:
```env
DATABASE_URL="postgresql://..."
JWT_KEY="<generated-256-bit-key>"
BCRYPT_SALT=12
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"

# Email Configuration (required for password reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="NITT Mentoring <noreply@nitt.edu>"
```

### 4. Install Dependencies
```bash
npm install zod rate-limiter-flexible
```

### 5. Test the Application
```bash
npm run dev
```

Test the following:
- [ ] Login with wrong password (should limit after 5 attempts)
- [ ] Create student with weak password (should fail validation)
- [ ] Try to change another user's password (should return 403)
- [ ] Request password reset code (should send 6-digit code via email)
- [ ] Logout and try to reuse token (should fail)

## 🧪 Security Testing Checklist

- [ ] SQL Injection: Try `' OR 1=1--` in login form
- [ ] XSS: Try `<script>alert('XSS')</script>` in input fields
- [ ] CSRF: Try submitting forms from different origin
- [ ] Brute Force: Try 6+ login attempts
- [ ] Token Reuse: Logout and try to access protected endpoint
- [ ] Mass Assignment: Try sending extra fields in API requests
- [ ] Password Policy: Try weak passwords
- [ ] Rate Limiting: Make 101+ API requests in 1 minute

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Zod Documentation](https://zod.dev/)
- [Nuxt Security Best Practices](https://nuxt.com/docs/guide/going-further/security)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)

