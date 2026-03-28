 
import { useState, Suspense} from 'react';
import './App.css';
import Table from './components/table';

function App() {

  const [request, setRequested] = useState(false);


  const renderTable = () => {
    return (
      <Suspense fallback={<h1>Loading</h1>}>
        <Table/>
      </Suspense>
    )
  }
  return (
    <section className={"main-content"}>
      <h2 style={{fontSize:"2rem"}}>Random Number Generation amongst services.</h2>

      <button className={"ui-btn"}>Generate</button>

      {renderTable()}

    </section>
  );
}

export default App;
