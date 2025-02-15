"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
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
        if (data) {
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
      const filePath = `avatars/${user.id}/${profileImage.name}`;
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
      .eq("id", user.id);

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
                <img
                  src={`https://your-supabase-url/storage/v1/object/public/avatars/${user.avatar_url}`}
                  alt="Profile"
                  className={styles.avatar}
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