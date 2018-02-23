
export interface Setting {
    key: string
    value: {}
}

/** Global configuration */
export interface InvestConfiguration {
    /** The application title */
    title: string,

    /** All global settings */
    settings: Setting[]
}
