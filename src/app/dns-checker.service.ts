import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

export interface DnsStatus {
  id: string,
  country: string,
  ips: string,
  latitude: string,
  longitude: string,
  location: string,
  status: string,
}

@Injectable({
  providedIn: 'root'
})
export class DnsCheckerService {

  constructor(private readonly httpClient: HttpClient) { }

  getDnsStatus(params: any) {
    //https://mocki.io/v1/a19f2d45-46d2-48e3-a1a4-bfe82612468c
    
    return this.httpClient.get<DnsStatus[]>('https://mocki.io/v1/2c852f38-ff52-4806-97f7-95895ad786a7'+params);
  }

  loadMapsApi() {
    return this.httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=yourapikey', 'callback').pipe(
          map(() => true),
          catchError(() => of(false)));
  }

}
