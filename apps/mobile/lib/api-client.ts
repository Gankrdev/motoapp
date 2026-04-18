import * as SecureStore from 'expo-secure-store'

const API_URL = 'http://192.168.100.2:3000'

export class ApiError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

export class NetworkError extends Error {
    constructor() {
        super('Sin conexión. Revisa tu internet.')
        this.name = 'NetworkError'
    }
}

type ApiOptions = {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    body?: unknown
    auth?: boolean  // default true
}

export async function api<T = unknown>(
    path: string,
    opts: ApiOptions = {}
): Promise<T> {
    const { method = 'GET', body, auth = true } = opts

    const headers: Record<string, string> = {}
    if (body) headers['Content-Type'] = 'application/json'
    if (auth) {
        const token = await SecureStore.getItemAsync('auth_token')
        if (token) headers['Authorization'] = `Bearer ${token}`
    }

    let res: Response
    try {
        res = await fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        })
    } catch {
        throw new NetworkError()
    }

    if (!res.ok) {
        let msg = `Error ${res.status}`
        try {
            const data = await res.json()
            if (data?.message) msg = data.message
        } catch { }
        throw new ApiError(msg, res.status)
    }

    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
}
