"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./GroupDebtForm.module.css";

export default function GroupDebtForm() {
  const [payerName, setPayerName] = useState(""); // 立て替えた人の名前
  const [totalAmount, setTotalAmount] = useState("");
  const [participants, setParticipants] = useState([{ borrowerName: "", amount: "" }]);
  const [description, setDescription] = useState(""); // 追加: 説明

  const addParticipant = () => {
    setParticipants([...participants, { borrowerName: "", amount: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 負担額を人数に応じて均等に割る
    const splitAmount = parseFloat(totalAmount) / (participants.length + 1);

    const { data: debt, error } = await supabase
      .from("group_debts")
      .insert([{ payer_name: payerName, total_amount: parseFloat(totalAmount), description }])
      .select();

    if (error || !debt) {
      alert("立て替え記録エラー: " + error?.message);
      return;
    }

    const groupDebtId = debt[0].id;

    const { error: participantError } = await supabase
      .from("group_debt_participants")
      .insert(
        participants.map((p) => ({
          group_debt_id: groupDebtId,
          borrower_name: p.borrowerName,
          amount: splitAmount, // 均等に割った負担額を記録
        }))
      );

    if (participantError) {
      alert("参加者記録エラー: " + participantError.message);
      return;
    }

    alert("グループ精算を記録しました！");
    setPayerName("");
    setTotalAmount("");
    setParticipants([{ borrowerName: "", amount: "" }]);
    setDescription(""); // 説明をリセット
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>💰 グループ精算</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>💰 立て替えた人の名前</label>
          <input 
            type="text" 
            value={payerName} 
            onChange={(e) => setPayerName(e.target.value)} 
            placeholder="立て替えた人の名前" 
          />
        </div>

        <div className={styles.formGroup}>
          <label>💲 合計金額</label>
          <input 
            type="number" 
            value={totalAmount} 
            onChange={(e) => setTotalAmount(e.target.value)} 
            placeholder="合計金額" 
          />
        </div>

        <div className={styles.formGroup}>
          <label>📝 説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="この精算に関する説明を入力してください"
          />
        </div>

        <h3>🧑‍🤝‍🧑 借りた人</h3>
        {participants.map((p, index) => (
          <div key={index} className={styles.formGroup}>
            <label>👤 借りた人の名前</label>
            <input
              type="text"
              value={p.borrowerName}
              onChange={(e) =>
                setParticipants(participants.map((x, i) => (i === index ? { ...x, borrowerName: e.target.value } : x)))
              }
              placeholder="借りた人の名前"
            />
          </div>
        ))}

        <button type="button" onClick={addParticipant} className={styles.addBtn}>
          ➕ 借りた人を追加
        </button>
        <button type="submit" className={styles.button}>
          📌 記録
        </button>
      </form>
    </div>
  );
}