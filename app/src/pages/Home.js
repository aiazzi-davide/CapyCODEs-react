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

function Home() {
  const [data, setData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState(false);

  function LoadData() {
    fetch(php_url, {
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
    if (window.location.search) {
      setSearch(true);
    } else {
      LoadData();
    }
  }, []);

  return (
    <div>
      <Navbar profile={data.profile} admin={data.admin} />
      {
        search ? (
          <SearchResults />
        ) : (
          isLoaded ? (
            <div>
              <Header />
              <div className="container">
                {data.games.map((game) => (
                  <GameCard game={game} key={game.id} />
                ))}
              </div>
              <Footer />
            </div>
          ) : (
            <Loading />
          )
        )
      }
    </div>
  );

}

export default Home;
