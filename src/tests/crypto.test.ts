import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  isPasswordHashed,
  encryptData,
  decryptData,
  isDataEncrypted,
  encryptApiKeys,
  decryptApiKeys,
} from '../shared/utils/crypto';
import { ApiKeyConnection } from '../shared/types';

describe('Crypto Utility - Password & PIN Hashing (PBKDF2-SHA256)', () => {
  it('should hash a PIN and produce a pbkdf2:v1 formatted string', async () => {
    const pin = '2026';
    const hash = await hashPassword(pin);

    expect(isPasswordHashed(hash)).toBe(true);
    expect(hash.startsWith('pbkdf2:v1:')).toBe(true);
    const parts = hash.split(':');
    expect(parts.length).toBe(4);
    expect(parts[2].length).toBe(32); // 16 bytes = 32 hex chars salt
    expect(parts[3].length).toBe(64); // 32 bytes = 64 hex chars hash
  });

  it('should generate different hashes for the same PIN due to random salting', async () => {
    const pin = '2026';
    const hash1 = await hashPassword(pin);
    const hash2 = await hashPassword(pin);

    expect(hash1).not.toBe(hash2);
    // Both should verify successfully
    expect(await verifyPassword(pin, hash1)).toBe(true);
    expect(await verifyPassword(pin, hash2)).toBe(true);
  });

  it('should reject incorrect PINs', async () => {
    const pin = '2026';
    const hash = await hashPassword(pin);

    expect(await verifyPassword('9999', hash)).toBe(false);
    expect(await verifyPassword('2025', hash)).toBe(false);
    expect(await verifyPassword('', hash)).toBe(false);
  });

  it('should support legacy plain-text fallback for seamless auto-migration', async () => {
    const legacyPin = '2026';
    // When stored value is still plain text, verifyPassword should still match correctly
    expect(await verifyPassword('2026', legacyPin)).toBe(true);
    expect(await verifyPassword('0000', legacyPin)).toBe(false);
  });
});

describe('Crypto Utility - AES-256-GCM Authenticated Encryption', () => {
  it('should encrypt plaintext into an enc:v1 bundle and decrypt accurately', async () => {
    const secretKey = 'AIzaSyExampleRealSecretKey1234567890';
    const cipherBundle = await encryptData(secretKey);

    expect(isDataEncrypted(cipherBundle)).toBe(true);
    expect(cipherBundle.startsWith('enc:v1:')).toBe(true);
    // Ensure raw secret is not in the bundle
    expect(cipherBundle.includes(secretKey)).toBe(false);

    const decrypted = await decryptData(cipherBundle);
    expect(decrypted).toBe(secretKey);
  });

  it('should reject tampered ciphertext due to 128-bit authentication tag verification', async () => {
    const secret = 'sensitive-token-999';
    const cipherBundle = await encryptData(secret);

    const parts = cipherBundle.split(':');
    // Tamper with the last byte of the ciphertext hex
    const lastPart = parts[4];
    const tamperedCipher =
      lastPart.slice(0, -2) + (lastPart.slice(-2) === 'aa' ? 'bb' : 'aa');
    parts[4] = tamperedCipher;
    const tamperedBundle = parts.join(':');

    // Web Crypto decrypt must throw an error due to auth tag verification failure
    await expect(decryptData(tamperedBundle)).rejects.toThrow();
  });

  it('should encrypt and decrypt ApiKeyConnection list seamlessly', async () => {
    const sampleKeys: ApiKeyConnection[] = [
      {
        id: 'key-1',
        name: 'account-alpha',
        key: 'AIzaSyAlphaKey999',
        status: 'active',
        callsCount: 5,
      },
      {
        id: 'key-2',
        name: 'account-beta',
        key: 'AIzaSyBetaKey888',
        status: 'exhausted_429',
        callsCount: 12,
      },
    ];

    const encrypted = await encryptApiKeys(sampleKeys);
    expect(isDataEncrypted(encrypted)).toBe(true);
    expect(encrypted.includes('AIzaSyAlphaKey999')).toBe(false);
    expect(encrypted.includes('AIzaSyBetaKey888')).toBe(false);

    const decrypted = await decryptApiKeys(encrypted, []);
    expect(decrypted).toEqual(sampleKeys);
  });

  it('should handle legacy plain-text JSON gracefully during auto-migration', async () => {
    const legacyKeys: ApiKeyConnection[] = [
      {
        id: 'key-legacy',
        name: 'legacy-acc',
        key: 'AIzaSyLegacyKey',
        status: 'active',
        callsCount: 0,
      },
    ];

    const plainTextJson = JSON.stringify(legacyKeys);
    const parsed = await decryptApiKeys(plainTextJson, []);
    expect(parsed).toEqual(legacyKeys);
  });

  it('should backfill empty keys from fallback list when stored keys are blank', async () => {
    const blankKeys: ApiKeyConnection[] = [
      { id: 'key-1', name: 'acc-1', key: '', status: 'active', callsCount: 0 },
      { id: 'key-2', name: 'acc-2', key: '   ', status: 'active', callsCount: 0 },
    ];
    const fallbackKeys: ApiKeyConnection[] = [
      { id: 'key-1', name: 'acc-1', key: 'real-key-1', status: 'active', callsCount: 0 },
      { id: 'key-2', name: 'acc-2', key: 'real-key-2', status: 'active', callsCount: 0 },
    ];

    const encrypted = await encryptApiKeys(blankKeys);
    const restored = await decryptApiKeys(encrypted, fallbackKeys);

    expect(restored[0].key).toBe('real-key-1');
    expect(restored[1].key).toBe('real-key-2');
  });
});
