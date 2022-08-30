import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import {
    getSearchMovies,
    getSearchTv,
    IGetMoviesResult,
    IGetTvResult,
} from "../api";
import MovieSearch from "../Component/Slide/Search/Movies";
import TvSearch from "../Component/Slide/Search/Tv";

const Wrapper = styled.div`
    background-color: rgba(0, 0, 0, 0.1);
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const MarginiDiv = styled.div`
    margin: 5rem 0 25rem 0;
`;

const Search = () => {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const { data, isLoading } = useQuery<IGetMoviesResult>(
        ["search", "searchLoading"],
        () => {
            return getSearchMovies(keyword || "");
        }
    );

    const { data: tvData, isLoading: tvLoading } = useQuery<IGetTvResult>(
        ["search", "searchLoading"],
        () => {
            return getSearchTv(keyword || "");
        }
    );

    return (
        <Wrapper>
            {isLoading || tvLoading ? (
                <Loader>Loading</Loader>
            ) : (
                <>
                    <MarginiDiv>
                        <MovieSearch search={keyword || ""} />
                    </MarginiDiv>
                    <MarginiDiv>
                        <TvSearch search={keyword || ""} />
                    </MarginiDiv>
                </>
            )}
        </Wrapper>
    );
};

export default Search;
