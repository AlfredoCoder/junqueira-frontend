export type ConsultaBilheteResponse = {
  error: boolean;
  name: string;
  data_de_nascimento: string; // formato ISO: "YYYY-MM-DD"
  pai: string;
  mae: string;
  morada: string | null;
  emitido_em: string | null; // pode ser null ou string (ex: "2020-01-01")
  type: string; // ex: "consulta de bilhete"
};
