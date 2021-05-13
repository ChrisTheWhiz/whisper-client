import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NewStationForm, Song, Station} from '../../interfaces/mount';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiCommService {

  constructor(private httpClient: HttpClient) {
  }

  startNewStation(newStationForm: NewStationForm): Observable<Station> {
    let params = new HttpParams();
    if (newStationForm.query) {
      params = params.append('query', newStationForm.query);
    }
    params = params.append('name', newStationForm.stationName);
    params = params.append('mount', newStationForm.mount);
    params = params.append('genre', newStationForm.genre);
    params = params.append('description', newStationForm.description);
    return this.httpClient.post<any>(environment.apiBaseUrl + '/station/', null, {params})
      .pipe(
        map(response => response.data)
      );
  }

  getStationCurrentSong(stationName: string): Observable<Song> {
    let params = new HttpParams();
    params = params.append('name', stationName);
    return this.httpClient.get<{ status: string, data: Song }>(environment.apiBaseUrl + '/queue/current', {params})
      .pipe(
        map(response => response.data)
      );
  }

  stationSkipSong(stationName: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('name', stationName);
    return this.httpClient.patch<{ status: string, data: Song }>(environment.apiBaseUrl + '/station/skip', null, {params});
  }

  getStationQueue(stationName: string): Observable<Song[]> {
    let params = new HttpParams();
    params = params.append('name', stationName);
    // page_size = 0 means no paging, return all songs in queue
    params = params.append('page_size', '0');
    return this.httpClient.get<{ status: string, data: Song[] }>(environment.apiBaseUrl + '/queue/', {params})
      .pipe(
        map(response => response.data)
      );
  }

  addToStationQueue(stationName: string, query: string = ''): Observable<any> {
    let params = new HttpParams();
    params = params.append('name', stationName);
    if (query !== '') {
      params = params.append('query', query);
    }
    return this.httpClient.put<any>(environment.apiBaseUrl + '/queue/', null, {params});
  }

  clearStationQueue(stationName: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('name', stationName);
    return this.httpClient.delete<any>(environment.apiBaseUrl + '/queue/', {params});
  }

  removeStation(stationName: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('name', stationName);
    return this.httpClient.delete<any>(environment.apiBaseUrl + '/station/', {params});
  }
}
