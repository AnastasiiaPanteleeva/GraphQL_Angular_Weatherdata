import { gql } from 'apollo-angular'

const GET_CITIES = gql`
    query GetCities {
        cities {
            latitude
            longitude
            name
            weather {
              temperature
              description
            }
   }
  }
`

const GET_WEATHER_BY_CITYNAME = gql`
    query GetWeatherByCityname($cityname: String!) {
        cityByName(name: $cityname) {
            weather {
              temperature
              description
            }
            name
            forecastWeather {
              firstDay {
                description
                maxTemperature
                minTemperature
                weekDay
                }
              secondDay {
                description
                maxTemperature
                minTemperature
                weekDay
                }
              thirdDay {
                description
                maxTemperature
                minTemperature
                weekDay
                }
              today {
                description
                maxTemperature
                minTemperature
                weekDay
                }
              }

        }
  }
`

const GET_WEATHER_BY_POSTAL_CODE = gql`
    query GetWeatherByPostalCode($postalCode: String!) {
        cityByPostalCode(postalCode: $postalCode) {
            weather {
              temperature
              description
            }
            name
            forecastWeather {
              firstDay {
                description
                maxTemperature
                minTemperature
                weekDay
                }
              secondDay {
                description
                maxTemperature
                minTemperature
                weekDay
                }
              thirdDay {
                description
                maxTemperature
                minTemperature
                weekDay
                }
              today {
                description
                maxTemperature
                minTemperature
                weekDay
                }
              }

        }
  }
`


export { GET_CITIES, GET_WEATHER_BY_CITYNAME, GET_WEATHER_BY_POSTAL_CODE };
