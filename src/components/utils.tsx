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

export function calculateDistanceFromTop(val, add = 0) {
    return Math.floor((100 - val) * 9.95 + HEADER_HEIGHT + add);
}