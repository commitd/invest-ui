
export interface Property {
    key: string
    value: {}
}

export type PropertiesList = Property[]

export type PropertiesMap = {
    [key: string]: {}
}

/** Global configuration */
export interface InvestConfiguration {
    /** The application title */
    title: string,

    /** All global settings */
    settings: PropertiesMap
}
