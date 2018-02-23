import { TermBin, TimeBin } from 'invest-types'

export function termBinsToXY(array: TermBin[]): { x: string, y: number }[] {
    return array.map(i => ({
        x: i.term,
        y: i.count
    }))
}

export function timeBinsToXY(array: TimeBin[]): { x: Date | number, y: number }[] {
    return array.map(i => ({
        x: i.ts,
        y: i.count
    }))
}
