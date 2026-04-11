/**
 * Password validation composable
 * Validates passwords according to security policy
 */

export interface PasswordValidation {
  valid: boolean;
  errors: string[];
}

export const usePasswordValidation = () => {
  const validatePassword = (password: string): PasswordValidation => {
    const errors: string[] = [];

    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  const getPasswordStrength = (password: string): { 
    strength: 'weak' | 'medium' | 'strong';
    score: number;
  } => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++; // Special characters

    if (score <= 2) return { strength: 'weak', score };
    if (score <= 4) return { strength: 'medium', score };
    return { strength: 'strong', score };
  };

  return {
    validatePassword,
    getPasswordStrength,
  };
};
