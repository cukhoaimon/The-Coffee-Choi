import axios from "axios";
import { API_SERVER } from "../config";

const URL = `${API_SERVER}/categories`;

export const getCategories = async () => {
  const res = await axios.get(`${URL}?status=true`);
  return res.data;
};

export const getProductsCustom = async (
  category,
  page,
  limit,
  sort,
  from,
  to,
  discount,
  name
) => {
  const res =
    await axios.get(`${URL}/${category}?page=${page}&limit=${limit}&sort=${sort}&name=${name}
    `);
  return res.data;
};
