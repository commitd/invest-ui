export type TermBin = {
    term: string,
    count: number
}

export type TimeBin = {
    ts: number | Date,
    count: number
}

export type TermCount = {
    count: number
    bins: TermBin[]
}

export type TimeCount = {
    interval: string
    bins: TermBin[]
}
