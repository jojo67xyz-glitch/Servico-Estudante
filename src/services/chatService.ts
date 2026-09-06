import type { Message, NovaMensagemInput } from "@/models/Message";

const historicoMock: Record<string, Message[]> = {
  m1: [
    {
      id: "msg-001",
      matchId: "m1",
      remetenteId: "ana",
      tipo: "texto",
      conteudo: "Olá! Tudo bem?",
      timestamp: new Date("2026-09-05T10:00:00"),
      lida: true
    },
    {
      id: "msg-002",
      matchId: "m1",
      remetenteId: "meu-id-unico",
      tipo: "texto",
      conteudo: "Tudo ótimo! E contigo?",
      timestamp: new Date("2026-09-05T10:05:00"),
      lida: true
    }
  ]
};

export function obterHistorico(matchId: string): Promise<Message[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      const msgs = historicoMock[matchId] || [];
      resolve(msgs.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
    }, 400);
  });
}

export function enviarMensagem(dados: NovaMensagemInput): Promise<Message> {
  return new Promise(resolve => {
    setTimeout(() => {
      const novaMsg: Message = {
        ...dados,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        lida: false
      };

      const historico = historicoMock[dados.matchId] ?? [];
      historicoMock[dados.matchId] = historico;
      historico.push(novaMsg);
      resolve(novaMsg);
    }, 300);
  });
}

export function marcarComoLidas(matchId: string): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      const msgs = historicoMock[matchId];
      if (msgs) {
        msgs.forEach(m => (m.lida = true));
      }
      resolve();
    }, 200);
  });
}
