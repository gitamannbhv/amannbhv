const SYSTEM_SECRET = "MY_SUPER_SECRET_MASTER_KEY_2025";

export const cryptoUtils = {
  sha256: async (message) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },
  encrypt: async (text) => {
    const textBytes = new TextEncoder().encode(text);
    const keyBytes = new TextEncoder().encode(SYSTEM_SECRET);
    const encryptedBytes = textBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
    return btoa(String.fromCharCode(...encryptedBytes));
  },
  decrypt: async (cipherText) => {
    try {
      const encryptedBytes = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
      const keyBytes = new TextEncoder().encode(SYSTEM_SECRET);
      const decryptedBytes = encryptedBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
      return new TextDecoder().decode(decryptedBytes);
    } catch (e) { return "Decryption Error"; }
  }
};