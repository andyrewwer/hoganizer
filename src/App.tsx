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
            if (e.keyCode === 37 && !leftPressed) {
                setLeftPressed(true)
                return
            }
            if (e.keyCode === 39 && !rightPressed) {
                setRightPressed(true)
                return
            }
        }
        document.addEventListener("keydown", _handleKeyDown);
        return () => document.removeEventListener("keydown", _handleKeyDown)
    }, []);

    useEffect(() => {
        if (leftPressed === true) {
            setActive(_active => _active === 0 ? assessments.length - 1 : _active - 1)
            setLeftPressed(false)
        }
    }, [leftPressed])

    useEffect(() => {
        if (rightPressed === true) {
            setActive(_active => _active + 1 >= assessments.length ? 0 : _active + 1)
            setRightPressed(false)
        }
    }, [rightPressed])

    const processAndSplitData = (data) => {
        const parsedData = parseCsv(data)
        let columns = {}
        for (let i = 0; i < parsedData.columns.length; i++) {
            for (let j = 0; j < parsedData.columns[i].data.length; j++) {
                if (i === 0) {
                    columns[parsedData.columns[i].data[j].name] = [parsedData.columns[i].data[j]]
                    continue
                }
                columns[parsedData.columns[i].data[j].name].push(parsedData.columns[i].data[j])
            }
        }
        let individualAssessments: AssessmentResult[] = [];
        for (let key in columns) {
            individualAssessments.push({
                headers: parsedData.headers,
                type: parsedData.type,
                columns: columns[key].map(column => ({
                    data: [column]
                }))
            });
        }
        return [parsedData, ...individualAssessments]
    }

    useEffect(() => {
            fetch(developmentCsvData)
                .then(response => response.text())
                .then(data => {
                    setAssessments(_a => [..._a, ...processAndSplitData(data)])
                })
            fetch(personalityCsvData)
                .then(response => response.text())
                .then(data => {
                    setAssessments(_a => [..._a, ...processAndSplitData(data)])
                })
            fetch(motivesCsvData)
                .then(response => response.text())
                .then(data => {
                    setAssessments(_a => [..._a, ...processAndSplitData(data)])
                })
            //    todo why is this coming up 4/7 in strict mode?
        }, [])
    return (<>
        {assessments.length > 0 &&
            <HoganTable headers={assessments[active]?.headers} columns={assessments[active]?.columns}
                        type={assessments[active]?.type}/>
        }
    </>);
}

export default App;
