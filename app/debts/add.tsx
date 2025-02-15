"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddDebt() {
  const [borrower, setBorrower] = useState("");
  const [lender, setLender] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const addDebt = async () => {
    const { data, error } = await supabase.from("debts").insert([
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
    <div>
      <h1>借金を追加</h1>
      <input placeholder="借りた人のID" onChange={(e) => setBorrower(e.target.value)} />
      <input placeholder="貸した人のID" onChange={(e) => setLender(e.target.value)} />
      <input placeholder="金額" type="number" onChange={(e) => setAmount(e.target.value)} />
      <input placeholder="説明" onChange={(e) => setDescription(e.target.value)} />
      <button onClick={addDebt}>追加</button>
    </div>
  );
}