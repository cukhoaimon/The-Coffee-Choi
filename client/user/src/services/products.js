import axios from "axios";
import { API_SERVER } from "../config";

const URL = `${API_SERVER}/products`;

export const getDashboardProducts = async () => {
  const res = await axios.get(`${URL}?sort=-sold&limit=6`);
  return res.data;
};

export const getProducts = async () => {
  const res = await axios.get(URL);
  return res.data;
};

export const getProduct = async (slug) => {
  const res = await axios.get(`${URL}/${slug}`);
  return res.data;
};
