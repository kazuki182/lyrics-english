"use client";

import Link from "next/link";
import { useState } from "react";
import { registerAccount } from "@/lib/account";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerAccount(username, password);
    if (!result.ok) return setMessage(result.message);
    window.location.href = "/";
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-muted">Create your account</p>
        <h1 className="mt-1 text-4xl font-bold">アカウント作成</h1>
      </header>
      <section className="card p-6">
        <p className="text-muted">メール不要。ユーザー名とパスワードだけで登録できます。</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-bold">ユーザー名</label>
            <input className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="好きな名前" />
          </div>
          <div>
            <label className="text-sm font-bold">パスワード</label>
            <input className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="4文字以上なら数字だけでもOK" />
            <p className="mt-2 text-xs text-muted">条件：4文字以上。英語・数字・記号どれでもOK。</p>
          </div>
          {message && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{message}</p>}
          <button className="btn btn-primary w-full">登録して始める</button>
        </form>
      </section>
      <Link className="card block p-5 text-center font-bold" href="/login">ログインへ戻る</Link>
    </div>
  );
}
