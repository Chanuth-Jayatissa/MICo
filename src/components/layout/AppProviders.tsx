"use client";

import { useEffect } from "react";
import { MicoProvider, useMico } from "@/lib/store/mico-store";
import ToastContainer from "@/components/ui/ToastContainer";
import { createClient } from "@/lib/supabase/client";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MicoProvider>
      <AuthSeeder />
      {children}
      <ToastContainer />
    </MicoProvider>
  );
}

/**
 * Fetches the Supabase auth session and seeds the user profile
 * with name, email, and avatar from Google OAuth.
 */
function AuthSeeder() {
  const { dispatch, state } = useMico();

  useEffect(() => {
    if (!state.initialized) return;

    const supabase = createClient();

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata ?? {};
        dispatch({
          type: "SEED_AUTH_USER",
          payload: {
            id: user.id,
            email: user.email ?? "",
            fullName: meta.full_name ?? meta.name ?? "",
            avatarUrl: meta.avatar_url ?? meta.picture ?? undefined,
          },
        });
      }
    })();
  }, [state.initialized, dispatch]);

  return null;
}
