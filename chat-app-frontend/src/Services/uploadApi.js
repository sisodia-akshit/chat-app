import API from "../Lib/api";

export const uploadFiles = async ({ id, files }) => {
  const res = await API.post(`uploads/${id}`, files);
  return res.data;
};
export const uploadAudio = async ({ formData }) => {
  const res = await API.post("uploads/audio", formData);
  return res.data;
};
