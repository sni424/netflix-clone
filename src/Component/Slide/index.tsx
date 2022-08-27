import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult } from "../../api";
import { makeImagePath } from "../../utils/Path";

const SliderDiv = styled.div`
    position: relative;
    top: -100px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Button = styled.button<{ right?: string }>`
    position: absolute;
    z-index: 99;
    right: ${(props) => props.right};
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

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}

const SliderComponent = ({ data }: any) => {
    const navi = useNavigate();

    const [leaving, setLeaving] = useState(false);
    const [index, setIndex] = useState(0);
    const { scrollY } = useScroll();

    const bigMovieMatch: PathMatch<string> | null =
        useMatch("/movies/:movieId");

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
            (movie: IMovie) => String(movie.id) === bigMovieMatch.params.movieId
        );

    return (
        <>
            <SliderDiv>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                    <Button>left</Button>
                    <Row
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "tween", duration: 0.8 }}
                        key={index}
                    >
                        {data?.results
                            .slice(1)
                            .slice(offset * index, offset * index + offset)
                            .map((movie: IMovie) => {
                                return (
                                    <Box
                                        layoutId={movie.id + ""}
                                        onClick={() => boxClicked(movie.id)}
                                        variants={BoxBariants}
                                        key={movie.id}
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
                    <Button right="0">right</Button>
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
                            style={{ top: scrollY.get() + 100 }}
                            layoutId={bigMovieMatch.params.movieId}
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
                                    />
                                    <BigTitle>{clickedMovie.title}</BigTitle>
                                    <BigOverview>
                                        {clickedMovie.overview}
                                    </BigOverview>
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
