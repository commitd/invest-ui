import * as qs from 'qs'
import { Intent } from 'vessel-types'

/**
 * Convert from an search (query param string) to a an Intent
 * @param search the location search (query string)
 * @returns intent or if its not valid (ie doesn't exist or have no action) then undefiend
 */
export function searchToIntent(search: string): Intent | undefined {
    const q = qs.parse(search, { strictNullHandling: true, depth: 1, ignoreQueryPrefix: true })

    if (q.action == null || q.action === '') {
        return undefined
    }

    return {
        action: q.action,
        payload: q.payload ? JSON.parse(q.payload) : undefined
    }
}

/**
 * Convert from an intent to a search (query param) string for the URL
 * @param intent the intent to conver 
 */
export function intentToSearch(intent: Intent): string {
    return qs.stringify({
        action: intent.action,
        payload: intent.payload == null ? undefined : JSON.stringify(intent.payload)
    })
}