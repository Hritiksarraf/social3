"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { SupabaseProvider } from "@lib/supabase/SupabaseProvider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export function ConvexClientProvider({ children }) {
  return (
    <SupabaseProvider>
      <ConvexProvider client={convex}>{children}</ConvexProvider>
    </SupabaseProvider>
  );
}
