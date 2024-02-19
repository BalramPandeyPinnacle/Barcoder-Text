import React, { useState } from 'react';
import './App.css';
import "./barcode.css";

import Html5QrcodePlugin from './Html5QrcodePlugin.jsx';
import ResultContainerPlugin from './ResultContainerPlugin.jsx';
import PiracyBarcode from './PiracyBarcode.js'; // Import PiracyBarcode component

const App = (props) => {
    const [decodedResults, setDecodedResults] = useState([]);
    const [newData, setNewData] = useState(null);
    const [qrPluginOpen, setQrPluginOpen] = useState(true); // State to track if QR plugin is open

    const onNewScanResult = (decodedText, decodedResult) => {
        console.log("App [result]", decodedResult);
        setDecodedResults(prevResults => [...prevResults, decodedResult]);
    };

    // Function to handle closing the QR plugin
    const closeQrPlugin = () => {
        setQrPluginOpen(false);
    };

    // Function to send data to PiracyBarcode component
    const sendDataToPiracyBarcode = (data) => {
        // Do something with the data, for now, let's just log it
        console.log("Data sent to PiracyBarcode:", data);
        setNewData(data);
    };

    return (
        <div className="App">
             <label className="findbook">
                <h2>Check Multipurpose Unique Code Mentioned on the Book</h2>
            </label>
   
            <section className="App-section">
                {/* Render Html5QrcodePlugin only if qrPluginOpen is true */}
                {qrPluginOpen && (
                    <Html5QrcodePlugin
                        fps={10}
                        qrbox={250}
                        disableFlip={false}
                        qrCodeSuccessCallback={onNewScanResult}
                    />
                )}

                <ResultContainerPlugin
                    results={decodedResults}
                    sendDataToPiracyBarcode={sendDataToPiracyBarcode} // Pass the function to send data
                    closeQrPlugin={closeQrPlugin} // Pass the function to close the QR plugin
                />

                {/* Conditionally render PiracyBarcode component only when newData is not null */}
                {newData && <PiracyBarcode newData={newData} />}

            </section>
        </div>
    );
};

export default App;