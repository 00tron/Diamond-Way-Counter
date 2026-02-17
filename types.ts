
export interface MantraSession {
  id: string;
  timestamp: number;
  count: number;
  mantraName: string;
}

export interface UserProgress {
  totalCount: number;
  sessions: MantraSession[];
  activeMantra: string;
}

export enum SessionTarget {
  MALAS_27 = 27,
  MALAS_54 = 54,
  MALAS_108 = 108,
  CUSTOM = 0
}
