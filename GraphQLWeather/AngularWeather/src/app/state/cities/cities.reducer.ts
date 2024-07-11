import { createReducer, on } from '@ngrx/store';
import {
  loadCities,
  loadCitiesSuccess,
  loadCitiesFailure,
} from './cities.actions';

export interface CitiesState {
  cities: any[];
  error: any;
  status: string;
}

export const initialState: CitiesState = {
  cities: [],
  error: null,
  status: 'pending',
};

export const citiesReducer = createReducer(
  // Supply the initial state
  initialState,
  // Trigger loading the cities
  on(loadCities, (state) => ({ ...state, status: 'loading' })),
  // Handle successfully loaded cities
  on(loadCitiesSuccess, (state, {cities}) => ({
    ...state,
    cities: cities,
    error: null,
    status: 'success',
  })),
  // Handle cities load failure
  on(loadCitiesFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: 'error',
  }))
);
