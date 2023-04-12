import Papa from 'papaparse';

export const HEADER_HEIGHT = 60 - 10
export const CELL_HEIGHT = 32
export const MINIMUM_GAP = 5
export const HEADER_ROW_WIDTH = 80

type HEX = `#${string}`;

export type Color = {
    background: HEX,
    text: HEX
}

export const colors: Color[] = [
    {
        text: '#FFFFFF',
        background: '#000000'
    }, {
        text: '#FFFFFF',
        background: '#22528E'
    },
    {
        text: '#000000',
        background: '#FEFC8B'
    },
    {
        text: '#FFFFFF',
        background: '#5E8E28'
    },
    {
        text: '#FFFFFF',
        background: '#EA4025'
    },
    {
        text: '#FFFFFF',
        background: '#4C1F8D'
    },
    {
        text: '#FFFFFF',
        background: '#F09A38'
    },
    {
        text: '#FFFFFF',
        background: '#882450'
    },
    {
        text: '#FFFFFF',
        background: '#8B551B'
    },
    {
        text: '#FFFFFF',
        background: '#4294F7'
    },
    {
        text: '#99195E',
        background: '#D5D5D5'
    },
]

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

export function parseCsv(csv) {
    const data = Papa.parse(csv).data;
    let columnData: Column[] = []
    let _headers = []
    for (let i = 0; i < data.length; i++) {
        //ignore name column
        for (let j = 1; j < data[i].length; j++) {
            if (i === 0) {
                columnData.push({
                    data: []
                })
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
        headers: _headers
    }
}
export function processData(column: Cell[]): Cell[] {
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
        }
    }
    return column;
}

export function calculateDistanceFromTop(val, add = 0) {
    return Math.floor((100 - val) * 9.95 + HEADER_HEIGHT + add);
}