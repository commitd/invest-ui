
export interface Setting {
    key: string
    value: {}
}

/** Global configuration */
export interface InvestConfiguration {
    /** The application title */
    title: string,

    /* is auth enabled... null=false */
    auth?: boolean,

    /** All global settings */
    settings: Setting[]
}
