using System.Diagnostics.Eventing.Reader;
using System.Net.Http;
using System.Threading;
using GraphQLWeather.API.models;
using Newtonsoft.Json.Linq;

namespace GraphQLWeather.API
{
    public sealed class CityRepository : ICityRepository
    {
        private readonly Dictionary<string, CityType> _cities = new()
        {
            ["Bielefeld"] = new CityType { Name = "Bielefeld", Latitude = 52.02, Longitude = 8.53 },
            ["Cologne"] = new CityType { Name = "Cologne", Latitude = 50.94, Longitude = 6.95 },
            ["Aachen"] = new CityType { Name = "Aachen", Latitude = 50.78, Longitude = 6.08 },
            ["Berlin"] = new CityType { Name = "Berlin", Latitude = 52.52, Longitude = 13.40 },
            ["Munich"] = new CityType { Name = "Munich", Latitude = 48.14, Longitude = 11.58 }
        };

        private readonly ILogger<CityRepository> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        //public City? GetByName(string name)
        //    => _cities.TryGetValue(name, out var city) ? city : null;
        public CityRepository(IHttpClientFactory httpClientFactory, ILogger<CityRepository> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<CityType?> GetCityByPostalCode(string postalCode)
        {
            string countryCode = "DE";
            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync($"http://api.zippopotam.us/{countryCode}/{postalCode}");

            if (!response.IsSuccessStatusCode)
            {
                var errorMessage = $"Postal code request: {response.StatusCode} ({response.ReasonPhrase})";
                _logger.LogError(errorMessage);
                throw new HttpRequestException(errorMessage);
            }

            var content = await response.Content.ReadAsStringAsync();
            var json = JObject.Parse(content);

            var cityName = json["places"]?[0]?["place name"]?.ToString();

            if (cityName == null)
            {
                _logger.LogWarning("City name not found in response for postal code {PostalCode}.", postalCode);
                return null;
            }
            else
            {
                _logger.LogInformation($"The request postal code data has been successfully received.");
                return GetByName(cityName);
            }
        }

        public CityType? GetByName(string name)
        {

            if (_cities.TryGetValue(name, out var city))
            {
                _logger.LogInformation($"The city {city.Name} was successfully found.");
                return city;
            }
            else
            {
                var newCity = this.AddCity(name);
                return newCity;
            }
        }

        public IEnumerable<CityType> GetAllCities() => _cities.Values;

        public CityType AddCity(string name)
        {
            CityType newCity = new CityType { Name = name };
            _cities[name] = newCity;
            _logger.LogInformation($"The city {newCity.Name} was successfully added to the list.");
            return newCity;
        }
        public void UpdateCity(CityType city)
        {
            if (_cities.TryGetValue(city.Name, out var existingCity))
            {
                existingCity.Name = city.Name;
                existingCity.Latitude = city.Latitude;
                existingCity.Longitude = city.Longitude;
            }
        }
        public void DeleteCity(string name)
        {
            _cities.Remove(name);
        }

    }
}
