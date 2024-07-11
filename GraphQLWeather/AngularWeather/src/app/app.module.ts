import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { CitiesComponent } from './cities/cities.component';
import { WeatherComponent } from './weather/weather.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { citiesReducer } from './state/cities/cities.reducer';
import { CitiesEffects } from './state/cities/cities.effects'

@NgModule({
  declarations: [
    AppComponent,
    CitiesComponent,
    WeatherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GraphQLModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ cities: citiesReducer }),
    EffectsModule.forRoot([CitiesEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }) 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
