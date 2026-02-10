import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

let _supabaseAdmin: SupabaseClient<Database> | null = null;

export function getSupabaseAdmin(): SupabaseClient<Database> {
    if (_supabaseAdmin) return _supabaseAdmin;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    _supabaseAdmin = createClient<Database>(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
        db: {
            schema: 'app'
        }
    });

    return _supabaseAdmin;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient<Database>, {
    get(_, prop) {
        return (getSupabaseAdmin() as any)[prop];
    }
});


// Public schema client for recipes table
let _supabasePublic: any = null;

export function getSupabasePublic() {
    if (_supabasePublic) return _supabasePublic;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    _supabasePublic = createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
        db: {
            schema: 'public'
        }
    });

    return _supabasePublic;
}

export const supabasePublic = {
    from: (table: string) => getSupabasePublic().from(table)
};
