/**
 * Centralized API service layer.
 *
 * All backend calls go through this module using relative paths
 * (e.g. '/api/trips/plan'). Vercel rewrites in vercel.json proxy
 * these requests to the Railway backend automatically.
 */

/* ------------------------------------------------------------------ */
/*  Core request helpers                                               */
/* ------------------------------------------------------------------ */

interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
    /** Will be JSON-stringified automatically. */
    body?: unknown
}

async function request<T>(
    method: string,
    path: string,
    opts: RequestOptions = {},
): Promise<T> {
    const { body, headers, ...rest } = opts

    const res = await fetch(path, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        ...rest,
    })

    if (!res.ok) {
        throw new Error(`API ${method} ${path} failed with status ${res.status}`)
    }

    return res.json() as Promise<T>
}

async function requestBlob(
    method: string,
    path: string,
    opts: RequestOptions = {},
): Promise<Blob> {
    const { body, headers, ...rest } = opts

    const res = await fetch(path, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        ...rest,
    })

    if (!res.ok) {
        throw new Error(`API ${method} ${path} failed with status ${res.status}`)
    }

    return res.blob()
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export const api = {
    get: <T>(path: string, opts?: RequestOptions) =>
        request<T>('GET', path, opts),

    post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
        request<T>('POST', path, { ...opts, body }),

    /** POST that returns a raw Blob (for PDF downloads, etc.). */
    postBlob: (path: string, body?: unknown, opts?: RequestOptions) =>
        requestBlob('POST', path, { ...opts, body }),
}
