import "./shim";
import { createDecipheriv } from "crypto-polyfilled";
import { useState } from "react";
import { Text, View, NativeModules, Button, ActivityIndicator } from "react-native";

const Aes = NativeModules.Aes;

const authTagLength = 16;

export default function App() {
  const [decrypted, setDecrypted] = useState("");
  const [loading, setLoading] = useState(false);

  const encryptedPayload =
    '{"salt":"544849535f49535f415f434f4e5354414e545f53414c54","iv":"4d46ac2389b0bd4df07bef4dc6dc3e558c2aa9348375cdf285f66df0a298ce0fde523d40604e0ea8c8cc27c9e12352d0e7b80fc74ecaffd0178ec603b4e10dc8","encrypted":"c9c08907617b82d1cecc0f7ee52950f760ab13b0908e75"}';
  const password = "x";

  const decrypt = async () => {
    setLoading(true);

    try {
      const payload = JSON.parse(encryptedPayload);
      const salt = Buffer.from(payload.salt, "hex");
      const iv = Buffer.from(payload.iv, "hex");
      const encrypted = Buffer.from(payload.encrypted, "hex");

      const result = await Aes.pbkdf2(password, salt.toString("utf8"), 10000, 256); // <--------------------------------
      console.log(`\npbkdf2 derived key in hex format:\n${result}`);
      const derivedKey = Buffer.from(result, "hex");

      const decipher = createDecipheriv("aes-256-gcm", derivedKey, iv);
      const data = encrypted.slice(0, encrypted.length - authTagLength);
      const authTag = encrypted.slice(encrypted.length - authTagLength, encrypted.length);
      decipher.setAuthTag(authTag);
      const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

      setDecrypted(decrypted.toString("utf8"));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>Encrypted: {encryptedPayload}</Text>
      <Text>Password: {password}</Text>
      {decrypted && <Text>Decrypted: {decrypted}</Text>}
      {loading && <ActivityIndicator />}
      <Button title="Decrypt" onPress={decrypt}></Button>
    </View>
  );
}
