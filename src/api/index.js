import axios from "axios";

const URL = process.env.VUE_APP_URL;

const HTTP = axios.create({
  baseURL: process.env.VUE_APP_URL,
  headers: {
    Authorization: "Token " + process.env.VUE_APP_TOKEN,
  },
});

export const api = {
  async getUsers(str) {
    try {
      const response = await HTTP.post(URL, { query: str });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
};
