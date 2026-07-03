"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useSupabase } from "@lib/supabase/SupabaseProvider";

export function useCurrentUser() {
  const { user, loading: authLoading } = useSupabase();

  const currentUser = useQuery(
    api.users.getBySupabaseId,
    user ? { supabaseUserId: user.id } : "skip"
  );

  return {
    authLoading,
    supabaseUser: user,
    currentUser,
    currentUserLoading: !!user && currentUser === undefined,
  };
}
