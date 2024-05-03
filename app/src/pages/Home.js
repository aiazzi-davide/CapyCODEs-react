import Header from "../components/Header";
import Login from "../components/Login";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import GameCard from "../components/GameCard";
import { php_url } from "../vars";
import "../css/App.css";

function Home() {
  const [data, setData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

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
    LoadData();
  }, []);

  return isLoaded ? (
    <div>
      <Login profile={data.profile} admin={data.admin} />
      <div className="container">
        {data.games.map((game) => (
          
          <GameCard key={game.id} game={game} />
        ))
        }
      </div>
    </div>
  ) : (
    <h1>Loading...</h1>
  );
}

export default Home;
