import { supabase } from "@/lib/supabase";

export default async function DebtsPage() {
  const { data: debts, error } = await supabase.from("debts").select("*");

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>;
  }

  return (
    <div>
      <h1>借金一覧</h1>
      <ul>
        {debts.map((debt) => (
          <li key={debt.id}>
            {debt.borrower_id} → {debt.lender_id} : ¥{debt.amount} ({debt.status})
          </li>
        ))}
      </ul>
    </div>
  );
}