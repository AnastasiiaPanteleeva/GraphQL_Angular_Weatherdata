using GraphQLWeather.API.models;
using GraphQLWeather.API.schema;

namespace GraphQLWeather.API
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.WithOrigins("http://localhost:4200")
                                      .AllowAnyHeader()
                                      .AllowAnyMethod());
            });

            services.AddSingleton<ICityRepository, CityRepository> ();
            services.AddControllers();

            services.AddHttpClient("rest", c => c.BaseAddress = new Uri("https://api.openweathermap.org/data/2.5/"));

            services.AddGraphQLServer()
                    .AddQueryType<Query>()
                    .AddTypeExtension<CityExtensions>()
                    .InitializeOnStartup();
            //.AddJsonSupport

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("AllowSpecificOrigin");

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGraphQL();
            });
        }
    }
}
