import type { User } from "@/models/User";

const CHAVE_SESSAO = "skillswap:sessao";

export function fazerLogin(_email: string): Promise<User> {
  return new Promise(resolve => {
    setTimeout(() => {
      const usuarioSimulado: User = {
        id: "meu-id-unico",
        nome: "Eu Estudante",
        fotoPerfil: "https://cdn.quasar.dev/img/avatar.png",
        bio: "Desenvolvedor em formação.",
        habilidades: [{ nome: "Vue.js", nivel: "Intermediário" }],
        interesses: [{ nome: "Node.js", nivel: "Iniciante" }],
        avaliacao: 5.0
      };
      localStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuarioSimulado));
      resolve(usuarioSimulado);
    }, 600);
  });
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
}
