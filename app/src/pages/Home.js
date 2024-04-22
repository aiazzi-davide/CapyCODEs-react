import Header from "../components/Header";
import Login from "../components/Login";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";

function Home() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch("http://localhost:81/", {
      method: "GET",
      credentials: "include", // Include cookies
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log("Success:", data);
        console.log(data.profile);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);
  return (
    <div>
      <Login profile={data.profile} />
    </div>
  );
}

export default Home;
