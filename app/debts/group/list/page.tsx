"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./GroupDebtList.module.css";

interface Participant {
  id: number;
  borrower_name: string;
  amount: number;
  is_paid: boolean; // 支払い済みフラグ
}

interface GroupDebt {
  id: number;
  payer_name: string;
  total_amount: number;
  description: string;
  participants: Participant[];
}

export default function GroupDebtList() {
  const [groupDebts, setGroupDebts] = useState<GroupDebt[]>([]);

  useEffect(() => {
    const fetchGroupDebts = async () => {
      // グループ精算データを取得（参加者のis_paidも取得）
      const { data, error } = await supabase
        .from("group_debts")
        .select("id, payer_name, total_amount, description, group_debt_participants(id, borrower_name, amount, is_paid)");

      if (error) {
        alert("グループ精算の取得エラー: " + error.message);
        return;
      }

      if (data) {
        // 取得したデータを整形
        const formattedData = data.map((debt) => ({
          id: debt.id,
          payer_name: debt.payer_name,
          total_amount: debt.total_amount,
          description: debt.description,
          participants: debt.group_debt_participants,
        }));
        setGroupDebts(formattedData);
      }
    };

    fetchGroupDebts();
  }, []);

  const handleMarkParticipantAsPaid = async (debtId: number, participantId: number) => {
    // ユーザーに確認の警告を表示
    const isConfirmed = window.confirm("この参加者を支払い済みにしてもよろしいですか？");

    if (!isConfirmed) {
      return; // ユーザーがキャンセルした場合、処理を中止
    }

    // 参加者の支払い状況を更新
    const { error } = await supabase
      .from("group_debt_participants")
      .update({ is_paid: true })
      .eq("id", participantId)
      .eq("group_debt_id", debtId);

    if (error) {
      alert("支払い済みにマークするエラー: " + error.message);
    } else {
      // 状態を更新して UI に反映
      setGroupDebts((prevDebts) =>
        prevDebts.map((debt) =>
          debt.id === debtId
            ? {
                ...debt,
                participants: debt.participants.map((participant) =>
                  participant.id === participantId ? { ...participant, is_paid: true } : participant
                ),
              }
            : debt
        )
      );
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>💰 グループ精算一覧</h2>
      <div className={styles.list}>
        {groupDebts.length === 0 ? (
          <p>グループ精算データはありません。</p>
        ) : (
          groupDebts.map((debt) => (
            <div key={debt.id} className={styles.card}>
              <h3 className={styles.payer}>{debt.payer_name} が立て替えた</h3>
              <p className={styles.totalAmount}>合計金額: ¥{debt.total_amount}</p>
              {debt.description && (
                <p className={styles.description}>説明: {debt.description}</p>
              )}
              <h4>参加者:</h4>
              <ul className={styles.participants}>
                {debt.participants.map((participant, index) => (
                  <li key={participant.id} className={styles.participant}>
                    <span>{participant.borrower_name}</span>: ¥{participant.amount}
                    {!participant.is_paid && (
                      <button
                        className={styles.markAsPaidBtn}
                        onClick={() => handleMarkParticipantAsPaid(debt.id, participant.id)}
                      >
                        支払い済みにする
                      </button>
                    )}
                    {participant.is_paid && <span className={styles.paidBadge}>✅ 支払い済み</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}