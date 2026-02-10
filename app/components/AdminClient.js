"use client";

import { useEffect, useState } from "react";

const blankAgenda = { time: "", title: "", description: "", speakers: "" };
const blankSpeaker = { name: "", bio: "", role: "", social: "", photoUrl: "" };
const blankSponsor = { name: "", category: "Patrocinador", link: "", logoUrl: "" };

export default function AdminClient() {
  const [db, setDb] = useState(null);
  const [agendaForm, setAgendaForm] = useState(blankAgenda);
  const [speakerForm, setSpeakerForm] = useState(blankSpeaker);
  const [sponsorForm, setSponsorForm] = useState(blankSponsor);

  async function load() {
    const res = await fetch("/api/public", { cache: "no-store" });
    const publicData = await res.json();
    const moderation = await fetch("/api/moderation").then((r) => r.json());
    setDb({ ...publicData, submissions: moderation.submissions });
  }

  useEffect(() => { load(); }, []);

  async function upload(file) {
    if (!file) return "";
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    return (await res.json()).url;
  }

  async function saveSettings(e) {
    e.preventDefault();
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(db.settings),
    });
    alert("Configurações salvas");
    load();
  }

  async function postEntity(path, payload) {
    await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    load();
  }

  async function patchSubmission(id, status) {
    await fetch("/api/moderation", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    load();
  }

  if (!db) return <p>Carregando painel...</p>;

  return (
    <div className="admin-wrap">
      <h1>Painel Administrativo</h1>

      <form className="panel" onSubmit={saveSettings}>
        <h2>Configurações do Evento</h2>
        <div className="row">
          <input value={db.settings.eventName} onChange={(e) => setDb({ ...db, settings: { ...db.settings, eventName: e.target.value } })} placeholder="Nome do evento" />
          <input value={db.settings.dateLocation} onChange={(e) => setDb({ ...db, settings: { ...db.settings, dateLocation: e.target.value } })} placeholder="Data e local" />
        </div>
        <textarea value={db.settings.heroText} onChange={(e) => setDb({ ...db, settings: { ...db.settings, heroText: e.target.value } })} rows={3} placeholder="Texto institucional" />
        <div className="row">
          <input type="file" accept="image/*" onChange={async (e) => setDb({ ...db, settings: { ...db.settings, logoUrl: await upload(e.target.files?.[0]) } })} />
          <input type="file" accept="image/*" onChange={async (e) => setDb({ ...db, settings: { ...db.settings, bannerUrl: await upload(e.target.files?.[0]) } })} />
        </div>
        <button>Salvar identidade visual</button>
      </form>

      <div className="panel">
        <h2>Agenda</h2>
        <div className="row">
          <input placeholder="Horário" value={agendaForm.time} onChange={(e) => setAgendaForm({ ...agendaForm, time: e.target.value })} />
          <input placeholder="Título" value={agendaForm.title} onChange={(e) => setAgendaForm({ ...agendaForm, title: e.target.value })} />
        </div>
        <textarea placeholder="Descrição" value={agendaForm.description} onChange={(e) => setAgendaForm({ ...agendaForm, description: e.target.value })} />
        <input placeholder="Palestrante(s)" value={agendaForm.speakers} onChange={(e) => setAgendaForm({ ...agendaForm, speakers: e.target.value })} />
        <button onClick={() => { postEntity("/api/agenda", agendaForm); setAgendaForm(blankAgenda); }}>Adicionar horário</button>
        {db.agenda.map((item, idx) => (
          <div key={item.id} className="card" style={{ marginTop: 10 }}>
            <strong>{item.time} - {item.title}</strong>
            <p>{item.description}</p>
            <small>{item.speakers}</small>
            <div className="row">
              <button className="secondary" onClick={() => fetch("/api/agenda/reorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, direction: "up" }) }).then(load)} disabled={idx === 0}>Subir</button>
              <button className="secondary" onClick={() => fetch("/api/agenda/reorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, direction: "down" }) }).then(load)} disabled={idx === db.agenda.length - 1}>Descer</button>
              <button onClick={() => fetch(`/api/agenda?id=${item.id}`, { method: "DELETE" }).then(load)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>Palestrantes</h2>
        <div className="row">
          <input placeholder="Nome" value={speakerForm.name} onChange={(e) => setSpeakerForm({ ...speakerForm, name: e.target.value })} />
          <input placeholder="Cargo" value={speakerForm.role} onChange={(e) => setSpeakerForm({ ...speakerForm, role: e.target.value })} />
        </div>
        <textarea placeholder="Mini biografia" value={speakerForm.bio} onChange={(e) => setSpeakerForm({ ...speakerForm, bio: e.target.value })} />
        <input placeholder="Link rede social" value={speakerForm.social} onChange={(e) => setSpeakerForm({ ...speakerForm, social: e.target.value })} />
        <input type="file" accept="image/*" onChange={async (e) => setSpeakerForm({ ...speakerForm, photoUrl: await upload(e.target.files?.[0]) })} />
        <button onClick={() => { postEntity("/api/speakers", speakerForm); setSpeakerForm(blankSpeaker); }}>Adicionar palestrante</button>
        <div className="card-grid">
          {db.speakers.map((item) => <button key={item.id} onClick={() => fetch(`/api/speakers?id=${item.id}`, { method: "DELETE" }).then(load)}>Remover {item.name}</button>)}
        </div>
      </div>

      <div className="panel">
        <h2>Patrocinadores</h2>
        <div className="row">
          <input placeholder="Nome" value={sponsorForm.name} onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })} />
          <input placeholder="Categoria" value={sponsorForm.category} onChange={(e) => setSponsorForm({ ...sponsorForm, category: e.target.value })} />
        </div>
        <input placeholder="Link externo" value={sponsorForm.link} onChange={(e) => setSponsorForm({ ...sponsorForm, link: e.target.value })} />
        <input type="file" accept="image/*" onChange={async (e) => setSponsorForm({ ...sponsorForm, logoUrl: await upload(e.target.files?.[0]) })} />
        <button onClick={() => { postEntity("/api/sponsors", sponsorForm); setSponsorForm(blankSponsor); }}>Adicionar patrocinador</button>
        <div className="card-grid">
          {db.sponsors.map((item) => <button key={item.id} onClick={() => fetch(`/api/sponsors?id=${item.id}`, { method: "DELETE" }).then(load)}>Remover {item.name}</button>)}
        </div>
      </div>

      <div className="panel">
        <h2>Moderação de comentários, fotos e avaliações</h2>
        {db.submissions.map((s) => (
          <div key={s.id} className="card" style={{ marginTop: 8 }}>
            <strong>{s.nickname}</strong> - {s.rating}⭐ - <em>{s.status}</em>
            <p>{s.comment}</p>
            <div className="row">
              <button className="secondary" onClick={() => patchSubmission(s.id, "approved")}>Aprovar</button>
              <button onClick={() => patchSubmission(s.id, "rejected")}>Rejeitar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
