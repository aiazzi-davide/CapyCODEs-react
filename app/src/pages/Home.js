import Spacer from "../components/Spacer";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import SearchResults from "../components/SearchResults";
import { useState, useEffect } from "react";
import { php_url } from "../vars";
import "../css/App.css";

function Home() {
  const [data, setData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [triggerCart, setTriggerCart] = useState(false);
  const [triggerError, setTriggerError] = useState(false);

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
      {isLoaded ? (
        <SearchResults data={data} query={query} addToCart={addToCart} triggerError={triggerError} setTriggerError={setTriggerError} />
      ) : (
        <Loading type={'spinner'}/>
      )}
    </div>
  );

}

export default Home;
