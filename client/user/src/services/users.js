import axios from "axios";
import { API_SERVER } from "../config";

const URL = `${API_SERVER}/users`;

export const updateUser = async (data) => {
  const res = await axios.patch(`${URL}/update-info`, data);
  return res.data;
};
