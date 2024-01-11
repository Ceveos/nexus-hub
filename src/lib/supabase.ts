import { env } from '~/env.mjs'
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database

export const supabaseInstance = (accessToken: string) => {
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    }
  })
}