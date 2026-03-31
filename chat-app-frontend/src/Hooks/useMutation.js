import { useMutation } from "@tanstack/react-query";
import { uploadFiles } from "../Services/uploadApi";
import { setPublicKey } from "../Services/userAPI";

export const useUploadMutation = ({ setFiles }) => {
  return useMutation({
    mutationFn: uploadFiles,
    onSuccess: (data) => {
      console.log(data);
      setFiles(null);
    },
    onError: (error) => {
      console.log(error?.response);
    },
  });
};
export const useAudioMutation = () => {
  return useMutation({
    mutationFn: uploadFiles,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error?.response);
    },
  });
};

export const usePublicKeyMutation = () => {
  return useMutation({
    mutationFn: setPublicKey,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error?.response);
    },
  });
};
