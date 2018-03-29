import { TermBin, TimeBin } from 'invest-types'

export function termBinsToXY(array: TermBin[]): { x: string, y: number }[] {
    return array.map(i => ({
        x: i.term,
        y: i.count
    }))
}

export function timeBinsToXY(array: TimeBin[]): { x: Date, y: number }[] {
    return array.map(i => ({
        x: i.ts instanceof Date ? i.ts : new Date(i.ts),
        y: i.count
    }))
}
