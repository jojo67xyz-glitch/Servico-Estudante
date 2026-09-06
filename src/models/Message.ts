export type TipoMensagem =
  | "texto"
  | "imagem"
  | "audio"
  | "video"
  | "ficheiro"
  | "chamada_audio"
  | "chamada_video";

export interface Message {
  id: string;
  matchId: string;
  remetenteId: string;
  tipo: TipoMensagem;
  conteudo: string;
  duracao?: number;
  timestamp: Date;
  lida: boolean;
}

export type NovaMensagemInput = Omit<Message, "id" | "timestamp" | "lida">;
