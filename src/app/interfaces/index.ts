export interface User {
  email: string;
  password: string;
  token: string;
}

export interface UserData {
  datetime: Date;
  date?: Date;
  month?: number;
  day?: number;
  year?: number;
  time?: string;
  mealType?: string;
  sys: number;
  sysExcess?: number;
  dias: number;
  diaExcess?: number;
  bpDelta: number;
  pulse: number;
  user: string;
}

export const CHART_TIMEOUT_SECONDS: number = 5;

export const KEY_USER_TOKEN = 'USER_TOKEN';
