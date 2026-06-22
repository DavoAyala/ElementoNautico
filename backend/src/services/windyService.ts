import axios from 'axios';

interface WindyWeatherData {
  wind: {
    speed: number;
    direction: number;
    gust: number;
  };
  waveHeight: number;
  waveDirection: number;
  temperature: number;
  pressure: number;
  precipitation: number;
  timestamp: Date;
}

const WINDY_API_URL = 'https://api.windy.com/api/v4/point';

export const getWindyWeather = async (
  latitude: number,
  longitude: number
): Promise<WindyWeatherData | null> => {
  try {
    if (!process.env.WINDY_API_KEY) {
      throw new Error('WINDY_API_KEY no configurada');
    }

    const response = await axios.get(WINDY_API_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        model: 'gfs',
        parameters: 'wind,waveHeight,waveDirection,temp,pressure,precip',
        key: process.env.WINDY_API_KEY,
        format: 'json'
      }
    });

    if (response.data && response.data.data) {
      const data = response.data.data;
      return {
        wind: {
          speed: data.wind?.[0]?.[0] || 0,
          direction: data.wind?.[0]?.[1] || 0,
          gust: data.gust?.[0] || 0
        },
        waveHeight: data.waveHeight?.[0] || 0,
        waveDirection: data.waveDirection?.[0] || 0,
        temperature: data.temp?.[0] || 0,
        pressure: data.pressure?.[0] || 0,
        precipitation: data.precip?.[0] || 0,
        timestamp: new Date()
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching Windy weather:', error);
    throw error;
  }
};

export const getWindyForecast = async (
  latitude: number,
  longitude: number,
  hours: number = 24
): Promise<WindyWeatherData[]> => {
  try {
    if (!process.env.WINDY_API_KEY) {
      throw new Error('WINDY_API_KEY no configurada');
    }

    const response = await axios.get(WINDY_API_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        model: 'gfs',
        parameters: 'wind,waveHeight,waveDirection,temp,pressure',
        key: process.env.WINDY_API_KEY,
        format: 'json'
      }
    });

    const forecasts: WindyWeatherData[] = [];

    if (response.data && response.data.data) {
      const data = response.data.data;
      const timestamps = data.ts || [];

      for (let i = 0; i < Math.min(hours, timestamps.length); i++) {
        forecasts.push({
          wind: {
            speed: data.wind?.[i]?.[0] || 0,
            direction: data.wind?.[i]?.[1] || 0,
            gust: data.gust?.[i] || 0
          },
          waveHeight: data.waveHeight?.[i] || 0,
          waveDirection: data.waveDirection?.[i] || 0,
          temperature: data.temp?.[i] || 0,
          pressure: data.pressure?.[i] || 0,
          precipitation: data.precip?.[i] || 0,
          timestamp: new Date(timestamps[i] * 1000)
        });
      }
    }

    return forecasts;
  } catch (error) {
    console.error('Error fetching Windy forecast:', error);
    throw error;
  }
};
