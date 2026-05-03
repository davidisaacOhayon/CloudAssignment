/* eslint-disable no-restricted-globals */
/* eslint-env worker */

const delay = (ms) => new Promise(res => setTimeout(res, ms));

self.onmessage = async (e) => {
  const { url, count, batchSize } = e.data;

  // Request Iteration
  for (let i = 0; i < count; i += batchSize) {

    const batch = [];
    // Batch requests
    for ( let x = 0; x < batchSize; x++) {
      batch.push(fetch(url, {
            method: "POST", body: JSON.stringify({
          }
      )}));
    }

    await Promise.all(batch);
    
  }

  self.postMessage("done");
};