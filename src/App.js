import './App.css';
import Papa from 'papaparse';
import csvData from './assets/input-data-002.csv';

function App() {

    const WINDOW_HEIGHT = 1080
    const HEADER_HEIGHT = 60
    const CELL_HEIGHT = 32
    const MINIMUM_GAP = 2

    fetch(csvData)
        .then(response => response.text())
        .then(data => {
            parseCsv(data);
        });

    function parseCsv(csv) {
        const data = Papa.parse(csv).data;
        let columnData = []
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (i === 0) {
                    columnData.push({
                        header: data[i][j],
                        data: []
                    })
                    continue
                }
                columnData[j].data.push({
                    name: data[i][0],
                    raw: data[i][j]
                })
            }
        }
        for (let i = 1; i < columnData.length; i++ ) {
            const response = process(columnData[i].data)
            console.log(`processed ***${columnData[i].header}***`, response)
        }
    }

    function process(column) {
        let output = []
        for (let i = 0; i < column.length; i++) {
            output.push({
                name: column[i].name,
                raw: column[i].raw,
                initial_score: calculateScore(column[i].raw),
                score: calculateScore(column[i].raw)
            })
        }
        output = processDuplicates(output)
        output = output.sort((a,b) => a.score > b.score ? 1 : -1)
        output = processTooClose(output)
        // 3 - they aren't close enough across columns [STRETCH GOAL]
        return output;
    }

    function processDuplicates(column) {
        const duplicates = column.reduce((result, row) => {
            // If the row already exists in the result object, increment the count
            if (result[row.score]) {
                result[row.score].count++;
                result[row.score].data.push(row);
            } else {
                result[row.score] = {
                    count: 1,
                    data: [row]
                };
            }

            return result;
        }, {});

        let response = []
        for (let score in duplicates) {
            let count = duplicates[score].count;
            if (count === 1) {
                response.push(...duplicates[score].data)
                continue
            }
            //if even offset half the height around middle. If odd, one will be on "true" value
            let offset = count % 2 === 0 ? CELL_HEIGHT / 2 : 0;
            for (let i = 0; i < duplicates[score].data.length; i++) {
                let add = offset + (i - Math.floor(count/2)) * CELL_HEIGHT;
                let _score = calculateScore(duplicates[score].data[i].raw, add);
                response.push({
                    ...duplicates[score].data[i],
                    score: _score
                })
            }
        }
        return response
    }

    function processTooClose(column) {
        let modified = false;

        for (let i = 0; i < column.length - 1; i++) {
            let score = column[i].score
            let nextScore = column[i + 1].score
            const diff = nextScore - score;
            if (diff < CELL_HEIGHT + MINIMUM_GAP) {
                const newValue = nextScore - CELL_HEIGHT - MINIMUM_GAP;

                // instead of pushing down, push up
                if (newValue < HEADER_HEIGHT) {
                    column[i + 1] = {
                        ...column[i+1],
                        score: score + CELL_HEIGHT + MINIMUM_GAP
                    }
                    modified = true;
                } else {
                    // Otherwise, update the value
                    column[i] = {
                        ...column[i],
                        score: newValue
                    };
                    modified = true;
                }
            }
        }

        if (modified) {
            // Recursively call the function to adjust the numbers again
            return processTooClose(column);
        } else {
            // Return the adjusted numbers if no changes were made
            return column;
        }
    }

    function calculateScore(val, add = 0) {
        return Math.floor((100 - val) * 9.8 + HEADER_HEIGHT + add);
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>look at the console! (F12 on most browsers) </h1>
            </header>
        </div>
    );
}

export default App;
