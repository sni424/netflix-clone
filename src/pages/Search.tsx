import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

const Search = () => {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");

    return (
        <div>
            <h1>Search</h1>
        </div>
    );
};

export default Search;
