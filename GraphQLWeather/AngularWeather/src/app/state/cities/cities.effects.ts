import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadCities,
  loadCitiesSuccess,
  loadCitiesFailure,
} from './cities.actions';
import { CitiesService } from '../../cities/cities.service';
import { of, from } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectAllCities } from './citites.selectors';
import { AppState } from '../app.state';

@Injectable()
export class CitiesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private citiesService: CitiesService
  ) { }

  // Run this code when a loadCities action is dispatched
  loadCities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCities),
      switchMap(() =>
        // Call the getCities method, convert it to an observable
        from(this.citiesService.getCities()).pipe(
          // Take the returned value and return a new success action containing the cities
          map((cities) => loadCitiesSuccess({ cities: cities })),
          // Or... if it errors return a new failure action containing the error
          catchError((error) => of(loadCitiesFailure({ error })))
        )
      )
    )
  );
}
