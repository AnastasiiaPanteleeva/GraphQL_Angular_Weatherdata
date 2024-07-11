import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_CITIES } from '../graphql.operations';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CitiesService {
  constructor(private apollo: Apollo) { }

  getCities(): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_CITIES
    }).valueChanges.pipe(
      map(({ data, errors }: any) => {
        if (errors) {
          console.error('Error:', errors);
          throw new Error(errors);
        }
        return data ? data.cities : [];
      })
    );
  }
}

//ngOnInit(): void {
//  this.apollo.watchQuery({
//    query: GET_CITIES
//  }).valueChanges.subscribe(({ data, errors }: any) => {
//    console.log('Data:', data);
//    console.log('Error:', errors);
//    this.cities = data ? data.cities : [];
//    this.error = errors;
//  });
//}
