import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
    IoChevronBackCircleOutline,
    IoChevronForwardCircleOutline,
} from "react-icons/io5";
import { getMovies, IGetMoviesResult } from "../../../api";
import { makeImagePath } from "../../../utils/Path";
import adultImg from "../../../img/adult.png";
import notAdultImg from "../../../img/All.png";

const SliderDiv = styled.div`
    position: relative;
    top: -100px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Button = styled.div<{ right?: string }>`
    position: absolute;
    z-index: 4;
    right: ${(props) => props.right};
    width: 5rem;
    background-color: black;
    opacity: 0.5;
    border-radius: 5rem;
    cursor: pointer;
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
    z-index: 1;
`;
const BigMovie = styled(motion.div)<{ scrollY: number }>`
    top: ${(props) => props.scrollY + 75}px;
    width: 40vw;
    height: 80vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    position: absolute;
    background-color: ${(props) => props.theme.black.lighter};
    z-index: 2;
    border-radius: 1rem;
`;

const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
    position: relative;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
`;

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 45px;
    position: absolute;
    bottom: 0;
    font-weight: 600;
    overflow: hidden;
`;

const BottonBox = styled.div`
    padding: 20px;
    margin: 0 auto;
    height: 30%;
    overflow-y: auto;
`;

const BigOverview = styled.p`
    position: relative;
    color: ${(props) => props.theme.white.lighter};
    font-weight: 500;
    font-size: 1.1rem;
`;

const Category = styled.div`
    position: absolute;
    margin-top: -20rem;
    font-size: 2rem;
    font-weight: 800;
`;

const OpenDay = styled.div`
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
`;

const Vote = styled.div`
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
`;

const AdultDiv = styled.div`
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
`;

const AdultImg = styled.img`
    width: 1.6rem;
    padding-left: 0.5rem;
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
        scale: 1.3,
        y: -50,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween",
        },
    },
};

const infoVariants = {
    hover: {
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween",
        },
        opacity: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
};

const offset = 6;

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}

const SliderComponent = ({ type }: { type: string }) => {
    const { data, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", type],
        () => getMovies(type)
    );
    const navi = useNavigate();

    const [leaving, setLeaving] = useState(false);
    const [index, setIndex] = useState(0);
    const { scrollY } = useScroll();

    const bigMovieMatch = useMatch(`/movies/${type}/:movieId`);

    const boxClicked = (category: string, movieId: number) => {
        navi(`/movies/${category}/${movieId}`);
    };
    const onOverlayClick = () => {
        navi("/");
    };

    const incraseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };

    const decraseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data?.results.length - 1;
            setIndex((prev) => (prev === 0 ? 2 : prev - 1));
        }
    };
    const toggleLeaving = () => {
        setLeaving(!leaving);
    };

    const switchCategory = () => {
        switch (type) {
            case "popular":
                return "현재 많은사람들이 보고있는 인기있는 영화";
            case "top_rated":
                return "모두가 극찬한 최고평점 영화";
            case "upcoming":
                return "개봉 예정작";
            default:
                return "현재 상영중";
        }
    };

    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        data?.results.find(
            (movie) => String(movie.id) === bigMovieMatch.params.movieId
        );

    console.log(clickedMovie);

    return (
        <>
            <SliderDiv>
                <Category>{switchCategory()}</Category>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Button onClick={incraseIndex}>
                        <IoChevronBackCircleOutline size="100%" />
                    </Button>
                    <Row
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "tween", duration: 0.8 }}
                        key={type + index}
                    >
                        {data?.results
                            .slice(1)
                            .slice(offset * index, offset * index + offset)
                            .map((movie: IMovie) => {
                                return (
                                    <Box
                                        layoutId={type + movie.id + ""}
                                        onClick={() =>
                                            boxClicked(type, movie.id)
                                        }
                                        variants={BoxBariants}
                                        key={type + movie.id}
                                        initial="normal"
                                        whileHover="hover"
                                        transition={{
                                            type: "tween",
                                        }}
                                        bgPhoto={makeImagePath(
                                            movie.backdrop_path ||
                                                movie.poster_path,
                                            "w500"
                                        )}
                                    >
                                        <InFo variants={infoVariants}>
                                            <h4>{movie.title}</h4>
                                        </InFo>
                                    </Box>
                                );
                            })}
                    </Row>
                    <Button onClick={decraseIndex} right="0">
                        <IoChevronForwardCircleOutline size="100%" />
                    </Button>
                </AnimatePresence>
            </SliderDiv>
            <AnimatePresence>
                {bigMovieMatch ? (
                    <>
                        <Overlay
                            onClick={onOverlayClick}
                            exit={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        />
                        <BigMovie
                            scrollY={scrollY.get()}
                            layoutId={type + bigMovieMatch.params.movieId}
                        >
                            {clickedMovie && (
                                <>
                                    <BigCover
                                        style={{
                                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                clickedMovie.backdrop_path,
                                                "original"
                                            )})`,
                                        }}
                                    >
                                        <BigTitle>
                                            {clickedMovie.title}
                                        </BigTitle>
                                    </BigCover>
                                    <BottonBox>
                                        <OpenDay>
                                            개봉일 : {clickedMovie.release_date}
                                        </OpenDay>
                                        <Vote>
                                            평점 :
                                            <div
                                                style={{
                                                    color: "#4cd137",
                                                    marginLeft: "0.5rem",
                                                    fontWeight: 800,
                                                    fontSize: "1.2rem",
                                                }}
                                            >
                                                {clickedMovie.vote_average}
                                            </div>
                                        </Vote>
                                        <AdultDiv>
                                            청불 :{" "}
                                            <AdultImg
                                                src={
                                                    clickedMovie.adult
                                                        ? adultImg
                                                        : notAdultImg
                                                }
                                                alt="adult"
                                            />
                                        </AdultDiv>
                                        <BigOverview>
                                            {clickedMovie.overview}
                                        </BigOverview>
                                    </BottonBox>
                                </>
                            )}
                        </BigMovie>
                    </>
                ) : null}
            </AnimatePresence>
        </>
    );
};

export default SliderComponent;
