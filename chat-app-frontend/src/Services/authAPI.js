import API from "../Lib/api";

export const registerUser = async (data) => {
  const res = await API.post("auth/register", data);
  return res.data;
};
export const verifyUser = async (data) => {
  const res = await API.post("auth/verify-otp", data);
  return res.data;
};
export const loginUser = async (data) => {
  const res = await API.post("auth/login", data);
  return res;
};
export const logoutUser = async () => {
  const res = await API.post("auth/logout");
  return res;
};
