
import { createClient } from '@supabase/supabase-js';

// Connection details provided by the enterprise environment
const supabaseUrl = 'https://ayjidirhmunwamzkncmc.supabase.co';
const supabaseAnonKey = 'sb_publishable_MK20QJd0EyL8yd6rDsPB7g_qCRSztEJ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
