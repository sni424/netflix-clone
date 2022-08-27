import { AnimatePresence, motion, useScroll } from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import SliderComponent from "../Component/Slide";
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

const Title = styled.h2`
    font-size: 58px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 16px;
    width: 50%;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
    width: 100%;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 95%;
    left: 0;
    right: 0;
    margin: 0 auto;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
    background-color: white;
    height: 200px;
    font-size: 18px;
    background-image: url(${(props) => props.bgPhoto});
    background-position: center center;
    background-size: cover;
    cursor: pointer;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`;

const InFo = styled(motion.div)`
    padding: 20px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    width: 85%;
    position: absolute;
    bottom: -60px;
    h4 {
        text-align: center;
        font-size: 18px;
    }
`;

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;
const BigMovie = styled(motion.div)`
    width: 40vw;
    height: 80vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    position: absolute;
    background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.img`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
`;

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 46px;
    position: relative;
    top: -80px;
`;

const BigOverview = styled.p`
    padding: 20px;
    position: relative;
    top: -80px;
    color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
    hidden: {
        x: window.outerWidth + 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth - 5,
    },
};

const BoxBariants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.2,
        y: -50,
        transition: { delay: 0.5, type: "tween", duration: 0.3 },
    },
};

const infoVariants = {
    hover: {
        opacity: 1,
        transition: { delay: 0.5, type: "tween", duration: 0.3 },
    },
};

const offset = 6;

const Home = () => {
    const { data, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "noewPlaying"],
        getMovies
    );
    const navi = useNavigate();
    const bigMovieMatch: PathMatch<string> | null =
        useMatch("/movies/:movieId");
    const { scrollY } = useScroll();

    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const incraseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => {
        setLeaving(!leaving);
    };

    const boxClicked = (movieId: number) => {
        navi(`/movies/${movieId}`);
    };
    const onOverlayClick = () => {
        navi("/");
    };

    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        data?.results.find(
            (movie) => String(movie.id) === bigMovieMatch.params.movieId
        );

    return (
        <Wrapper style={{ height: "150vh" }}>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        onClick={incraseIndex}
                        bgPhoto={makeImagePath(
                            data?.results[0].backdrop_path || ""
                        )}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <SliderComponent data={data} />
                </>
            )}
        </Wrapper>
    );
};

export default Home;
