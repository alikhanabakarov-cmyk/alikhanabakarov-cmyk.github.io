// supabase.js

const SUPABASE_URL = 'https://fqxbtojjhpkibixvnbnn.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_0F-CDySnOiJYUdAr8khcJA_QiZc6J2y';

window.__gcSupabaseConfig = {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY,
};

if (window.supabase?.createClient) {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
} else {
  window.supabaseClient = null;
  console.error('Supabase library did not load.');
}
