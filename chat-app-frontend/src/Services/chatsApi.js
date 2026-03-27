import API from "../Lib/api";

export const getOrCreateChat = async ({ id }) => {
  const res = await API.post("chats/get-or-create", { receiverId: id });
  return res.data;
};
export const getPrevChats = async () => {
  const res = await API.get("chats/");
  return res.data;
};
