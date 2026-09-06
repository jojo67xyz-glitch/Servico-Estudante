import type { User } from "@/models/User";

const candidatosMock: User[] = [
  {
    id: "1",
    nome: "Ana Silva",
    fotoPerfil: "https://cdn.quasar.dev/img/avatar.png",
    bio: "Estudante de Design. Quero trocar aulas de Figma por Inglês.",
    habilidades: [{ nome: "Figma", nivel: "Avançado" }],
    interesses: [{ nome: "Inglês", nivel: "Intermediário" }],
    avaliacao: 4.8
  },
  {
    id: "2",
    nome: "Carlos Mendes",
    fotoPerfil: "https://cdn.quasar.dev/img/boy-avatar.png",
    bio: "Programador Fullstack. Ensino React, quero aprender Espanhol.",
    habilidades: [{ nome: "React", nivel: "Avançado" }],
    interesses: [{ nome: "Espanhol", nivel: "Iniciante" }],
    avaliacao: 4.5
  },
  {
    id: "3",
    nome: "Beatriz Costa",
    fotoPerfil: "https://cdn.quasar.dev/img/girl-avatar.png",
    bio: "Músico profissional. Ensino violão, quero aprender Python.",
    habilidades: [{ nome: "Violão", nivel: "Avançado" }],
    interesses: [{ nome: "Python", nivel: "Iniciante" }],
    avaliacao: 4.9
  }
];

export function obterCandidatos(): Promise<User[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(candidatosMock.map(u => ({ ...u })));
    }, 800);
  });
}
