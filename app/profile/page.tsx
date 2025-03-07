"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./ProfilePage.module.css";
import Image from "next/image"; // 追加

// User 型の定義
type User = {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null); // User 型に修正
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setEmail(user.email || "");
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();
      
          if (error) {
            console.error("ユーザーデータ取得エラー:", error.message);
          } else if (data) {
            setUser(data);
            setUsername(data.name);
          }
        }
        setLoading(false);
      };

    fetchUserData();
  }, []);

  const handleProfileUpdate = async () => {
    setLoading(true);
    let avatar_url = user?.avatar_url;

    if (profileImage) {
      const filePath = `avatars/${user?.id}/${profileImage.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, profileImage);

      if (uploadError) {
        alert("プロフィール画像のアップロードに失敗しました");
        setLoading(false);
        return;
      }

      avatar_url = data?.path;
    }

    const { error } = await supabase
      .from("users")
      .update({ name: username, avatar_url })
      .eq("id", user?.id);

    if (error) {
      alert("更新エラー: " + error.message);
    } else {
      alert("プロフィールが更新されました！");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <>
          <h1 className={styles.title}>プロフィール</h1>

          <div className={styles.profileInfo}>
            <div className={styles.profileImage}>
              {user?.avatar_url ? (
                // Next.jsのImageコンポーネントを使用
                <Image
                  src={`https://your-supabase-url/storage/v1/object/public/avatars/${user.avatar_url}`}
                  alt="Profile"
                  className={styles.avatar}
                  width={150} // 適当なサイズ指定
                  height={150}
                  priority // 高速読み込みを優先
                />
                
              ) : (
                <div className={styles.defaultAvatar}>👤</div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                className={styles.fileInput}
              />
            </div>

            <label className={styles.label}>ユーザー名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />

            <label className={styles.label}>メールアドレス</label>
            <input
              type="email"
              value={email}
              disabled
              className={styles.input}
            />

            <button className={styles.button} onClick={handleProfileUpdate}>
              プロフィール更新
            </button>
          </div>
        </>
      )}
    </div>
  );
}