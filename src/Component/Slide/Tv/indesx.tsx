import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
    IoChevronBackCircleOutline,
    IoChevronForwardCircleOutline,
} from "react-icons/io5";
import { makeImagePath } from "../../../utils/Path";
import { getTv, IGetTvResult } from "../../../api";

const SliderDiv = styled.div<{ margintop?: any }>`
    position: relative;
    top: -100px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: ${(props) => props.margintop};
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
    width: 90%;
    height: 400px;
    border-radius: 0.5rem;
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
    height: 100%;
`;

const BigOverview = styled.p`
    position: relative;
    color: ${(props) => props.theme.white.lighter};
    font-weight: 500;
    height: 30%;
    font-size: 1.1rem;
    overflow-y: auto;
`;

const Category = styled.div`
    position: absolute;
    margin-top: -30rem;
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

const rowVariants = {
    hidden: (moveBool: boolean) => ({
        x: moveBool ? window.outerWidth + 5 : -window.outerWidth - 5,
    }),
    visible: {
        x: 0,
    },
    exit: (moveBool: boolean) => ({
        x: moveBool ? -window.outerWidth - 5 : window.outerWidth + 5,
    }),
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
interface ITv {
    id: number;
    backdrop_path: string;
    poster_path: string;
    name: string;
    overview: string;
    first_air_date: string;
    vote_average: string;
}

const TvSliderComponent = ({ type }: { type: string }) => {
    const { data, isLoading } = useQuery<IGetTvResult>(["tv", type], () =>
        getTv(type)
    );
    const navi = useNavigate();

    const [leaving, setLeaving] = useState(false);
    const [index, setIndex] = useState(0);
    const [moveBool, setMoveBool] = useState(false);
    const { scrollY } = useScroll();

    const bigTvMatch = useMatch(`/tv/${type}/:tvId`);

    const boxClicked = (category: string, movieId: number) => {
        navi(`/tv/${category}/${movieId}`);
    };
    const onOverlayClick = () => {
        navi("/tv");
    };

    const incraseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalTv = data?.results.length - 1;
            const maxIndex = Math.floor(totalTv / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };

    const decraseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalTv = data?.results.length - 1;
            const maxIndex = Math.floor(totalTv / offset) - 1;
            setIndex((prev) => (prev === 0 ? maxIndex - 1 : prev - 1));
        }
    };
    const toggleLeaving = () => {
        setLeaving(!leaving);
    };

    const switchCategory = () => {
        switch (type) {
            case "popular":
                return "인기있는 드라마";
            case "top_rated":
                return "모두가 극찬한 최고평점 드라마";
            case "on_the_air":
                return "현재 방송중";
            default:
                return "오늘 방송";
        }
    };

    const clickedTv =
        bigTvMatch?.params.tvId &&
        data?.results.find((tv) => String(tv.id) === bigTvMatch.params.tvId);

    return (
        <>
            <SliderDiv margintop={type === "airing_today" ? "0" : "35rem"}>
                <Category>{switchCategory()}</Category>
                <AnimatePresence
                    initial={false}
                    onExitComplete={toggleLeaving}
                    custom={moveBool}
                >
                    <Button onClick={decraseIndex}>
                        <IoChevronBackCircleOutline size="100%" />
                    </Button>
                    <Row
                        custom={moveBool}
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
                            .map((tv: ITv) => {
                                return (
                                    <Box
                                        layoutId={type + tv.id + ""}
                                        onClick={() => boxClicked(type, tv.id)}
                                        variants={BoxBariants}
                                        key={type + tv.id}
                                        initial="normal"
                                        whileHover="hover"
                                        transition={{
                                            type: "tween",
                                        }}
                                        bgPhoto={makeImagePath(
                                            tv.backdrop_path || tv.poster_path,
                                            "original"
                                        )}
                                    >
                                        <InFo variants={infoVariants}>
                                            <h4>{tv.name}</h4>
                                        </InFo>
                                    </Box>
                                );
                            })}
                    </Row>
                    <Button onClick={incraseIndex} right="0">
                        <IoChevronForwardCircleOutline size="100%" />
                    </Button>
                </AnimatePresence>
            </SliderDiv>
            <AnimatePresence>
                {bigTvMatch ? (
                    <>
                        <Overlay
                            onClick={onOverlayClick}
                            exit={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        />
                        <BigMovie
                            scrollY={scrollY.get()}
                            layoutId={type + bigTvMatch.params.tvId}
                        >
                            {clickedTv && (
                                <>
                                    <BigCover
                                        style={{
                                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                clickedTv.backdrop_path,
                                                "original" ||
                                                    clickedTv.poster_path
                                            )})`,
                                        }}
                                    >
                                        <BigTitle>{clickedTv.name}</BigTitle>
                                    </BigCover>
                                    <BottonBox>
                                        <OpenDay>
                                            첫 방영 일자 :{" "}
                                            {clickedTv.first_air_date}
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
                                                {clickedTv.vote_average}
                                            </div>
                                        </Vote>
                                        <BigOverview>
                                            {clickedTv.overview}
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

export default TvSliderComponent;
