import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from "crypto";

const dataToEncrypt = "yo mama";
const password = "x";

const encrypt = (): string => {
  const saltByteLength = 64;
  const ivByteLength = 64;

  const data = Buffer.from(dataToEncrypt, "utf8");
  const salt = randomBytes(saltByteLength);
  const derivedKey = pbkdf2Sync(password, salt, 10000, 32, "sha256"); // <----------------------------------------------
  const iv = randomBytes(ivByteLength);
  const cipher = createCipheriv("aes-256-gcm", derivedKey, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const payload = {
    salt: salt.toString("hex"),
    iv: iv.toString("hex"),
    encrypted: Buffer.concat([encrypted, authTag]).toString("hex"),
  };

  return JSON.stringify(payload);
};

const decrypt = (encryptedPayload: string): string => {
  const authTagLength = 16;

  const payload = JSON.parse(encryptedPayload);
  const salt = Buffer.from(payload.salt, "hex");
  const iv = Buffer.from(payload.iv, "hex");
  const encrypted = Buffer.from(payload.encrypted, "hex");
  const derivedKey = pbkdf2Sync(password, salt, 10000, 32, "sha256"); // <----------------------------------------------
  const decipher = createDecipheriv("aes-256-gcm", derivedKey, iv);
  const data = encrypted.slice(0, encrypted.length - authTagLength);
  const authTag = encrypted.slice(encrypted.length - authTagLength, encrypted.length);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

  return decrypted.toString("utf8");
};

const encryptedResult = encrypt();
const decryptedResult = decrypt(encryptedResult);

console.log(`\nDATA TO ENCRYPT:\n${dataToEncrypt}`);
console.log(`\nPASSWORD:\n${password}`);
console.log(`\nENCRYPTED:\n${encryptedResult}`);
console.log(`\nDECRYPTED:\n${decryptedResult}`);
