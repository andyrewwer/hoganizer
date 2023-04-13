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
    const [leftPressed, setLeftPressed] = useState(false)
    const [rightPressed, setRightPressed] = useState(false)
    const [active, setActive] = useState(0)

    useEffect(() => {
        const _handleKeyDown = (e) => {
            if (e.keyCode === 37) {
                setLeftPressed(true)
                return
            } if (e.keyCode === 39) {
                setRightPressed(true)
            }
        }
        document.addEventListener("keydown", _handleKeyDown);
        return () => document.removeEventListener("keydown", _handleKeyDown)
    },[]);

    useEffect(() => {
        if (leftPressed === true ) {
            setActive(_active => _active === 0 ? assessments.length - 1 : _active - 1)
            setLeftPressed(false)
        }
    }, [leftPressed])

    useEffect(() => {
        if (rightPressed === true ) {
            setActive(_active => _active + 1 >= assessments.length ? 0 : _active + 1)
            setRightPressed(false)
        }
    }, [rightPressed])

    useEffect(() => {
        fetch(developmentCsvData)
            .then(response => response.text())
            .then(data => {
                const parsedData = parseCsv(data)
                setAssessments(_a => [..._a, parsedData])
            })
        fetch(personalityCsvData)
            .then(response => response.text())
            .then(data => {
                const parsedData = parseCsv(data)
                setAssessments(_a => [..._a, parsedData])
            })
        fetch(motivesCsvData)
            .then(response => response.text())
            .then(data => {
                const parsedData = parseCsv(data)
                setAssessments(_a => [..._a, parsedData])
            })
        //    todo why is this coming up 4/7 in strict mode?
    }, [])

    console.log('assessments', assessments)
    return (<>
        {assessments.length > 0 &&
            <HoganTable headers={assessments[active]?.headers} columns={assessments[active]?.columns}
                        type={assessments[active]?.type}/>
        }
    </>);
}

export default App;
