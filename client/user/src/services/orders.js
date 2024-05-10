import axios from "axios";
import { API_SERVER } from "../config";

const URL = `${API_SERVER}/orders`;

export const createOrder = async (order) => {
  const res = await axios.post(URL, order);
  return res.data;
};

export const getOrders = async () => {
  const res = await axios.get(URL);
  return res.data;
};
