const base64ToUint8 = (base64) =>
  Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

import nacl from "tweetnacl";
import * as util from "tweetnacl-util";

export const decryptFile = async ({
  fileUrl,
  encryptedKey,
  nonce,
  iv,
  senderPublicKey,
  receiverPrivateKey,
}) => {
  try {
    // 📥 Download encrypted file
    const res = await fetch(fileUrl);
    const encryptedBuffer = await res.arrayBuffer();

    // 🔓 Decrypt AES key (NaCl)
    const aesKey = nacl.box.open(
      util.decodeBase64(encryptedKey),
      util.decodeBase64(nonce),
      util.decodeBase64(senderPublicKey),
      util.decodeBase64(receiverPrivateKey),
    );

    if (!aesKey) throw new Error("Key decryption failed");

    // 🔓 Decrypt file (AES)
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      aesKey,
      "AES-GCM",
      false,
      ["decrypt"],
    );

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: base64ToUint8(iv),
      },
      cryptoKey,
      encryptedBuffer,
    );

    return decrypted;
  } catch (err) {
    console.error("Decrypt file error:", err);
    return null;
  }
};
