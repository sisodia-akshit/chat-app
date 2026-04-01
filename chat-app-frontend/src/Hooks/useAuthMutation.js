import { useMutation } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  setOtp,
  verifyUser,
} from "../Services/authAPI";
import { useAuth } from "../Context/AuthContext";
import { decryptPrivateKey } from "./usePrivateKeyEncryption";

export const getLoginMutation = ({ password, setPassword }) => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      const user = data.data.data;
      const privateKey = await decryptPrivateKey(
        user.encryptedPrivateKey,
        password,
        user.salt,
        user.iv,
      );

      // store locally
      localStorage.setItem("privateKey", privateKey);
      setPassword("");
      login();
    },
  });
};

export const getOtpMutation = ({ setNext, setName, setEmail }) => {
  return useMutation({
    mutationFn: setOtp,
    onSuccess: (data) => {
      localStorage.setItem("verificationId", data?.data);
      setNext(true);
      setName("");
      setEmail("");
    },
  });
};

export const getVerifyMutation = ({ setContinue, setMessage }) => {
  return useMutation({
    mutationFn: verifyUser,
    onSuccess: (data) => {
      localStorage.clear();
      localStorage.setItem("userId", data.data);
      setContinue(true);
      setMessage("");
    },
  });
};

export const getRegisterMutation = ({ setPassword, setConPassword }) => {
  const { login } = useAuth();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      localStorage.removeItem("userId");
      setPassword("");
      setConPassword("");
      login();
    },
  });
};
