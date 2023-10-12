import React, { useState, useEffect } from "react";
import "./style.css";

const StockMarketData = () => {
  const [data, setData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const daysToShow = 7;

  useEffect(() => {
    // Fetch market data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://f68370a9-1a80-4b78-b83c-8cb61539ecd6.mock.pstmn.io/api/v1/get_market_data"
        );
        const result = await response.json();
        setData(result.data); // Assuming the API returns an array of market data
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to display 7 days of data at a time
  const getVisibleData = () => {
    return data.slice(startIndex, startIndex + daysToShow);
  };

  const visibleData = getVisibleData();

  // Function to determine the row color based on the conditions and returns classname according to that
  const getTableRowColor = (index, item) => {
    let cls = "";
    if (item.close > item.open) {
      cls += " green-close";
    } else if (item.close < item.open) {
      cls += " red-close";
    }
    if (index !== visibleData.length - 1) {
      if (item.open > visibleData[index + 1].close) {
        cls += " green-open";
      } else if (item.open < visibleData[index + 1].close) {
        cls += " red-open";
      }
    }
    return cls;
  };

  const handleNext = () => {
    setStartIndex(startIndex + daysToShow);
  };

  const handlePrev = () => {
    setStartIndex(startIndex - daysToShow);
  };

  return (
    <main className="container">
      <section className="table-header">
        <h1>Stock Market Data</h1>
      </section>
      <section className="table-body">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Date</th>
              <th>Opening Price</th>
              <th>Closing Price</th>
            </tr>
          </thead>
          <tbody>
            {visibleData.map((item, index) => (
              <tr key={index} className={getTableRowColor(index, item)}>
                <td>{index + startIndex + 1}</td>
                <td>{item.date.slice(0, 10)}</td>
                <td className="open">{item.open}</td>
                <td className="close">{item.close}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div className="buttons">
        <button onClick={handlePrev} disabled={startIndex === 0}>
          Prev
        </button>
        <button
          onClick={handleNext}
          disabled={startIndex + daysToShow >= data.length}
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default StockMarketData;
