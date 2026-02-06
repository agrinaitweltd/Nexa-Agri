export interface PasswordRules {
  length: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

/**
 * Checks password against strict complexity rules
 */
export const checkPasswordStrength = (password: string): PasswordRules => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

/**
 * Checks if all password rules are satisfied
 */
export const isPasswordStrong = (rules: PasswordRules): boolean => {
  return Object.values(rules).every(Boolean);
};

/**
 * Generates a random alphanumeric salt
 */
export const generateSalt = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let salt = '';
  const array = new Uint32Array(16);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < array.length; i++) {
    salt += chars.charAt(array[i] % chars.length);
  }
  return salt;
};

/**
 * Secure hashing using SHA-256 with a provided salt.
 * In a real-world scenario, this would be computed server-side.
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
