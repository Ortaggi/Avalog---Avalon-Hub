// Tipi per sqlite, usati solo in sviluppo locale
export type SqlValue = string | number | null | Uint8Array;
export type SqlRow = SqlValue[];

export interface QueryExecResult {
  columns: string[];
  values: SqlRow[];
}
