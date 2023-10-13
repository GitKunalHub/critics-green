import axios from "axios";

export default axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: "a88310444f31ff04f8d88dd91490876f",
  },
});
