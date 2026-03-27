import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser, verifyUser } from "../Services/authAPI";
import { useAuth } from "../Context/AuthContext";

export const getLoginMutation = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      login();
    },
  });
};

export const getRegisterMutation = ({
  setContinue,
  setMessage,
  setName,
  setPassword,
}) => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setContinue(true);
      console.log(data);
      setMessage(data?.message);
      setName("");
      setPassword("");
    },
  });
};

export const getVerifyMutation = ({ setMessage }) => {
  const { login } = useAuth();
  return useMutation({
    mutationFn: verifyUser,
    onSuccess: (data) => {
      setMessage("");
      login();
    },
  });
};
