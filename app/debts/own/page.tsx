"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function UserDebts() {
  const [debts, setDebts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchDebts = async () => {
        const { data, error } = await supabase
          .from("debts")
          .select("*")
          .eq("borrower_id", user.id);

        if (error) {
          alert("借金情報の取得に失敗しました");
        } else {
          setDebts(data);
        }
      };
      fetchDebts();
    }
  }, [user]);

  return (
    <div>
      <h1>あなたの借金一覧</h1>
      <ul>
        {debts.map((debt) => (
          <li key={debt.id}>
            {debt.lender_id} → {debt.amount}円 ({debt.status})
          </li>
        ))}
      </ul>
    </div>
  );
}