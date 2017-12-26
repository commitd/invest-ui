
import { UiPlugin } from 'invest-types'

export function absoluteUrlForPlugin(baseServerPath: string, p: UiPlugin): string {
    if (p.url.startsWith('http:') || p.url.startsWith('https:')) {
        return p.url
    } else {
        return baseServerPath + p.url
    }
}