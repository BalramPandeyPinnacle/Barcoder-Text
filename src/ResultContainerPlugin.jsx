import React from 'react';

// Function to filter results and return only the first element
function filterResults(results) {
  return results.length > 0 ? [results[0]] : []; // Return the first element if available, otherwise return an empty array
}

const ResultContainerPlugin = ({ results, sendDataToPiracyBarcode, closeQrPlugin }) => {
  const filteredResults = filterResults(results);

  // If there are results, send the first result to PiracyBarcode component and close the QR plugin
  if (filteredResults.length > 0) {
    sendDataToPiracyBarcode(filteredResults[0].decodedText);
    closeQrPlugin(); // Close the QR plugin
  }

  return (
    <div className='Result-container'>
      <div className='Result-section'>
        {filteredResults.map((result, index) => (
          <div key={index}>
            {/* <p>{result.decodedText}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultContainerPlugin;