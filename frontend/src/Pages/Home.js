import React, { useState, useEffect } from "react";
import axios from "axios";
import CurrencyButton from "../Components/CurrencyButton";
import TimeCurrencyCard from "../Components/TimeCurrencyCard";
import styles from "./Home.module.css"

function Home() {
  // ToDo 10.3.1
  /* set variables (data, shown data, currency) using hooks (useState) */
  const [chosenCurrency, setChosenCurrency] = useState('USD');
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);

  // ToDo 10.3.2
  /* 
  set function to call backend (axios) and update bitcoin data using state setter
  use JSON.parse to parse response data 
  Hint: with axios use .get(url of backend) .then(response =>{ do something with response}) refrence https://axios-http.com/docs/example
  */
  const updateData = () => {
    axios.get("http://localhost:8000/get_bitcoin_prices").then((res) => {
      setData(JSON.parse(res.data));
      console.log(JSON.parse(res.data))
    })
  }

  // update data on initialization (useEffect [], no dependencies)
  useEffect(() => {
    updateData();
  }, [])

  // ToDo 10.3.3
  // useEffect reference https://reactjs.org/docs/hooks-effect.html
  /* update data every 5 minutes (useEffect [data] as the dependency & setTimeout call updateData) 
    setTimeout refrence https://developer.mozilla.org/en-US/docs/Web/API/setTimeout
  */
  useEffect(() => {
    setTimeout(() => {
      updateData();
    }, 300000)
  }, [data]);

  useEffect(() => {
    let coef = 85
    if (chosenCurrency === "USD") {
      coef = 1;
    }
    let currShowData = data.map(el => ({ ...el, price: parseFloat((el.price * coef).toFixed(4)) }))
    currShowData.sort((a, b) => { return (new Date(b.timestamp) - new Date(a.timestamp)) })
    // parse data - change currency - sort?
    setShowData(currShowData);
  }, [data, chosenCurrency])


  const changeCurrency = (currency) => {
    setChosenCurrency(currency);
  };

  // 10.3.5
  return (
    <div>
      {/* Other components and content */}
      <CurrencyButton currency={chosenCurrency} changeCurrency={changeCurrency} />
      {/* Other components and content */}
      <TimeCurrencyCard currency={chosenCurrency} showData={showData} />
    </div>
  );

}

export default Home;