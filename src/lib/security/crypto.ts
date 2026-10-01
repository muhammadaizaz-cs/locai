import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
// Fallback default key for development/demo mode if not supplied in env
const DEFAULT_SECRET = 'locai_secret_encryption_key_2026_demo_sec!';

function getEncryptionKey(): Buffer {
  const secret = process.env.WORDPRESS_ENCRYPTION_KEY || DEFAULT_SECRET;
  // Hash to 32 bytes to ensure valid key length for AES-256
  return crypto.createHash('sha256').update(secret).digest();
}

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  tag: string;
}

/**
 * Encrypt sensitive WordPress Application Passwords server-side using AES-256-GCM
 */
export function encryptPassword(plainText: string): EncryptedData {
  const iv = crypto.randomBytes(12); // 96-bit recommended for GCM
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag().toString('hex');

  return {
    ciphertext: encrypted,
    iv: iv.toString('hex'),
    tag: tag,
  };
}

/**
 * Decrypt sensitive WordPress Application Passwords server-side only
 */
export function decryptPassword(ciphertext: string, ivHex: string, tagHex: string): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Sanitize plain application passwords (stripping WP formatted spaces like "xxxx xxxx xxxx xxxx")
 */
export function sanitizeApplicationPassword(pass: string): string {
  return pass.trim().replace(/\s+/g, '');
}
