const encoder = new TextEncoder();
const decoder = new TextDecoder();

const ENCRYPTION_SECRET = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET ?? "";

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }

  const bytes = new Uint8Array(hex.length / 2);

  for (let index = 0; index < hex.length; index += 2) {
    bytes[index / 2] = Number.parseInt(hex.slice(index, index + 2), 16);
  }

  return bytes;
}

function toArrayBuffer(view: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(view.byteLength);
  new Uint8Array(buffer).set(view);
  return buffer;
}

async function createAesKey(): Promise<CryptoKey> {
  if (!ENCRYPTION_SECRET) {
    throw new Error("NEXT_PRIVATE_ENCRYPTION_SECRET is not configured");
  }

  const secretBytes = encoder.encode(ENCRYPTION_SECRET.normalize("NFKC"));
  const secretHash = await crypto.subtle.digest("SHA-256", toArrayBuffer(secretBytes));

  return crypto.subtle.importKey("raw", secretHash, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptText(value: string): Promise<string> {
  const key = await createAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const valueBytes = encoder.encode(value);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: toArrayBuffer(iv),
    },
    key,
    toArrayBuffer(valueBytes),
  );

  return `${bytesToHex(iv)}:${bytesToHex(new Uint8Array(encrypted))}`;
}

export async function decryptText(payload: string): Promise<string> {
  const [ivHex, encryptedHex] = payload.split(":");

  if (!ivHex || !encryptedHex) {
    throw new Error("Invalid encrypted payload format");
  }

  const key = await createAesKey();
  const iv = hexToBytes(ivHex);
  const encryptedBytes = hexToBytes(encryptedHex);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: toArrayBuffer(iv),
    },
    key,
    toArrayBuffer(encryptedBytes),
  );

  return decoder.decode(decrypted);
}
