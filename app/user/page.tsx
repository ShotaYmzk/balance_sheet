"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UserInfo() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    fetchUser();
  }, []);
  

  return (
    <div>
      <h1>ログインユーザー ID</h1>
      <p>{userId || "ログインしていません"}</p>
    </div>
  );
}