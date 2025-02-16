"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./AddDebt.module.css";

export default function AddDebt() {
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [borrower, setBorrower] = useState("");
  const [lender, setLender] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("id, name");

      if (error) {
        console.error("ユーザーの取得に失敗しました:", error.message);
        setUsers([]); // エラー時は空のリストをセット
      } else {
        setUsers(data || []); // データが `null` の場合も考慮
      }
    };

    fetchUsers();
  }, []);

  const addDebt = async () => {
    if (!borrower || !lender || !amount) {
      alert("全てのフィールドを入力してください");
      return;
    }

    const { error } = await supabase.from("debts").insert([
      {
        borrower_id: borrower,
        lender_id: lender,
        amount: Number(amount),
        description,
        status: "pending",
      },
    ]);

    if (error) {
      alert("エラー: " + error.message);
    } else {
      alert("借金を追加しました！");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>借金を追加</h1>

      <div className={styles.form}>
        {/* 借りた人の選択 */}
        <label className={styles.label}>借りた人</label>
        <select
          className={styles.input}
          value={borrower}
          onChange={(e) => setBorrower(e.target.value)}
        >
          <option value="">選択してください</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* 貸した人の選択 */}
        <label className={styles.label}>貸した人</label>
        <select
          className={styles.input}
          value={lender}
          onChange={(e) => setLender(e.target.value)}
        >
          <option value="">選択してください</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* 金額入力 */}
        <label className={styles.label}>金額</label>
        <input
          className={styles.input}
          placeholder="金額"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* 説明入力 */}
        <label className={styles.label}>説明</label>
        <input
          className={styles.input}
          placeholder="説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* 追加ボタン */}
        <button className={styles.button} onClick={addDebt}>
          借金を追加
        </button>
      </div>
    </div>
  );
}