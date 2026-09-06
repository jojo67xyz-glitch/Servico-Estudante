export type MatchStatus = "pendente" | "aceito" | "rejeitado";

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  status: MatchStatus;
  dataMatch: Date;
  ultimaMensagem?: string;
  timestampUltimaMsg?: number;
}
