import Header from "../components/Header";
import Login from "../components/Login";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import SearchResults from "../components/SearchResults";
import { useState, useEffect } from "react";
import GameCard from "../components/GameCard";
import { php_url } from "../vars";
import "../css/App.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";

function Home() {
  const [data, setData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState("");

  function LoadData(query) {

    fetch(php_url + "?query=" + query, {
      method: "GET",
      credentials: "include", // Include cookies
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log("Success:", data);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }
  useEffect(() => {
    LoadData(query);
  }, [query]);
  
  return (
    <div>
      <Navbar profile={data.profile} admin={data.admin} setQuery={setQuery} />
      {isLoaded ? (
        <SearchResults data={data} query={query} />
      ) : (
        <Loading />
      )}
    </div>
  );

}

export default Home;
