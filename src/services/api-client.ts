import axios from "axios";

export default axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: "5149716bfb53e14a9dba8b66c87fcfd3",
  },
});
