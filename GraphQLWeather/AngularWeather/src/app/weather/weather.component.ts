import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { GET_WEATHER_BY_CITYNAME, GET_WEATHER_BY_POSTAL_CODE } from '../graphql.operations';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  weather_by_city: any;
  errors: any;
  error_message: any;

  searchForm = new FormGroup({
    cityname: new FormControl('', Validators.required),
  });

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.loadWeather("Bielefeld");
  }

  searchWeather() {
    const cityname = this.searchForm.value.cityname;
    if (cityname) {
      const postalCodeNumber = parseInt(cityname, 10);
      if (!isNaN(postalCodeNumber))
      {
        if (postalCodeNumber >= 1067 && postalCodeNumber <= 99998) {
          this.clearError();
          this.loadWeatherByPostalCode(cityname);
        }
        else {
          this.setError("The German postal code must be between 01067 and 99998");
        }
      }
      else
      {
        const validationResult = this.validateCityName(cityname);
        if (validationResult.valid) {
          this.clearError();
          this.loadWeather(cityname);
        } else {
          this.setError(validationResult.error);
        }
      }
    }
    this.searchForm.reset();
  }


  validateCityName(cityName: string): { valid: boolean, error: string | null } {
    const cityNameRegex = /^[a-zA-Z\s'-À-ÖØ-öø-ÿ]+$/;
    if (!cityName.trim()) {
      return { valid: false, error: "City name cannot be empty or just spaces." };
    }
    if (cityName.length < 2 || cityName.length > 100) {
      return { valid: false, error: "City name must be between 2 and 100 characters long." };
    }
    if (!cityNameRegex.test(cityName)) {
      return { valid: false, error: "City name contains invalid characters." };
    }
    if (/([a-zA-ZÀ-ÖØ-öø-ÿ])\1{2,}/.test(cityName)) {
      return { valid: false, error: "City name contains too many repeating characters." };
    }
    return { valid: true, error: null };
}

  loadWeatherByPostalCode(postalCode: string): void {
    this.apollo.query({
      query: GET_WEATHER_BY_POSTAL_CODE,
      variables: { postalCode }
    }).subscribe(
      ({ data, errors }: any) => {
        if (data) {
          this.weather_by_city = data.cityByPostalCode;
          console.log('Weather data:', this.weather_by_city);
        }
        if (errors) {
          this.handleGraphQLErrors(errors)
        }
      },
      (errors) => {
        this.handleGraphQLErrors(errors)

      }
    );
  }
 

 

  loadWeather(cityname: string): void {
    this.apollo.query({
      query: GET_WEATHER_BY_CITYNAME,
      variables: { cityname }
    }).subscribe(
      ({ data, errors }: any) => {
        if (data) {
          this.weather_by_city = data.cityByName;
          console.log('Weather data:', this.weather_by_city);
        }
        if (errors) {
          this.handleGraphQLErrors(errors)
        }
      },
      (errors) => {
        this.errors = errors;
        this.handleGraphQLErrors(errors)
      }
    );
  }

  handleGraphQLErrors(errors: any): void {
    if (errors && errors.graphQLErrors.length > 0) {
      const messages = errors.graphQLErrors.map((error: any) => {
        if (error.extensions && error.extensions.message) {
          return error.extensions.message;
        } else {
          return null;
        }
      }).filter((message: string | null): message is string => message !== null);

      const combinedMessages = messages.length > 0
        ? messages.join('<br>')
        : 'GraphQL errors' + errors.graphQLErrors[0].message;

      this.setError(combinedMessages);
      console.error('GraphQL errors:', errors);
    }
  }

  setError(message: string | null): void {
    this.error_message = message;
  }

  clearError(): void {
    this.error_message = null;
  }
}
