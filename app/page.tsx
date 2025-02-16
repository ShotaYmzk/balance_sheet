"use client";
import Link from "next/link";
import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>アプリの目次</h1>
      <div className={styles.grid}>
        <Link href="/debts/sheet" className={styles.card}>
          <h2>借金一覧 &rarr;</h2>
          <p>現在の借金情報を確認できます。</p>
        </Link>

        <Link href="/debts/add" className={styles.card}>
          <h2>借金の追加 &rarr;</h2>
          <p>新しい借金を追加できます。</p>
        </Link>
        
        <Link href="/debts/group/list" className={styles.card}>
          <h2>グループ精算一覧 &rarr;</h2>
          <p>グループ精算の記録を確認できます。</p>
        </Link>
        
        <Link href="/debts/group/form" className={styles.card}>
          <h2>グループ精算 &rarr;</h2>
          <p>グループでの精算を行います。</p>
        </Link>

        <Link href="/profile" className={styles.card}>
          <h2>プロフィール &rarr;</h2>
          <p>ユーザー情報を確認・編集できます。</p>
        </Link>

        <Link href="/login" className={styles.card}>
          <h2>ログイン &rarr;</h2>
          <p>まだログインしていない場合はこちらから。</p>
        </Link>

      </div>
    </div>
  );
}