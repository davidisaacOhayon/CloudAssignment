 
import { useState, Suspense} from 'react';
import axios from 'axios';
import './App.css';
import Table from './components/table';

function App() {

  const [requested, setRequested] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const [requestCount, setRequestCount] = useState(10000);

  const [workerCount, setWorkerCount] = useState(10);

  const [requestBatch, setRequestBatch] = useState(100);


  const sendGenerateRequest = async () => {
    console.log("Sending multiple requests.")
    let requests = [];
    let workers = [];

    for (let i = 0; i < workerCount; i++) {
      const worker = new Worker(new URL('./components/worker.js', import.meta.url));
      
      const p = new Promise((resolve) => {
        worker.onmessage = (e) => {
          resolve(e.data);
          worker.terminate();
        };
      });


      worker.postMessage({
        url: "https://backend-dot-davidassignment.nw.r.appspot.com/generate/",
        count: requestCount,
        batchSize: Math.floor(requestBatch / workerCount)
      });

      workers.push(worker);
      requests.push(p);
    }


    await Promise.all(requests);
 
  };

  const onClickGenerate = async () => {
    await sendGenerateRequest();
  }

  useEffect(() => {
    if (!requested) {
      return;
    }
    setRefreshKey(prev => prev + 1);
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 2000);
    
    return () => clearInterval(interval);

  }, [requested])

  const displayResults = () => {
    setRequested(true);
      // Forces re-render
    setRefreshKey(prev => prev + 1);

  }

  const automateConfig = (size) => {
      const requestsPerWorker = Math.floor(size / workerCount);
      setRequestCount(requestsPerWorker);
  }
 
  const renderTable = () => {
    return (
      <Suspense fallback={<h1>Loading</h1>}>
        <Table key={refreshKey}/>
      </Suspense>
    )
  }
  return (
    <section className={"main-content"}>
      <h2 style={{fontSize:"2rem"}}>Random Number Generation amongst services.</h2>
      <div className={"request-config"}>
        <label for={"requests"}>Number of Requests per worker</label>
        <input className={"config-input"} type={"Number"} name={"requests"} default={10000}  onChange={(e) => setRequestCount(e.target.value)}></input>
         <label for={"requests"}>Number of Workers</label>
        <input className={"config-input"} type={"Number"} name={"workers"} default={10000}  onChange={(e) => setWorkerCount(e.target.value)}></input>
         <label for={"requests"}>Batch Size of Requests for workers</label>
        <input className={"config-input"} type={"Number"} name={"requests"} default={1}  onChange={(e) => setRequestBatch(e.target.value)}></input>
        <label for={"requests"}>Number of Total Requests - Automated</label>
        <input className={"config-input"} type={"Number"} name={"total-requests"} default={10000}  onChange={(e) => automateConfig(e.target.value)}></input>
      
      </div>

      <h3>Current Number of Request Iterations: {requestCount}</h3>
      <h3>Current Number of Workers: {workerCount}</h3>
      <h3>Current size of request batches: {requestBatch}</h3>
      <button className={"ui-btn"} onClick={() => onClickGenerate()}>Generate</button>

    <button className={"ui-btn"} onClick={() => displayResults()}>Display Records</button>

      {requested && renderTable()}

    </section>
  );
}

export default App;
