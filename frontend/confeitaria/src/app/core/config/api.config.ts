
export type ApiTipo = 'manual' | 'spring';

export const API_ATIVA: ApiTipo = 'spring';

export const API_URLS: Record<ApiTipo, string> = {
    manual: 'http://localhost:3000',
    // spring: 'http://localhost:8080'
    spring: 'https://confeitaria-backend-zzm3.onrender.com'
};
