import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import SliderComponent from "../Component/Slide/Movies";
import { makeImagePath } from "../utils/Path";

const Wrapper = styled.div`
    background-color: rgba(0, 0, 0, 0.1);
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

const MarginiDiv = styled.div`
    margin: 5rem 0 25rem 0;
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
    const { data, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"],
        () => getMovies("now_playing")
    );

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        // onClick={incraseIndex}
                        bgPhoto={makeImagePath(
                            data?.results[0].backdrop_path || ""
                        )}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    {["now_playing", "popular", "top_rated", "upcoming"].map(
                        (category) => {
                            return (
                                <MarginiDiv>
                                    <SliderComponent type={category} />
                                </MarginiDiv>
                            );
                        }
                    )}
                </>
            )}
        </Wrapper>
    );
};

export default Home;
