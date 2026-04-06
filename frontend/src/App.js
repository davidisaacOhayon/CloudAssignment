 
import { useState, Suspense} from 'react';
import './App.css';
import Table from './components/table';

function App() {

  const [requested, setRequested] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0)

  const onClickGenerate = () => {
    setRequested(true);
    setRefreshKey(refreshKey + 1); // Forces re-render
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

      <button className={"ui-btn"} onClick={() => onClickGenerate()}>Generate</button>

      {requested && renderTable()}

    </section>
  );
}

export default App;
