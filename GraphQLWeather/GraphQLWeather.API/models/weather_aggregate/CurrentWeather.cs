namespace GraphQLWeather.API.models
{
    public class CurrentWeather
    {
        public double Temperature { get; set; }

        public string Description { get; set; }

        public CurrentWeather(CurrentWeatherResponse currentWeatherResponse)
        {
            Temperature = Math.Round(currentWeatherResponse.Main.Temp, 1);
            Description = currentWeatherResponse.Weather[0].Description;
        }
    }
}
