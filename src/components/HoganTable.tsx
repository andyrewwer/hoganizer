import {CELL_HEIGHT, HEADER_HEIGHT, HEADER_ROW_WIDTH} from "./utils";

export const HoganTable = ({headers, columns}) => {

    function getColumnWidth() {
        console.log(Math.floor((1920 - HEADER_ROW_WIDTH) / columns.length))
        return Math.floor((1920 - HEADER_ROW_WIDTH) / columns.length);
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
                    {headers.map(val =>
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
                    {headers.map(val => <td key={val}></td>)}
                </tr>
                <tr>
                    <td> AVE</td>
                    {headers.map(val => <td key={val}></td>)}
                </tr>
                <tr>
                    <td> LOW</td>
                    {headers.map(val => <td key={val}></td>)}
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