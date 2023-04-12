import './App.css';
//@ts-ignore
// import csvData from "./assets/input-data-personality-001.csv";
import csvData from "./assets/input-data-development-001.csv";
// import csvData from "./assets/input-data-motives-001.csv";
import {useEffect, useState} from "react";
import {HoganTable} from "./components/HoganTable";
import {Column, parseCsv} from "./components/utils";

const assessmentTypes = [
    {
        name: 'motives',
        header: 'Recognition',
        background: '#607EA8',
        color: '#FFF'
    },
    {
        name: 'development',
        header: 'Excitable',
        background: '#C14144',
        color: '#FFF'
    },
    {
        name: 'personality',
        header: 'Adjustment',
        background: '#EAB555',
        color: '#000'
    },
]

function App() {

    const [headers, setHeaders] = useState<string[]>([])
    const [columns, setColumns] = useState<Column[]>([])
    const [assessmentType, setAssessmentType] = useState(assessmentTypes[0])

    useEffect(() => {
        fetch(csvData)
            .then(response => response.text())
            .then(data => {
                const parsedData = parseCsv(data);
                setHeaders(parsedData.headers)
                setColumns(parsedData.columns)
                setAssessmentType(assessmentTypes.filter(type => type.header === parsedData.headers[0])[0] || assessmentTypes[0]);
            });
    }, [])

    return (
        <HoganTable headers={headers} columns={columns} assessmentType={assessmentType}/>);
}

export default App;
