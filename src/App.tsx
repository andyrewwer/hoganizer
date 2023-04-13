import './App.css';
//@ts-ignore
import personalityCsvData from "./assets/input-data-personality-001.csv";
//@ts-ignore
import developmentCsvData from "./assets/input-data-development-001.csv";
//@ts-ignore
import motivesCsvData from "./assets/input-data-motives-001.csv";
import {useEffect, useState} from "react";
import {HoganTable} from "./components/HoganTable";
import {AssessmentResult, parseCsv} from "./components/ParseService";

function App() {

    const [assessments, setAssessments] = useState<AssessmentResult[]>([])

    useEffect(() => {
        fetch(developmentCsvData)
            .then(response => response.text())
            .then(data => {
                const parsedData = parseCsv(data)
                setAssessments([parsedData])
                // setAssessments(_assessments => {
                //     _assessments.splice(0,0, parsedData);
                //     console.log('_assessments', _assessments)
                //     return _assessments;
                // })
                // todo multiple assessments
            })
    }, [])

    return (<>
        <HoganTable headers={assessments[0]?.headers} columns={assessments[0]?.columns} type={assessments[0]?.type}/>
    </>);
}

export default App;
