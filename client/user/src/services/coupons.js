import axios from "axios";
import { API_SERVER } from "../config";

const URL = `${API_SERVER}/coupons`;

export const getCoupon = async (code) => {
  const res = await axios.get(`${URL}/${code}`);
  return res.data;
};
