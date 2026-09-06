import type { User } from "@/models/User";

const CHAVE_SESSAO = "skillswap:sessao";
const CHAVE_TOKEN = "skillswap:token";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface RespostaAuth {
  token: string;
  user: { id: number; email: string; nome: string };
}

function converterUtilizador(user: RespostaAuth["user"]): User {
  return {
    id: String(user.id),
    nome: user.nome,
    fotoPerfil: "https://cdn.quasar.dev/img/avatar.png",
    bio: "Ainda não adicionou uma biografia.",
    habilidades: [],
    interesses: [],
    avaliacao: 0
  };
}

async function pedirAuth(endpoint: string, dados: Record<string, string>): Promise<User> {
  const resposta = await fetch(`${API_URL}/auth/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  const payload = (await resposta.json()) as RespostaAuth & { error?: string };
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
