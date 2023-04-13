import {CELL_HEIGHT, HEADER_HEIGHT, HEADER_ROW_WIDTH} from "./utils";
import {AssessmentResult} from "./ParseService";

export const HoganTable = ({headers, columns, type}: AssessmentResult) => {

    function getColumnWidth() {
        return Math.floor((1920 - HEADER_ROW_WIDTH) / columns.length);
    }

    function calcLeft(index: number) {
        let columnWidth = getColumnWidth();
        return HEADER_ROW_WIDTH + Math.floor((columnWidth - 150) / 2) + columnWidth * index
    }

    if (!headers || !columns || !type) {
        console.warn('headers,columns, or types are null', headers, columns, type)
        return <></>
    }
    return (
        <>
            <table className="container" cellSpacing="0">
                <thead style={{
                    height: HEADER_HEIGHT + 10,
                    background: type.color.background,
                    color: type.color.text
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
                {type?.labels.map(label => <tr key={label.label} style={{height: `${label.height}%`}}>
                        <td> {label.label}</td>
                        {headers.map(val => <td key={val}></td>)}
                    </tr>
                )}
                </tbody>
            </table>
            {columns.map((col, index) => col.data.map(cell => (<div className="cell" key={cell.name}
                                                                   style={{
                                                                       top: cell.top,
                                                                       left: `${calcLeft(index)}px`,
                                                                       height: CELL_HEIGHT,
                                                                       background: cell.color.background,
                                                                       color:cell.color.text
                                                                   }}>
                {cell.name.split(' ')[0]} {cell.hogan_score}
            </div>)))}
        </>);
}