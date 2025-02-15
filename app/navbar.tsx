// app/navbar.tsx (ナビゲーションバーなど)
"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav>
      <button onClick={handleLogout}>ログアウト</button>
    </nav>
  );
}