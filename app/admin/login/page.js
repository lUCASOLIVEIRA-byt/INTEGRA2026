"use client";

import { useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password }),
    });
    if (res.ok) {
      window.location.href = "/admin";
    } else {
      setError("Credenciais inválidas");
    }
  }

  return (
    <main className="container" style={{ padding: "5rem 0" }}>
      <form className="panel" onSubmit={handleSubmit}>
        <h1>Acesso administrativo</h1>
        <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Usuário" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
        <button>Entrar</button>
        {error ? <p>{error}</p> : null}
      </form>
    </main>
  );
}
