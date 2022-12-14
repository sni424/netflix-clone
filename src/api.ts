import axios from "axios";

const API_KEY = "27faabdd8b4cabed661c893df3a24521";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
    release_date: string;
    vote_average: string;
    adult: boolean;
}
interface ITv {
    id: number;
    backdrop_path: string;
    poster_path: string;
    name: string;
    overview: string;
    first_air_date: string;
    vote_average: string;
}

export interface IGetMoviesResult {
    dates: { maximum: string; minimum: string };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface IGetTopMoviesResult {
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface IGetTvResult {
    page: number;
    results: ITv[];
    total_pages: number;
    total_results: number;
}

export const getMovies = async (type: string) => {
    return await axios
        .get(`${BASE_PATH}/movie/${type}?api_key=${API_KEY}`)
        .then((res) => res.data);
};

export const getTv = async (type: string) => {
    return await axios
        .get(`${BASE_PATH}/tv/${type}?api_key=${API_KEY}`)
        .then((res) => res.data);
};

export const getSearchMovies = async (search: string) => {
    return await axios
        .get(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${search}`)
        .then((res) => res.data);
};

export const getSearchTv = async (search: string) => {
    return await axios
        .get(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${search}`)
        .then((res) => res.data);
};
