"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function AuthControls() {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsPending(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsPending(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function signIn() {
    setIsPending(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/account`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) {
      setIsPending(false);
      window.location.assign("/auth/error");
    }
  }

  async function signOut() {
    setIsPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsPending(false);
    window.location.assign("/");
  }

  if (user) {
    return (
      <div className="auth-controls">
        <Link href="/account" className="auth-account-link">
          내 지원계획
        </Link>
        <button
          type="button"
          onClick={signOut}
          disabled={isPending}
          className="auth-button auth-button-secondary"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={signIn}
      disabled={isPending}
      className="auth-button"
    >
      {isPending ? "확인 중" : "Google 로그인"}
    </button>
  );
}
