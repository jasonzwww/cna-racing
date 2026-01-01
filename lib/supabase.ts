export type SupabaseConfig = {
    url: string;
    anonKey: string;
};

export const getSupabaseConfig = (): SupabaseConfig => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        throw new Error(
            "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        );
    }

    return { url, anonKey };
};

export const getSupabaseHeaders = () => {
    const { anonKey } = getSupabaseConfig();

    return {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
    } as const;
};

export const buildSupabaseRestUrl = (path: string) => {
    const { url } = getSupabaseConfig();

    return `${url}/rest/v1/${path}`;
};

export const supabaseFetch = async (path: string, init: RequestInit = {}) => {
    const response = await fetch(buildSupabaseRestUrl(path), {
        ...init,
        headers: {
            ...getSupabaseHeaders(),
            ...init.headers,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Supabase request failed: ${response.status} ${errorText}`);
    }

    return response;
};