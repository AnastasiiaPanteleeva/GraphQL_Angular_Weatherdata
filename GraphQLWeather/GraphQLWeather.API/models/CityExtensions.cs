using System.Text.Json;

namespace GraphQLWeather.API.models
{
    [ExtendObjectType<CityType>]
    public class CityExtensions
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<CityExtensions> _logger;

        public CityExtensions(IConfiguration configuration, ILogger<CityExtensions> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<CurrentWeather> GetWeatherAsync(
            [Parent] CityType city,
            [Service] IHttpClientFactory clientFactory,
            CancellationToken cancellationToken)
        {

            var key = _configuration["OpenWeatherMap:ApiKey"];
            var requestUri = $"weather?q={city.Name}&appid={key}&units=metric";

            var currentResponse = await FetchWeatherDataAsync<CurrentWeatherResponse>(
                requestUri,
                "Current weather",
                clientFactory,
                cancellationToken);

            if (city.Longitude == 0 || city.Latitude == 0)
            {
                city.SetCoordinates(currentResponse.Coord.Lat, currentResponse.Coord.Lon);
            }

            return new CurrentWeather(currentResponse);
        }


        public async Task<ForecastWeather> GetForecastWeatherAsync(
            [Parent] CityType city,
            [Service] IHttpClientFactory clientFactory,
            CancellationToken cancellationToken)
        {
            var key = _configuration["OpenWeatherMap:ApiKey"];
            var requestUri = $"forecast?q={city.Name}&appid={key}&units=metric";

            var forecastResponse = await FetchWeatherDataAsync<ForecastResponse>(
                requestUri,
                "Forecast weather",
                clientFactory,
                cancellationToken);

            return new ForecastWeather(forecastResponse.List);
        }


        private async Task<T> FetchWeatherDataAsync<T>(
            string requestUri,
            string requestName,
            IHttpClientFactory clientFactory,
            CancellationToken cancellationToken)
        {
            try
            {
                using var client = clientFactory.CreateClient("rest");
                var response = await client.GetAsync(requestUri, cancellationToken);

                if (!response.IsSuccessStatusCode)
                {
                    var errorMessage = $"{requestName} failed: {response.StatusCode} ({response.ReasonPhrase})";
                    _logger.LogError(errorMessage);
                    throw new HttpRequestException(errorMessage);
                }

                var content = await response.Content.ReadAsStringAsync(cancellationToken);

                var result = JsonSerializer.Deserialize<T>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (result == null)
                {
                    var errorMessage = "Deserialization returned null.";
                    _logger.LogError(errorMessage);
                    throw new InvalidOperationException(errorMessage);
                }

                _logger.LogInformation($"The request {requestName} data has been successfully received.");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching weather data.");
                throw;
            }
        }
    }
}
