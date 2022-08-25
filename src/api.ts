import axios from "axios";

const API_KEY = "27faabdd8b4cabed661c893df3a24521";
const BASE_PATH = "https://api.themoviedb.org/3";

export const getMovies = async () => {
    return await axios
        .get(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
        .then((res) => res.data);
};
