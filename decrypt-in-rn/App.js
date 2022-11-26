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
    '{"salt":"7936ff05b3ffc314c614aef4f5bd6f3a19fe619c89b038e5134d0a99ff6c489048b0a450a2093538b8974b3d568b1da2a47408e958ed40af604d0d0716ba9da3","iv":"601ad906ffd8f061b494dcff4163456b2fe09e9580291f5d927326ec1d7d58d93cf9eb4cfb577f95ac156ff0c28f47c3561b065c7bc48aa2c918f00f76210fd2","encrypted":"6489a119c849774004e841caa91763bf6363a8e1cb5aaf"}';
  const password = "x";

  const decrypt = async () => {
    setLoading(true);

    try {
      const payload = JSON.parse(encryptedPayload);
      const salt = Buffer.from(payload.salt, "hex");
      const iv = Buffer.from(payload.iv, "hex");
      const encrypted = Buffer.from(payload.encrypted, "hex");

      // const derivedKey = pbkdf2Sync(password, salt, 10000, 32, "sha256"); // <----------------------------------------------
      const result = await Aes.pbkdf2(password, salt.toString("base64"), 10000, 256);
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
