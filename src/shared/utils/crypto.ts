// Native Web Crypto API implementation for FE Study Hub
// Standards: AES-256-GCM (Authenticated Encryption) & PBKDF2-SHA256 (Salted Password Hashing)
// Zero external bloat: uses standard runtime window.crypto / globalThis.crypto

import { ApiKeyConnection } from '../types';

const PBKDF2_ROUNDS = 100000;
const HASH_VERSION = 'pbkdf2:v1';
const ENC_VERSION = 'enc:v1';
const VAULT_MASTER_SEED = 'FE_STUDY_HUB_SECURE_VAULT_KEY_2026';

function getCrypto(): Crypto {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    return globalThis.crypto;
  }
  throw new Error('Web Cryptography API is not available in this runtime environment.');
}

// Byte <-> Hex helpers
function toHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  if (hex.length % 2 !== 0) throw new Error('Invalid hex string length');
  const buffer = new ArrayBuffer(hex.length / 2);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Constant-time string comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// ==========================================
// 1. Password / PIN Hashing (PBKDF2-SHA256)
// ==========================================

export function isPasswordHashed(str: string): boolean {
  return typeof str === 'string' && str.startsWith(`${HASH_VERSION}:`);
}

/**
 * Hash a password or PIN using PBKDF2 with SHA-256, 100,000 rounds, and a 16-byte random salt.
 * Output format: pbkdf2:v1:<saltHex>:<hashHex>
 */
export async function hashPassword(password: string): Promise<string> {
  const cryptoObj = getCrypto();
  const encoder = new TextEncoder();
  const salt = cryptoObj.getRandomValues(new Uint8Array(16));

  const keyMaterial = await cryptoObj.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await cryptoObj.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ROUNDS,
      hash: 'SHA-256',
    },
    keyMaterial,
    256 // 256 bits = 32 bytes
  );

  const hashHex = toHex(new Uint8Array(derivedBits));
  const saltHex = toHex(salt);

  return `${HASH_VERSION}:${saltHex}:${hashHex}`;
}

/**
 * Verify an entered password/PIN against a stored value.
 * Handles both PBKDF2 salted hashes and legacy plain-text fallback for auto-migration.
 */
export async function verifyPassword(password: string, storedHashOrPlain: string): Promise<boolean> {
  if (!storedHashOrPlain) return false;

  // Check if stored value is a PBKDF2 hash
  if (isPasswordHashed(storedHashOrPlain)) {
    const parts = storedHashOrPlain.split(':');
    if (parts.length !== 4) return false;
    const [, , saltHex, targetHashHex] = parts;

    try {
      const cryptoObj = getCrypto();
      const encoder = new TextEncoder();
      const salt = fromHex(saltHex);

      const keyMaterial = await cryptoObj.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );

      const derivedBits = await cryptoObj.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: PBKDF2_ROUNDS,
          hash: 'SHA-256',
        },
        keyMaterial,
        256
      );

      const computedHashHex = toHex(new Uint8Array(derivedBits));
      return timingSafeEqual(computedHashHex, targetHashHex);
    } catch {
      return false;
    }
  }

  // Legacy plain-text fallback (allows seamless migration on first run)
  return timingSafeEqual(password, storedHashOrPlain);
}

// ==========================================
// 2. Data & API Key Encryption (AES-256-GCM)
// ==========================================

async function deriveAesGcmKey(salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const cryptoObj = getCrypto();
  const encoder = new TextEncoder();

  const keyMaterial = await cryptoObj.subtle.importKey(
    'raw',
    encoder.encode(VAULT_MASTER_SEED),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await cryptoObj.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ROUNDS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export function isDataEncrypted(str: string): boolean {
  return typeof str === 'string' && str.startsWith(`${ENC_VERSION}:`);
}

/**
 * Encrypt a string using AES-256-GCM with PBKDF2 key derivation and a unique 96-bit random IV.
 * Output format: enc:v1:<saltHex>:<ivHex>:<cipherHex>
 */
export async function encryptData(plainText: string): Promise<string> {
  const cryptoObj = getCrypto();
  const encoder = new TextEncoder();
  const salt = cryptoObj.getRandomValues(new Uint8Array(new ArrayBuffer(16)));
  const iv = cryptoObj.getRandomValues(new Uint8Array(new ArrayBuffer(12))); // Standard 96-bit IV for GCM

  const key = await deriveAesGcmKey(salt);
  const plainBytes = encoder.encode(plainText);

  const cipherBuffer = await cryptoObj.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128, // 128-bit authentication tag
    },
    key,
    plainBytes
  );

  const saltHex = toHex(salt);
  const ivHex = toHex(iv);
  const cipherHex = toHex(new Uint8Array(cipherBuffer));

  return `${ENC_VERSION}:${saltHex}:${ivHex}:${cipherHex}`;
}

/**
 * Decrypt an AES-256-GCM encrypted string.
 * Validates integrity via 128-bit auth tag. Throws if corrupted or tampered.
 */
export async function decryptData(cipherBundle: string): Promise<string> {
  if (!isDataEncrypted(cipherBundle)) {
    // If not encrypted format, return as-is (graceful fallback)
    return cipherBundle;
  }

  const parts = cipherBundle.split(':');
  if (parts.length !== 5) {
    throw new Error('Invalid encrypted bundle format');
  }

  const [, , saltHex, ivHex, cipherHex] = parts;
  const salt = fromHex(saltHex);
  const iv = fromHex(ivHex);
  const cipherBytes = fromHex(cipherHex);

  const key = await deriveAesGcmKey(salt);

  const decryptedBuffer = await getCrypto().subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128,
    },
    key,
    cipherBytes
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

// ==========================================
// 3. API Keys Storage Handlers
// ==========================================

/**
 * Encrypts an array of ApiKeyConnection objects into a single AES-256-GCM bundle.
 */
export async function encryptApiKeys(keys: ApiKeyConnection[]): Promise<string> {
  const json = JSON.stringify(keys);
  return await encryptData(json);
}

/**
 * Decrypts stored API key data from localStorage.
 * Handles encrypted ciphertext, legacy plain-text JSON, and returns fallback if invalid.
 */
export async function decryptApiKeys(
  storedData: string | null,
  fallback: ApiKeyConnection[]
): Promise<ApiKeyConnection[]> {
  if (!storedData) return fallback;

  try {
    let parsed: ApiKeyConnection[] | null = null;
    if (isDataEncrypted(storedData)) {
      const decryptedJson = await decryptData(storedData);
      parsed = JSON.parse(decryptedJson);
    } else {
      parsed = JSON.parse(storedData);
    }

    if (!Array.isArray(parsed) || parsed.length === 0) return fallback;

    // Backfill any empty/missing keys from fallback (e.g. newly provisioned env keys)
    return parsed.map((item, idx) => {
      const fallbackItem = fallback.find((f) => f.id === item.id) || fallback[idx];
      if ((!item.key || item.key.trim() === '') && fallbackItem && fallbackItem.key) {
        return { ...item, key: fallbackItem.key, name: item.name || fallbackItem.name };
      }
      return item;
    });
  } catch (err) {
    console.warn('Failed to decrypt or parse API keys, using fallback:', err);
    return fallback;
  }
}
