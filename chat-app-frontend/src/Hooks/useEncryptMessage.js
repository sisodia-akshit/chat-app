import nacl from "tweetnacl";
import * as util from "tweetnacl-util";

export const encryptMessage = (
  message,
  senderPrivateKey,
  receiverPublicKey,
) => {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);

  const encrypted = nacl.box(
    util.decodeUTF8(message),
    nonce,
    util.decodeBase64(receiverPublicKey),
    util.decodeBase64(senderPrivateKey),
  );

  return {
    encrypted: util.encodeBase64(encrypted),
    nonce: util.encodeBase64(nonce),
  };
};

export const decryptMessage = (
  encrypted,
  nonce,
  senderPublicKey,
  receiverPrivateKey,
) => {
  const decrypted = nacl.box.open(
    util.decodeBase64(encrypted),
    util.decodeBase64(nonce),
    util.decodeBase64(senderPublicKey),
    util.decodeBase64(receiverPrivateKey),
  );

  if (!decrypted) return null;

  return util.encodeUTF8(decrypted);
};
