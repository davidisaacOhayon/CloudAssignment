import axios from 'axios';
import {useState, useEffect} from 'react';





export default function Table(){



    const [data, setData] = useState(null);

    useEffect(() => { 

        const sendGenerateRequest = async () => {
            await axios.get("/generate/");    
        }

        const getResults = async () => {
            const res = await axios.get("https://backend-dot-davidassignment.nw.r.appspot.com/results/");
            const data = res.data;
            console.log(`Retrieved data ${data}`)
            setData(data);
        }

        sendGenerateRequest();
        getResults();

    }, [])


    const renderData = () => {

        if (data == null){
            return;
        }
        return(
            <table>
                <th>
                    <td>
                        Instance 
                    </td>
                    <td>
                        Instance Version
                    </td>
                    <td>
                        Number Generated
                    </td>
                    <td>
                        Largest Number
                    </td>
                    <td>
                        Smallest Number
                    </td>
                </th>
                {Object.entries(data).map(obj => { 
                    return(
                        <tr>
                            <td>{obj["instance"]}</td>
                            <td>{obj["version"]}</td>
                            <td>{obj["number"]}</td>
                            <td></td>
                            <td></td>
                        </tr>

                    )
                })}
            </table>
        )
    }

    return(
        data && renderData()
    )
}