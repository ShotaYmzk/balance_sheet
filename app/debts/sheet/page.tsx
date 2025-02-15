"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DebtsPage() {
  const [debts, setDebts] = useState<any[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchDebts = async () => {
      const { data: debtsData, error } = await supabase.from("debts").select("*");
      if (error) {
        alert("借金の取得エラー: " + error.message);
      } else {
        setDebts(debtsData);
      }

      const { data: usersData, error: usersError } = await supabase.from("users").select("id, name");
      if (usersError) {
        alert("ユーザーの取得エラー: " + usersError.message);
      } else {
        setUsers(usersData);
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