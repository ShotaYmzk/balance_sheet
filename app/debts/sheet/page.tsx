"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Debt 型の定義
type Debt = {
  id: string;
  borrower_id: string;
  lender_id: string;
  amount: number;
  status: string;
  paid_at?: string; // 返済日付がある場合
};

// User 型の定義
type User = {
  id: string;
  name: string;
};

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]); // Debt 型を使用
  const [users, setUsers] = useState<User[]>([]); // User 型を使用

  useEffect(() => {
    const fetchDebts = async () => {
      const { data: debtsData, error } = await supabase.from("debts").select("*");
      if (error) {
        alert("借金の取得エラー: " + error.message);
      } else {
        setDebts(debtsData as Debt[]); // 型アサーションを使って型を指定
      }

      const { data: usersData, error: usersError } = await supabase.from("users").select("id, name");
      if (usersError) {
        alert("ユーザーの取得エラー: " + usersError.message);
      } else {
        setUsers(usersData as User[]); // 型アサーションを使って型を指定
      }
    };
    fetchDebts();
  }, []);

  const getUserNameById = (id: string) => {
    const user = users.find(user => user.id === id);
    return user ? user.name : "ユーザー不明";
  };

  const updateDebtStatus = async (id: string) => {
    const { error } = await supabase
      .from("debts")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      alert("更新エラー: " + error.message);
    } else {
      alert("借金が返済されました！");
    }
  };

  return (
    <div>
      <h1>借金一覧</h1>
      <ul>
        {debts.map((debt) => (
          <li key={debt.id}>
            {getUserNameById(debt.borrower_id)} → {getUserNameById(debt.lender_id)} : ¥{debt.amount} ({debt.status})
            {debt.status === "pending" && (
              <button onClick={() => updateDebtStatus(debt.id)}>返済済みにする</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}