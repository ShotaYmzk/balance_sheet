"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Debt = {
  id: string;
  lender_id: string;
  borrower_id: string;
  amount: number;
  status: string;
};

export default function UserDebts() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [user, setUser] = useState<any>(null); // 型をUserに変更するため、型定義が必要

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
          setDebts(data as Debt[]); // 型アサーションを使ってデータの型を指定
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