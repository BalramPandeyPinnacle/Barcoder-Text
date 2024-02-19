import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./piracy.css";

const PiracyBarcode = ({ newData }) => {
  const [data, setData] = useState([]);
  const [dataa, setDataa] = useState([]);
  const [searchBarcode, setSearchBarcode] = useState("");
  const [foundBarcode, setFoundBarcode] = useState(null);
  const [barcodeCount, setBarcodeCount] = useState(null);
  const [submittedBarcode, setSubmittedBarcode] = useState("");
  const [displayedDorderid, setDisplayedDorderid] = useState("");
  const [searchBarcode1, setSearchBarcode1] = useState(""); // Add setSearchBarcode1 to state

  useEffect(() => {
    Axios.get("https://nodei.ssccglpinnacle.com/getship").then((response) => {
      const reversedData = response.data.reverse();
      setData(reversedData);
    });

    Axios.get("https://nodei.ssccglpinnacle.com/getApproveDPO").then(
      (response) => {
        const reversedData = response.data.reverse();
        setDataa(reversedData);
      }
    );
  }, []);

  useEffect(() => {
    // Auto search when newData is updated
    if (newData) {
      setSearchBarcode(newData);
    }
  }, [newData]);

  const postBarcodeToMongoDB = async () => {
    try {
      await Axios.post("https://nodei.ssccglpinnacle.com/barcodeadd", {
        barcode: searchBarcode,
      });
      console.log("Barcode posted to MongoDB successfully.");
    } catch (error) {
      console.error("Error posting barcode to MongoDB:", error);
    }
  };

  const getCountFromAPI = async (barcode) => {
    try {
      const response = await Axios.post(
        "https://nodei.ssccglpinnacle.com/count",
        {
          barcode,
        }
      );
      setBarcodeCount(response.data.count);
    } catch (error) {
      console.error("Error getting barcode count:", error);
    }
  };

  const handleSearch = async () => {
    try {
      // Trim whitespace from the searchBarcode
      const trimmedBarcode = searchBarcode.trim();
  
      // Check if the searchBarcode is empty
      if (trimmedBarcode === "") {
        alert("Please enter a barcode before submitting.");
        return;
      }
  
      let found = false;
      let orderNum = null;
  
      // Check if the barcode contains '-'
      if (!trimmedBarcode.includes("-")) {
        // Retrieve the key associated with the barcode from an API
        const response1 = await Axios.get(
          `https://nodei.ssccglpinnacle.com/getKey/${trimmedBarcode}`
        );
        const currentSearchBarcode1 = response1.data.key;
        setSearchBarcode1(currentSearchBarcode1);
  
        // Iterate through the data to find a match for the barcode
        data.forEach((item) => {
          if (item.barcodeData) {
            item.barcodeData.forEach((barcode) => {
              if (
                barcode.scannedData &&
                barcode.scannedData.includes(currentSearchBarcode1)
              ) {
                found = true;
                orderNum = barcode.OrderNum;
                return;
              }
            });
          }
        });
  
        // Set the foundBarcode state based on whether the barcode is found or not
        setFoundBarcode(
          found
            ? "verified"
            : "This book does not belong to Pinnacle so this is a duplicate book."
        );
        setSubmittedBarcode(trimmedBarcode);
        setSearchBarcode("");
  
        if (found) {
          // Post the barcode to MongoDB
          await postBarcodeToMongoDB();
  
          // Check if there is a matching order in the dataa array
          const matchingOrder = dataa.find(
            (order) => order.shipmentid === orderNum
          );
  
          // Set the displayedDorderid state based on whether a matching order is found or not
          setDisplayedDorderid(matchingOrder ? matchingOrder.Dorderid : "");
        } else {
          setDisplayedDorderid(""); // Set to an empty string if the barcode is not found
        }
  
        // Get the count for the barcode from an API
        await getCountFromAPI(trimmedBarcode);
      } else {
        // Handle barcodes containing '-'
        // Add your logic here
      }
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };
  
  

  return (
    <div className="piracybarcode">
     
      <br />

      <input
        type="text"
        value={searchBarcode}
        onChange={(e) => setSearchBarcode(e.target.value)}
      />
      <br />

      <button className="search-button" onClick={handleSearch}>
        Search
      </button>

      {submittedBarcode && <p>Submitted Barcode: {submittedBarcode}</p>}

      <label
        className={`verified ${foundBarcode === "verified" ? "green" : "red"}`}
      >
        {foundBarcode && (
          <p
            style={{
              color: foundBarcode.includes(
                "This book does not belong to Pinnacle so this is a duplicate book."
              )
                ? "red"
                : "inherit",
            }}
          >
            {foundBarcode}
          </p>
        )}
      </label>

      {barcodeCount !== null && (
        <p id="pira">{`Barcode verified ${barcodeCount} time(s).`}</p>
      )}
      {barcodeCount > 2 && (
        <h4 style={{ color: "red", marginLeft: "40rem" }}>
          {" "}
          so it is Doubtful
        </h4>
      )}
      {displayedDorderid && (
        <p id="distri">Distributor : {displayedDorderid}</p>
      )}
    </div>
  );
};

export default PiracyBarcode;