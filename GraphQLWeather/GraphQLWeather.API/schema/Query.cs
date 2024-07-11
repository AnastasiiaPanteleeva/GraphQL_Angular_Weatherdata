using GraphQLWeather.API.models;
using System.Diagnostics.Eventing.Reader;

namespace GraphQLWeather.API.schema
{
    public class Query
    {
        public CityType? GetCityByName(string name, [Service] ICityRepository repository)
            => repository.GetByName(name);

        public IEnumerable<CityType> GetCities([Service] ICityRepository repository)
            => repository.GetAllCities();

        public async Task<CityType?> GetCityByPostalCode(
        [Service] ICityRepository repository,
        string postalCode)
        {
            return await repository.GetCityByPostalCode(postalCode);
        }
    }
}
