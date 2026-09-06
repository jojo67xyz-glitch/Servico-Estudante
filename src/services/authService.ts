import type { Habilidade, User } from "@/models/User";

const CHAVE_SESSAO = "skillswap:sessao";
const CHAVE_TOKEN = "skillswap:token";
const API_URL = import.meta.env.VITE_API_URL || "/api";

interface RespostaAuth {
  token: string;
  user: { id: number; email: string; nome: string; bio?: string; habilidades?: Habilidade[]; interesses?: Habilidade[] };
}

async function lerResposta<T>(resposta: Response): Promise<T & { error?: string }> {
  const texto = await resposta.text();
  if (!texto) {
    throw new Error(
      resposta.status === 502
        ? "O backend está desligado. Execute npm run server."
        : `O servidor respondeu sem dados (${resposta.status}).`
    );
  }
  try {
    return JSON.parse(texto) as T & { error?: string };
  } catch {
    throw new Error("O servidor devolveu uma resposta inválida.");
  }
}

function converterUtilizador(user: RespostaAuth["user"]): User {
  return {
    id: String(user.id),
    nome: user.nome,
    fotoPerfil: "https://cdn.quasar.dev/img/avatar.png",
    bio: user.bio || "",
    habilidades: user.habilidades || [],
    interesses: user.interesses || [],
    avaliacao: 0
  };
}

async function pedirAuth(endpoint: string, dados: Record<string, string>): Promise<User> {
  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
  } catch {
    throw new Error("Não foi possível ligar ao servidor. Execute npm run server.");
  }
  const payload = await lerResposta<RespostaAuth>(resposta);
  if (!resposta.ok) throw new Error(payload.error || "Não foi possível autenticar");
  localStorage.setItem(CHAVE_TOKEN, payload.token);
  const user = converterUtilizador(payload.user);
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(user));
  return user;
}

export function fazerLogin(email: string, password: string): Promise<User> {
  return pedirAuth("login", { email, password });
}

export function criarConta(nome: string, email: string, password: string): Promise<User> {
  return pedirAuth("register", { nome, email, password });
}

export async function pedirRecuperacao(email: string): Promise<string | null> {
  const resposta = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const payload = await lerResposta<{ resetToken?: string; message?: string }>(resposta);
  if (!resposta.ok) throw new Error(payload.error || "Não foi possível pedir a recuperação");
  return payload.resetToken || null;
}

export async function redefinirPassword(token: string, password: string): Promise<void> {
  const resposta = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password })
  });
  const payload = await lerResposta<{ message?: string }>(resposta);
  if (!resposta.ok) throw new Error(payload.error || "Não foi possível alterar a password");
}

export function obterSessaoAtual(): User | null {
  try {
    const dados = localStorage.getItem(CHAVE_SESSAO);
    return dados ? JSON.parse(dados) : null;
  } catch {
    return null;
  }
}

export function fazerLogout(): void {
  localStorage.removeItem(CHAVE_SESSAO);
  localStorage.removeItem(CHAVE_TOKEN);
}

export function obterToken(): string | null {
  return localStorage.getItem(CHAVE_TOKEN);
}

export async function atualizarPerfil(dados: {
  bio: string;
  habilidades: Habilidade[];
  interesses: Habilidade[];
}): Promise<typeof dados> {
  const token = obterToken();
  const resposta = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(dados)
  });
  const payload = await lerResposta<typeof dados>(resposta);
  if (!resposta.ok) throw new Error(payload.error || "Não foi possível guardar o perfil");
  return payload;
}

export async function enviarFotoPerfil(file: File): Promise<string> {
  const token = obterToken();
  const dados = new FormData();
  dados.append("file", file);
  const resposta = await fetch(`${API_URL}/profile/photo`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: dados
  });
  const payload = await lerResposta<{ fotoUrl?: string }>(resposta);
  if (!resposta.ok || !payload.fotoUrl) throw new Error(payload.error || "Não foi possível guardar a foto");
  return payload.fotoUrl;
}
