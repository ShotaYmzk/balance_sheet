// app/signup/page.tsx
"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setIsError(true);
        alert("サインアップエラー: " + error.message);
      } else {
        alert("サインアップが完了しました！");
        router.push("/login"); // サインアップ後にログインページへ遷移
      }
    } catch (error) {
      setIsError(true);
      alert("サインアップエラー: " + error);
    }
  };

  return (
    <div>
      <h1>新規登録</h1>
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
      <button onClick={handleSignup}>登録</button>
    </div>
  );
}