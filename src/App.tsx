import './App.css';
//@ts-ignore
// import csvData from "./assets/input-data-personality-001.csv";
// import csvData from "./assets/input-data-development-001.csv";
import csvData from "./assets/input-data-motives-001.csv";
import {useEffect, useState} from "react";
import {HoganTable} from "./components/HoganTable";
import {Column, parseCsv} from "./components/utils";


function App() {

    const [headers, setHeaders] = useState<string[]>([])
    const [columns, setColumns] = useState<Column[]>([])

    useEffect(() => {
        fetch(csvData)
            .then(response => response.text())
            .then(data => {
                const parsedData = parseCsv(data);
                setHeaders(parsedData.headers)
                setColumns(parsedData.columns)
            });
    }, [])





    return (
        <HoganTable headers={headers} columns={columns}/>);
}

export default App;
