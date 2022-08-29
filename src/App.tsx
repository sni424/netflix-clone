import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Tv from "./pages/Tv";
import Search from "./pages/Search";
import Header from "./Component/Header";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="movies/:category/:movieId" element={<Home />} />
                <Route path="tv" element={<Tv />}>
                    <Route path=":category/:tvId" element={<Tv />} />
                </Route>
                <Route path="search" element={<Search />} />
            </Routes>
        </>
    );
}

export default App;
