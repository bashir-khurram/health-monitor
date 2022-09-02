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

export const CHART_COLORS = {
  red: {
    bkgrndColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)'
  },
  blue: {
    bkgrndColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgba(54, 162, 235, 1)'
  },
  yellow: {
    bkgrndColor: 'rgba(255, 206, 86, 0.2)',
    borderColor: 'rgba(255, 206, 86, 1)'
  },
  green: {
    bkgrndColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)'
  },
  purple: {
    bkgrndColor: 'rgba(153, 102, 255, 0.2)',
    borderColor: 'rgba(153, 102, 255, 1)'
  },
  orange: {
    bkgrndColor: 'rgba(255, 159, 64, 0.2)',
    borderColor: 'rgba(255, 159, 64, 1)'
  }
}
