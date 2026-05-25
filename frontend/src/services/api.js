import axios from "axios";

const API = axios.create({
  baseURL: "https://xhamia-projectt.onrender.com/api",
});

export default API;