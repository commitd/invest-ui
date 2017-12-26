export type HeaderKeyValue = {
    k: string,
    v: string | null | undefined
}
export type HeaderList = HeaderKeyValue[]

export type SimpleResponse = {
    headers: HeaderList
    ok: boolean
    status: number
    statusText: string
    type: ResponseType
    url: string
    body: Blob | null;
}

export function convertListToHeaders(list: HeaderList): Headers {
    const headers = new Headers()
    list.forEach((e) => {
        if (e.v) {
            headers.set(e.k, e.v)
        }
    })
    return headers
}

export function convertHeadersToList(headers: Headers): HeaderList {
    const list: HeaderList = []
    headers.forEach((value: string | null, key: string) => {
        list.push({
            k: key,
            v: value
        })
    })
    return list
}

export function simplifyResponse(r: Response): Promise<SimpleResponse> {
    return r.blob().then((blob: Blob) => {
        return {
            headers: convertHeadersToList(r.headers),
            ok: r.ok,
            status: r.status,
            statusText: r.statusText,
            type: r.type,
            url: r.url,
            body: blob
        }
    })
}

export function hydrateSimpleResponse(r: SimpleResponse) {
    return new Response(r.body, {
        headers: convertListToHeaders(r.headers),
        status: r.status,
        statusText: r.statusText
    })
}