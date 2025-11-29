import { createClient } from '@supabase/supabase-js';

// Use VITE_ environment variables for safe import
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize the Supabase Client
// It will fail gracefully if keys are missing (e.g., during initial setup)
let supabase;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.warn("Supabase initialization skipped: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.");
    supabase = null;
}

export { supabase };

// Define your table constants
export const USERS_TABLE = 'vault_users';
export const CHAIN_TABLE = 'vault_chain';
```

### **Next Step: Update Your `.env` File**

You must now add these two new keys to your local `.env` file (and later to your Vercel Environment Variables):

```env
# ... (Your existing Firebase keys)

VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key