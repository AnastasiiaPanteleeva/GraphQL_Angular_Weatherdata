using System.Text.Json;

namespace GraphQLWeather.API.models
{
    public class CityType
    {
        public string Name { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }

        public void SetCoordinates(double latitude, double longitude)
        {
            Latitude = Math.Round(latitude, 2);
            Longitude = Math.Round(longitude, 2);
        }

    }

    

}
