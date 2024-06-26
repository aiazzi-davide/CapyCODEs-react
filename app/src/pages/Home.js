import Spacer from "../components/Spacer";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import SearchResults from "../components/SearchResults";
import { useState, useEffect } from "react";
import { php_url, LoadData} from "../vars";
import "../css/App.css";
import ServerErrorPage from "./errors/ServerErrorPage";
import Pager from "../components/Pager";

function Home() {
  const [data, setData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [triggerCart, setTriggerCart] = useState(false);
  const [triggerError, setTriggerError] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsLoaded(false);
    LoadData(query, page, setData, setIsLoaded, setError);
    console.log('page: ', page);
  }, [query, page]);


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
            : data.message == 'Game not available' ?
              setTriggerError(data.game_id) :
              data.message == 'User not logged in' ?
                window.location.href = '/login' :
                console.log('Error:', data.message);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
  }
  
  return (
    <div>
      <Navbar profile={data.profile} admin={data.admin} setQuery={setQuery} isLoaded={isLoaded} bounce={triggerCart} setBounce={setTriggerCart} />
      <Spacer />
      <SearchResults data={data} query={query} addToCart={addToCart} triggerError={triggerError} setTriggerError={setTriggerError} isLoaded={isLoaded} />
      <Pager page={page} setPage={setPage} />
    </div>
  );

}

export default Home;
