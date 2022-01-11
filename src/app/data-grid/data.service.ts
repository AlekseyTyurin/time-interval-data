import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Range } from './data-grid.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private _http: HttpClient) { }


  getAllData(){
    return <Observable<Range[]>>this._http.get('./assets/mock-data/MOCK_DATA.json')
  }
}
