import {CELL_HEIGHT, HEADER_HEIGHT, HEADER_ROW_WIDTH} from "./utils";

export const HoganTable = ({headers, columns, assessmentType}) => {

    function getColumnWidth() {
        return Math.floor((1920 - HEADER_ROW_WIDTH) / columns.length);
    }

    function calcLeft(index: number) {
        let columnWidth = getColumnWidth();
        return HEADER_ROW_WIDTH + Math.floor((columnWidth - 150) / 2) + columnWidth * index
    }

    return (
        <>
            <table className="container" cellSpacing="0">
                <thead style={{
                    height: HEADER_HEIGHT + 10,
                    background: assessmentType.background,
                    color: assessmentType.color
                }}>
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
            {columns.map((col, index) => col.data.map(cell => {console.log(cell); return (<div className="cell" key={cell.name}
                                                                   style={{
                                                                       top: cell.top,
                                                                       left: `${calcLeft(index)}px`,
                                                                       height: CELL_HEIGHT,
                                                                       background: cell.color.background,
                                                                       color:cell.color.text
                                                                   }}>
                {cell.name.split(' ')[0]} {cell.hogan_score}
            </div>)}))}
        </>);
}