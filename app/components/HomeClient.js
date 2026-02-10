"use client";

import { useEffect, useMemo, useState } from "react";

const emptySubmission = { nickname: "", comment: "", rating: 5, photoUrl: "" };

export default function HomeClient() {
  const [data, setData] = useState(null);
  const [submission, setSubmission] = useState(emptySubmission);
  const [uploading, setUploading] = useState(false);

  async function loadData() {
    const res = await fetch("/api/public", { cache: "no-store" });
    setData(await res.json());
  }

  useEffect(() => {
    loadData();
  }, []);

  const groupedSponsors = useMemo(() => {
    if (!data?.sponsors) return {};
    return data.sponsors.reduce((acc, item) => {
      acc[item.category] = [...(acc[item.category] || []), item];
      return acc;
    }, {});
  }, [data]);

  async function uploadFile(file) {
    if (!file) return "";
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const body = await res.json();
    setUploading(false);
    return body.url || "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...submission, rating: Number(submission.rating) };
    await fetch("/api/participant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSubmission(emptySubmission);
    await loadData();
    alert("Conteúdo enviado para moderação.");
  }

  if (!data) return <main className="container"><p>Carregando...</p></main>;

  const { settings, agenda, speakers, approvedSubmissions, avgRating } = data;
  const heroStyle = {
    backgroundImage: settings.bannerUrl ? `url(${settings.bannerUrl})` : undefined,
    backgroundColor: settings.bannerUrl ? undefined : "#14244f",
  };

  return (
    <main>
      <header className="hero" style={heroStyle}>
        <div className="hero-content container">
          {settings.logoUrl ? <img className="hero-logo" src={settings.logoUrl} alt="Logo do evento" /> : null}
          <h1>{settings.eventName || "Nome do Evento"}</h1>
          <p>{settings.dateLocation || "Data e local a definir"}</p>
          <p>{settings.heroText}</p>
        </div>
      </header>

      <section className="container">
        <h2>Agenda</h2>
        <div className="card-grid">
          {agenda.map((item) => (
            <article key={item.id} className="card">
              <strong>{item.time}</strong>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p className="small muted">{item.speakers}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container">
        <h2>Palestrantes</h2>
        <div className="card-grid">
          {speakers.map((person) => (
            <article key={person.id} className="card">
              {person.photoUrl ? <img src={person.photoUrl} alt={person.name} style={{ width: "100%", borderRadius: 10, aspectRatio: "4/3", objectFit: "cover" }} /> : null}
              <h3>{person.name}</h3>
              <p className="small muted">{person.role}</p>
              <p>{person.bio}</p>
              {person.social ? <a href={person.social} target="_blank">Rede social</a> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="container">
        <h2>Patrocinadores & Apoiadores</h2>
        {Object.entries(groupedSponsors).map(([category, logos]) => (
          <div key={category}>
            <h3>{category}</h3>
            <div className="card-grid">
              {logos.map((s) => (
                <a key={s.id} className="card" href={s.link} target="_blank">
                  {s.logoUrl ? <img src={s.logoUrl} alt={s.name} style={{ width: "100%", maxHeight: 90, objectFit: "contain" }} /> : <strong>{s.name}</strong>}
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="container">
        <h2>Área Interativa dos Participantes</h2>
        <p>Média de avaliações: <span className="rating">{avgRating.toFixed(1)} ⭐</span></p>
        <form className="panel" onSubmit={handleSubmit}>
          <div className="row">
            <input placeholder="Nome ou apelido" value={submission.nickname} onChange={(e) => setSubmission({ ...submission, nickname: e.target.value })} required />
            <select value={submission.rating} onChange={(e) => setSubmission({ ...submission, rating: e.target.value })}>
              {[1,2,3,4,5].map((v) => <option key={v} value={v}>{v} estrela(s)</option>)}
            </select>
          </div>
          <textarea placeholder="Comentário" value={submission.comment} onChange={(e) => setSubmission({ ...submission, comment: e.target.value })} rows={4} required />
          <input type="file" accept="image/*" onChange={async (e) => {
            const url = await uploadFile(e.target.files?.[0]);
            setSubmission((prev) => ({ ...prev, photoUrl: url }));
          }} />
          <button type="submit" disabled={uploading}>{uploading ? "Enviando imagem..." : "Enviar para moderação"}</button>
        </form>

        <h3>Galeria e comentários aprovados</h3>
        <div className="card-grid">
          {approvedSubmissions.map((s) => (
            <article key={s.id} className="card">
              {s.photoUrl ? <img src={s.photoUrl} alt={`Foto de ${s.nickname}`} style={{ width: "100%", borderRadius: 10 }} /> : null}
              <h4>{s.nickname}</h4>
              <p className="rating">{"⭐".repeat(s.rating)}</p>
              <p>{s.comment}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
