// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://khzdxnqvfwkhuggkytmt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoemR4bnF2ZndraHVnZ2t5dG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwOTU3ODcsImV4cCI6MjA1NzY3MTc4N30.Iljlgn8hNRUYDxcuOs_iiGz9X9kZRtN_Flf3Jj5uuns";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);