import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://awkzqnzzkakjpdosljzz.supabase.co";
const supabaseAnonKey = "sb_publishable_ovJ8N_Nxk6vec8IcNhW69w_8Oqdxxud";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
