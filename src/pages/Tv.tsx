import { useQuery } from "react-query";
import styled from "styled-components";
import { getTv, IGetTvResult } from "../api";
import TvSliderComponent from "../Component/Slide/Tv/indesx";
import { makeImagePath } from "../utils/Path";

const Wrapper = styled.div`
    background-color: black;
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

const Title = styled.h1`
    font-size: 3rem;
    font-weight: 800;
`;

const Overview = styled.h3`
    margin-top: 1rem;
    font-size: 1.2rem;
    font-weight: 500;
    width: 50%;
`;

const MarginBottomDiv = styled.div`
    margin-bottom: 25rem;
`;

const Tv = () => {
    const { data, isLoading } = useQuery<IGetTvResult>(
        ["Tv", "nowPlaying"],
        () => getTv("popular")
    );

    console.log(data);

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>loading...</Loader>
            ) : (
                <>
                    <Banner
                        bgPhoto={makeImagePath(
                            data?.results[0].backdrop_path || ""
                        )}
                    >
                        <Title>{data?.results[0].name}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    {["airing_today", "popular", "top_rated", "on_the_air"].map(
                        (data) => {
                            return (
                                <MarginBottomDiv>
                                    <TvSliderComponent type={data} />
                                </MarginBottomDiv>
                            );
                        }
                    )}
                </>
            )}
        </Wrapper>
    );
};

export default Tv;
