import * as qs from 'qs'
import { Intent } from 'vessel-types'
import { Location } from 'history'

export function searchToIntent(location: Location): Intent | undefined {
    const q = qs.parse(location.search, { strictNullHandling: true, depth: 1, ignoreQueryPrefix: true })

    if (q.action == null || q.action === '') {
        return undefined
    }

    return {
        action: q.action,
        payload: q.payload ? JSON.parse(q.payload) : undefined
    }
}

export function intentToSearch(intent: Intent): string {
    return qs.stringify({
        action: intent.action,
        payload: intent.payload == null ? undefined : JSON.stringify(intent.payload)
    })
}