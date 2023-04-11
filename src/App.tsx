import './App.css';
import Papa from 'papaparse';
//@ts-ignore
// import csvData from "./assets/input-data-personality-001.csv";
// import csvData from "./assets/input-data-development-001.csv";
import csvData from "./assets/input-data-motives-001.csv";
import {useEffect, useState} from "react";

type Column = {
    data: Cell[]
}

type Cell = {
    name: string,
    hogan_score: number,
    calculated_score: number,
    top: number
}

function App() {

    const [header, setHeader] = useState([])
    const [columns, setColumns] = useState<Column[]>([])

    const HEADER_HEIGHT = 60 - 10
    const CELL_HEIGHT = 32
    const MINIMUM_GAP = 5
    const HEADER_ROW_WIDTH = 80

    useEffect(() => {
        fetch(csvData)
            .then(response => response.text())
            .then(data => {
                parseCsv(data);
            });
    }, [])

    function parseCsv(csv) {
        const data = Papa.parse(csv).data;
        let columnData: Column[] = []
        let _header = []
        for (let i = 0; i < data.length; i++) {
            for (let j = 1; j < data[i].length; j++) {
                if (i === 0) {
                    columnData.push({
                        data: []
                    })
                    //ignore name column
                    _header.push(data[i][j])
                    continue
                }
                columnData[j - 1].data.push({
                    name: data[i][0],
                    hogan_score: data[i][j],
                    calculated_score: calculateDistanceFromTop(data[i][j]),
                    top: calculateDistanceFromTop(data[i][j]),
                })
            }
        }
        let _columns = []

        for (let i = 0; i < columnData.length; i++) {
            const response = process(columnData[i].data)
            _columns.push({
                data: response
            })
        }
        console.log('columns', _columns)
        setColumns(_columns);
        setHeader(_header)
    }

    function process(column: Cell[]): Cell[] {
        column = processDuplicates(column)
        column = column.sort((a, b) => a.top > b.top ? 1 : -1)
        column = processTooClose(column)
        // todo 3 - they aren't close enough across columns [STRETCH GOAL]
        return column;
    }

    function processDuplicates(column: Cell[]): Cell[] {
        const duplicates = column.reduce((result, row) => {
            // If the row already exists in the result object, increment the count
            if (result[row.hogan_score]) {
                result[row.hogan_score].count++;
                result[row.hogan_score].data.push(row);
            } else {
                result[row.hogan_score] = {
                    count: 1, data: [row]
                };
            }

            return result;
        }, {});

        let response: Cell[] = []
        for (let hogan_score in duplicates) {
            let count = duplicates[hogan_score].count;
            if (count === 1) {
                response.push(...duplicates[hogan_score].data)
                continue
            }
            //if even offset half the height around middle. If odd, one will be on "true" value
            let offset = count % 2 === 0 ? CELL_HEIGHT / 2 : 0;
            for (let i = 0; i < duplicates[hogan_score].data.length; i++) {
                let cell: Cell = duplicates[hogan_score].data[i]
                let add = offset + (i - Math.floor(count / 2)) * CELL_HEIGHT;
                response.push({
                    ...duplicates[hogan_score].data[i],
                    top: calculateDistanceFromTop(cell.hogan_score, add)
                })
            }
        }
        return response
    }

    function processTooClose(column: Cell[]): Cell[] {
        let modified = false;
        for (let i = 0; i < column.length - 1; i++) {
            let minimum_gap = column[i].hogan_score === column[i + 1].hogan_score ? 0 : MINIMUM_GAP;
            const PUSH_AMOUNT = CELL_HEIGHT + minimum_gap
            let top = column[i].top
            let nextTop = column[i + 1].top
            const diff = nextTop - top;
            if (diff < CELL_HEIGHT + minimum_gap || top > nextTop) {
                // assumes all pushing down. Lets think about up and down later
                const newNextTop = top + PUSH_AMOUNT

                column[i + 1] = {
                    ...column[i + 1],
                    top: newNextTop
                }
                modified = true;
            }
        }
        return column;
    }

    function getColumnWidth() {
        console.log(Math.floor((1920 - HEADER_ROW_WIDTH) / columns.length))
        return Math.floor((1920 - HEADER_ROW_WIDTH) / columns.length);
    }

    function calculateDistanceFromTop(val, add = 0) {
        return Math.floor((100 - val) * 9.8 + HEADER_HEIGHT + add);
    }

    function calcLeft(index: number) {
        let columnWidth = getColumnWidth();
        return HEADER_ROW_WIDTH + Math.floor((columnWidth - 150) / 2) + columnWidth * index
    }

    return (
        <>
            <table className="container" cellSpacing="0">
                <thead style={{height: HEADER_HEIGHT + 10}}>
                <tr>
                    <th style={{width: `${HEADER_ROW_WIDTH}px`}}></th>
                    {header.map(val =>
                        <th key={val} style={{
                            width: `${getColumnWidth()}px`,
                            maxWidth: `${getColumnWidth()}px`
                        }}>{val}</th>
                    )}
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td> HIGH</td>
                    {header.map(val => <td key={val}></td>)}
                </tr>
                <tr>
                    <td> AVE</td>
                    {header.map(val => <td key={val}></td>)}
                </tr>
                <tr>
                    <td> LOW</td>
                    {header.map(val => <td key={val}></td>)}
                </tr>
                </tbody>
            </table>
            {columns.map((col, index) => col.data.map(cell => <div className="cell" key={cell.name}
                                                                   style={{
                                                                       top: cell.top,
                                                                       left: `${calcLeft(index)}px`,
                                                                       height: CELL_HEIGHT,
                                                                       background: index % 2 === 0 ? '#164E86' : '#BADA55',
                                                                       color: '#FFF'
                                                                   }}>
                {cell.name.split(' ')[0]} {cell.hogan_score}
            </div>))}
        </>);
}

export default App;
