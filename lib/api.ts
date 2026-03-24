/**
 * Centralized API service layer.
 *
 * All backend calls go through this module so the base URL is defined
 * in exactly one place.  When running on Vercel the calls are also
 * proxied via `vercel.json` rewrites (relative `/api/` paths), but
 * this module lets you switch to direct calls when needed and keeps
 * every fetch consistent.
 */

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'https://trip-budget-planner-backend-production.up.railway.app'

/** Remove trailing slash from a URL to avoid double-slash issues. */
const trimTrailingSlash = (url: string) => url.replace(/\/+$/, '')

/** Build a full endpoint URL. */
const buildUrl = (path: string) =>
    `${trimTrailingSlash(API_BASE_URL)}${path.startsWith('/') ? path : `/${path}`}`

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

    const res = await fetch(buildUrl(path), {
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

    const res = await fetch(buildUrl(path), {
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

export { API_BASE_URL }
