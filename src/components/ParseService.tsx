import Papa from 'papaparse';
import {calculateDistanceFromTop, CELL_HEIGHT, Color, colors, MINIMUM_GAP} from "./utils";

export type Column = {
    data: Cell[]
}

export type Cell = {
    name: string,
    color: Color,
    hogan_score: number,
    calculated_score: number,
    top: number
}

type Label = {
    label: string,
    height: number
}

export type AssessmentType = {
    name: string,
    header: string,
    labels: Label[],
    color: Color
}

export const assessmentTypes: AssessmentType[] = [
    {
        name: 'motives',
        header: 'Recognition',
        labels: [{
            label: "HIGH",
            height: 35
        }, {
            label: "AVE",
            height: 30
        }, {
            label: "LOW",
            height: 35
        }],
        color: {
            background: '#607EA8',
            text: '#FFF'
        }
    },
    {
        name: 'development',
        header: 'Excitable',
        labels: [{
            label: "HIGH RISK",
            height: 10
        }, {
            label: "MOD RISK",
            height: 20
        }, {
            label: "LOW RISK",
            height: 30
        }, {
            label: "NO RISK",
            height: 40
        }],
        color: {
            background: '#C14144',
            text: '#FFF'

        },
    },
    {
        name: 'personality',
        header: 'Adjustment',
        labels: [{
            label: "HIGH",
            height: 35
        }, {
            label: "AVE",
            height: 30
        }, {
            label: "LOW",
            height: 35
        }],        color: {
            background: '#EAB555',
            text: '#000'

        },
    },
]

export type AssessmentResult = {
    headers: string[],
    columns: Column[],
    type: AssessmentType
}

export function parseCsv(csv): AssessmentResult {
    const data = Papa.parse(csv).data;
    let columnData: Column[] = []
    let _headers = []
    let type: AssessmentType = assessmentTypes[0];

    for (let i = 0; i < data.length; i++) {
        //ignore name column
        for (let j = 1; j < data[i].length; j++) {
            if (i === 0) {
                columnData.push({
                    data: []
                })
                if (j === 1) {
                    type = assessmentTypes.filter(type => type.header === data[i][j])[0] || assessmentTypes[0]
                }
                _headers.push(data[i][j])
                continue
            }
            columnData[j - 1].data.push({
                name: data[i][0],
                color: colors[(i-1) % colors.length],
                hogan_score: data[i][j],
                calculated_score: calculateDistanceFromTop(data[i][j]),
                top: calculateDistanceFromTop(data[i][j]),
            })
        }
    }
    let _columns = []

    for (let i = 0; i < columnData.length; i++) {
        const response = processData(columnData[i].data)
        _columns.push({
            data: response
        })
    }
    console.log('columns', _columns)
    return {
        columns: _columns,
        headers: _headers,
        type: type
    }
}
export function processData(column: Cell[]): Cell[] {
    column = processDuplicates(column)
    column = column.sort((a, b) => a.top > b.top ? 1 : -1)
    column = processTooClose(column)
    // todo 3 - compare across columns [STRETCH GOAL]
    return column;
}

function processDuplicates(column: Cell[]): Cell[] {
    const duplicates = column.reduce((result, row) => {
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
        //even = split difference (around middle); if odd one will be on true value
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
    for (let i = 0; i < column.length - 1; i++) {
        let minimum_gap = column[i].hogan_score === column[i + 1].hogan_score ? 0 : MINIMUM_GAP;
        const PUSH_AMOUNT = CELL_HEIGHT + minimum_gap
        let top = column[i].top
        let nextTop = column[i + 1].top
        const diff = nextTop - top;
        if (diff < PUSH_AMOUNT || top > nextTop) {
            // assumes all pushing down. Lets think about up and down later
            const newNextTop = top + PUSH_AMOUNT

            column[i + 1] = {
                ...column[i + 1],
                top: newNextTop
            }
        }
    }
    return column;
}