import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointsService } from '../core/services/endpoints/endpoints.service';
import { Observable } from 'rxjs';
import { Imovel } from '../models/imoveis/imoveis';


@Injectable({ providedIn: 'root' })
export class ImovelService {
    constructor(
        private http: HttpClient,
        private endpointsService: EndpointsService
    ) { }

    public get(pesquisar: string = null): Observable<Imovel[]> {

        const url = `${this.endpointsService.getServerUrl()}api/v1/imovel/?pesquisa=${pesquisar}`
        return this.http.get<Imovel[]>(url);
    }

    public getById(id: string = null): Observable<Imovel> {

        const url = `${this.endpointsService.getServerUrl()}api/v1/imovel/${id}`
        return this.http.get<Imovel>(url);
    }

    public add(imovel: Imovel): Observable<Imovel> {

        const url = `${this.endpointsService.getServerUrl()}api/v1/imovel/`
        return this.http.post<Imovel>(url, imovel);
    }

    public update(imovel: Imovel): Observable<Imovel> {
        
        const url = `${this.endpointsService.getServerUrl()}api/v1/imovel/${imovel.id}`;
        return this.http.put<Imovel>(url, imovel);
    }

    public delete(id: string): Observable<any> {            
        const url = `${this.endpointsService.getServerUrl()}api/v1/imovel/${id}`;
        return this.http.delete<any>(url);
    }
}