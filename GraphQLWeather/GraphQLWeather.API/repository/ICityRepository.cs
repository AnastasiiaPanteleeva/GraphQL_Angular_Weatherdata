using GraphQLWeather.API.models;

namespace GraphQLWeather.API
{
    public interface ICityRepository
    {
        IEnumerable<CityType> GetAllCities();
        CityType? GetByName(string name);
        Task<CityType?> GetCityByPostalCode(string postalCode);
        CityType AddCity(string name);
        void UpdateCity(CityType city);
        void DeleteCity(string name);
    }
}
