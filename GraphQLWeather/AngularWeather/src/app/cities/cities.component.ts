import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_CITIES } from '../graphql.operations';
import { Store } from '@ngrx/store';
import { loadCities } from '../state/cities/cities.actions';
import { selectAllCities } from '../state/cities/citites.selectors';
import { AppState } from '../state/app.state'


@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css'
})
export class CitiesComponent implements OnInit {
  public cities$ = this.store.select(selectAllCities);
  public error: any;

  constructor(private apollo: Apollo, private store: Store<AppState>)
  {
  }

  ngOnInit() {
    this.store.dispatch(loadCities());

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

}
