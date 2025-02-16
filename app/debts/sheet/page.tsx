"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./DebtsPage.module.css";

// Debt 型の定義に description を追加
type Debt = {
  id: string;
  borrower_id: string;
  lender_id: string;
  amount: number;
  status: string;
  description?: string; // 説明を追加
  paid_at?: string;
};

// User 型の定義
type User = {
  id: string;
  name: string;
};

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchDebts = async () => {
      // description も取得
      const { data: debtsData, error } = await supabase.from("debts").select("id, borrower_id, lender_id, amount, status, description, paid_at");
      if (error) {
        alert("借金の取得エラー: " + error.message);
      } else {
        setDebts(debtsData as Debt[]);
      }

      const { data: usersData, error: usersError } = await supabase.from("users").select("id, name");
      if (usersError) {
        alert("ユーザーの取得エラー: " + usersError.message);
      } else {
        setUsers(usersData as User[]);
      }
    };
    fetchDebts();
  }, []);

  const getUserNameById = (id: string) => {
    const user = users.find((user) => user.id === id);
    return user ? user.name : "ユーザー不明";
  };

  const updateDebtStatus = async (id: string) => {
    const confirmPayment = confirm("本当にこの借金を返済済みにしますか？");
    if (!confirmPayment) return;
  
    const { error } = await supabase
      .from("debts")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", id);
  
    if (error) {
      alert("更新エラー: " + error.message);
    } else {
      alert("借金が返済されました！");
      setDebts((prev) =>
        prev.map((debt) =>
          debt.id === id ? { ...debt, status: "paid", paid_at: new Date().toISOString() } : debt
        )
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>💰 借金の台帳 💸</h1>
      <div className={styles.debtList}>
        {debts.length === 0 ? (
          <p className={styles.noDebt}>No debts found.</p>
        ) : (
          debts.map((debt) => (
            <div key={debt.id} className={`${styles.debtCard} ${debt.status === "paid" ? styles.paid : styles.pending}`}>
              <p className={styles.amount}>¥{debt.amount.toLocaleString()}</p>
              <p className={styles.details}>
                <span className={styles.borrower}>{getUserNameById(debt.borrower_id)}</span> →{" "}
                <span className={styles.lender}>{getUserNameById(debt.lender_id)}</span>
              </p>
              {/* description を表示 */}
              {debt.description && <p className={styles.description}>📝 {debt.description}</p>}
              <p className={styles.status}>{debt.status === "pending" ? "⏳ Pending" : "✅ Paid"}</p>
              {debt.status === "pending" && (
                <button className={styles.payButton} onClick={() => updateDebtStatus(debt.id)}>
                  Mark as Paid
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
