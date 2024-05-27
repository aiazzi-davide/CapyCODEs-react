import Spacer from "../components/Spacer";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import SearchResults from "../components/SearchResults";
import { useState, useEffect } from "react";
import { php_url, LoadData} from "../vars";
import "../css/App.css";
import ServerErrorPage from "./errors/ServerErrorPage";

function Home() {
  const [data, setData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [triggerCart, setTriggerCart] = useState(false);
  const [triggerError, setTriggerError] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    LoadData(query, setData, setIsLoaded, setError);
  }, [query]);


  if (error) {
    return <ServerErrorPage />;
  }

  const addToCart = (e, game_id) => {
    e.stopPropagation();

    fetch(php_url + "/cart/add/" + game_id, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })
    .then((response) => response.json())
        .then((data) => {
        console.log("Success:", data);
          data.status == 200 ?
            setTriggerCart(!triggerCart)
            : setTriggerError(data.game_id);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
  }
  
  return (
    <div>
      <Navbar profile={data.profile} admin={data.admin} setQuery={setQuery} isLoaded={isLoaded} bounce={triggerCart} setBounce={setTriggerCart} />
      <Spacer />
      <SearchResults data={data} query={query} addToCart={addToCart} triggerError={triggerError} setTriggerError={setTriggerError} isLoaded = {isLoaded}/>
    </div>
  );

}

export default Home;
