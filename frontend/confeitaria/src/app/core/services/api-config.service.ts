
import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ATIVA, API_URLS } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class ApiConfigService {

    getBaseUrl(): string {
        return API_URLS[API_ATIVA];
    }

    getApiTipo(): 'manual' | 'spring' {
        return API_ATIVA;
    }

    getUrlImagemProduto(imagem: string): string {
        if (!imagem) return '';
        if (imagem.startsWith('http')) return imagem;
        if (imagem.startsWith('/')) return `${this.getBaseUrl()}${imagem}`;
        return `${this.getBaseUrl()}/images/${imagem}`;
    }

    getUrlImagemCategoria(imagem: string): string {
        return this.getUrlImagemProduto(imagem);
    }
}

export function apiInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const apiConfig = inject(ApiConfigService);

    if (req.url.startsWith('http')) {
        return next(req);
    }

    const separador = req.url.startsWith('/') ? '' : '/';
    const apiReq = req.clone({
        url: `${apiConfig.getBaseUrl()}${separador}${req.url}`
    });

    return next(apiReq);
}
