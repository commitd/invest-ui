
export interface Setting {
    key: string
    value: {}
}

export type SettingsList = Setting[]

export type SettingsMap = {
    [key: string]: {}
}

/** Global configuration */
export interface InvestConfiguration {
    /** The application title */
    title: string,

    /** All global settings */
    settings: Setting[]
}
