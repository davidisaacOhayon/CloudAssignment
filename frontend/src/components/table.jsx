import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Table() {
    const [data, setData] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {

        const getResults = async () => {
            const res = await axios.get("https://backend-dot-davidassignment.nw.r.appspot.com/results/");
            const data = res.data;
            setData(data.distribution);
            setStats({
                smallest: data.smallest,
                biggest: data.biggest
            });
        };

        getResults();
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