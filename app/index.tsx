import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const fetchData = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) console.error(error);
    else console.log(data);
  };

  return (
    <div>
      <h1>Supabase Test</h1>
      <button onClick={fetchData}>データを取得</button>
    </div>
  );
}