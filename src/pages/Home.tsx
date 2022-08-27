import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
    getMovies,
    getPopularMovies,
    getTopMovies,
    IGetMoviesResult,
} from "../api";
import SliderComponent from "../Component/Slide";
import Popular from "../Component/Slide/Popular";
import { makeImagePath } from "../utils/Path";

const Wrapper = styled.div`
    background-color: black;
    overflow-x: hidden;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
        url(${(props) => props.bgPhoto});
    background-size: cover;
`;

const MarginBottomDiv = styled.div`
    margin-bottom: 20rem;
`;

const Title = styled.h2`
    font-size: 58px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 16px;
    width: 50%;
`;

const offset = 6;

const Home = () => {
    const { data: moviesData, isLoading: moviesLoding } =
        useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);

    const { data: topMoviesData, isLoading: topLoding } =
        useQuery<IGetMoviesResult>(["movies", "topPlaying"], getTopMovies);

    const { data: popularMovies, isLoading: newLoding } =
        useQuery<IGetMoviesResult>(["movies", "newPlaying"], getPopularMovies);

    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const incraseIndex = () => {
        if (moviesData) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = moviesData?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => {
        setLeaving(!leaving);
    };

    return (
        <Wrapper style={{ height: "150vh" }}>
            {moviesLoding && newLoding ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        onClick={incraseIndex}
                        bgPhoto={makeImagePath(
                            moviesData?.results[0].backdrop_path || ""
                        )}
                    >
                        <Title>{moviesData?.results[0].title}</Title>
                        <Overview>{moviesData?.results[0].overview}</Overview>
                    </Banner>
                    <MarginBottomDiv>
                        <SliderComponent data={moviesData} />
                    </MarginBottomDiv>
                    <MarginBottomDiv>
                        <SliderComponent data={topMoviesData} />
                    </MarginBottomDiv>
                    <MarginBottomDiv>
                        <Popular popDatas={popularMovies} />
                    </MarginBottomDiv>
                </>
            )}
        </Wrapper>
    );
};

export default Home;
