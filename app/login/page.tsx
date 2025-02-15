// app/login/page.tsx
"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setIsError(true);
        alert("ログインエラー: " + error.message);
      } else {
        router.push("/debts/sheet"); // ログイン後に遷移するページ
      }
    } catch (error) {
      setIsError(true);
      alert("ログインエラー: " + error);
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      {isError && <p style={{ color: "red" }}>メールまたはパスワードが間違っています。</p>}
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>ログイン</button>
    </div>
  );
}