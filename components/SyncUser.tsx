
'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '../lib/supabase';

export default function SyncUser() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    async function sync() {
      if (isLoaded && user) {
        try {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              name: user.fullName || user.username || 'Nexa User',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });

          if (error) console.error("Profile sync error:", error);
        } catch (err) {
          console.error("Critical sync failure:", err);
        }
      }
    }
    sync();
  }, [user, isLoaded]);

  return null;
}
