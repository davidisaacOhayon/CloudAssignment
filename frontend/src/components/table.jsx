import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Table() {
    // Main Data from results endpoint
    const [data, setData] = useState(null);

    // Skimmed data
    const [stats, setStats] = useState(null);

    // Retrieve backend URL from .env
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    // Runs upon rendering
    useEffect(() => {

        let fetching = false


        const getResults = async () => {
            
            // Used to prevent overlapping fetch requests
            if (fetching) {
                return; 
            }
            // Set currently fetching to true
            fetching = true;
            try {
                // Send request for results
                const res = await axios.get(`${backendUrl}/results/`);

                // Skim data
                const data = res.data;

                setData(data.distribution);

                setStats({
                    smallest: data.smallest,
                    biggest: data.biggest
                });
            } catch (err) {
                console.log(err);
            } finally {
                fetching = false;
            }

        };

        // Send results request every 2 seconds
        // This is to have persistant updates on the database on whats been
        // generated
        const interval = setInterval(
            getResults
        , 2000)

        return () => clearInterval(interval);

        
    }, []);

    const renderData = () => {
        if (!data || !stats) return null;

        return (
            <table className={"results-table"}>
                <thead>
                    <tr>
                        <td>Instance</td>
                        <td>Version</td>
                        <td>Total Numbers</td>
                        <td>Largest Number</td>
                        <td>Smallest Number</td>
                        <td>Start Time ISO</td>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.instance}</td>
                            <td>{row.version}</td>
                            <td>{row.total}</td>
                            <td>{row.maximum}</td>
                            <td>{row.minimum}</td>
                            <td>{row.start_time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <>
            {stats && (
                <div>
                    <p>Global Largest: {stats.biggest.number} ({stats.biggest.instance})</p>
                    <p>Global Smallest: {stats.smallest.number} ({stats.smallest.instance})</p>
                </div>
            )}
            {data && renderData()}
        </>
    );
}