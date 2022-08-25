import React from "react";
import { useQuery } from "react-query";
import { getMovies } from "../api";

const Home = () => {
    const { data, isLoading } = useQuery(["movies", "noewPlaying"], getMovies);
    console.log(data, isLoading);

    return (
        <div style={{ height: "150vh" }}>
            <h1>Home</h1>
        </div>
    );
};

export default Home;
