import { createSelector, MemoizedSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { CitiesState } from './cities.reducer';

export const selectCities = (state: AppState) => state.cities;

export const selectAllCities = createSelector(
  selectCities,
  (state: CitiesState) => state.cities
);
