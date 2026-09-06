export type NivelHabilidade = "Iniciante" | "Intermediário" | "Avançado";

export interface Habilidade {
  nome: string;
  nivel: NivelHabilidade;
}

export interface User {
  id: string;
  nome: string;
  fotoPerfil: string;
  bio: string;
  habilidades: Habilidade[];
  interesses: Habilidade[];
  avaliacao: number;
}

export type NovoUserInput = Omit<User, "id" | "avaliacao">;
