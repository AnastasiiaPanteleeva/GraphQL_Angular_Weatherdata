import { createAction, props } from '@ngrx/store';


export const loadCities = createAction('[Cities] Load Cities');

export const loadCitiesSuccess = createAction(
  '[Cities] Cities Load Success',
  props<{ cities: any[] }>()
);

export const loadCitiesFailure = createAction(
  '[Cities] Cities Load Failure',
  props<{ error: any }>()
);
