using HotChocolate.Types.Relay;
using System.Reflection.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace GraphQLWeather.API.models
{
    public class ForecastWeather
    {
        public WeatherForDay Today { get; set; }
        public WeatherForDay FirstDay { get; set; }
        public WeatherForDay SecondDay { get; set; }
        public WeatherForDay ThirdDay { get; set; }

        public ForecastWeather(List<WeatherForecastResponse> forecasts)
        {
            Dictionary< DateTime, List<WeatherForecastResponse>> groupedByDate = forecasts.GroupBy(wf => UnixTimeStampToDateTime(wf.Dt).Date)
                                     .ToDictionary(g => g.Key, g => g.ToList());

            List<DateTime> firstFourDates = groupedByDate.Keys.OrderBy(date => date).Take(4).ToList();
            Today = new WeatherForDay(firstFourDates[0], groupedByDate[firstFourDates[0]]);
            FirstDay = new WeatherForDay(firstFourDates[1], groupedByDate[firstFourDates[1]]);
            SecondDay = new WeatherForDay(firstFourDates[2], groupedByDate[firstFourDates[2]]);
            ThirdDay = new WeatherForDay(firstFourDates[3], groupedByDate[firstFourDates[3]]);
        }

        public static DateTime UnixTimeStampToDateTime(long unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(unixTimeStamp);
            return dateTimeOffset.DateTime;
        }
    }

    public class WeatherForDay
    {
        private DateTime Datum { get; set; }
        public string WeekDay { get; set; }
        public double MinTemperature { get; set; }
        public double MaxTemperature { get; set; }

        public string Description { get; set; }

        public WeatherForDay(DateTime datum, List<WeatherForecastResponse> forecasts)
        {
            Datum = datum;
            WeekDay = Datum.DayOfWeek.ToString();
            MinTemperature = Math.Round(forecasts.Min(wf => wf.Main.TempMin));
            MaxTemperature = Math.Round(forecasts.Max(wf => wf.Main.TempMax));
            Description = forecasts.Select(wf => wf.Weather[0].Main)
                                    .GroupBy(main => main)
                                    .OrderByDescending(group => group.Count())
                                    .First()
                                    .Key;
        }

    }
}
