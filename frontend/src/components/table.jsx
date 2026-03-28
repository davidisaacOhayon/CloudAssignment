import axios from 'axios';
import {useState, useEffect} from 'react';





export default function Table(){



    const [data, setData] = useState(null);

    useEffect(() => { 

        const loadData = async () => {
            const res = await axios.get("/generate/?batched=true");
            const data = res.data;

            setData(data);
        }

        loadData();
    }, [])


    const renderData = () => {
        return(
            <table>
                <th>
                    <td>
                        Instance Name
                    </td>
                    <td>
                        Instance Version
                    </td>
                    <td>
                        Numbers Generated
                    </td>
                    <td>
                        Largest Number
                    </td>
                    <td>
                        Smallest Number
                    </td>
                </th>
            </table>
        )
    }

    return(
        data && renderData()
    )
}