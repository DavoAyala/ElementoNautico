import axios from 'axios';

interface TideData {
  time: Date;
  height: number;
  type: 'H' | 'L'; // High or Low
}

interface TideResponse {
  current: {
    height: number;
    direction: 'rising' | 'falling';
  };
  predictions: TideData[];
}

const TIDE_API_URL = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';

export const getTideData = async (
  latitude: number,
  longitude: number,
  days: number = 1
): Promise<TideResponse> => {
  try {
    // Buscar estación de mareas más cercana
    const stationResponse = await axios.get(
      'https://api.tidesandcurrents.noaa.gov/api/prod/stations.json',
      {
        params: {
          lat_min: latitude - 1,
          lat_max: latitude + 1,
          lon_min: longitude - 1,
          lon_max: longitude + 1,
          type: 'tidal_current'
        }
      }
    );

    if (!stationResponse.data.stations || stationResponse.data.stations.length === 0) {
      return {
        current: { height: 0, direction: 'falling' },
        predictions: []
      };
    }

    const station = stationResponse.data.stations[0];
    const stationId = station.id;

    // Obtener predicciones de mareas
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const predictionsResponse = await axios.get(TIDE_API_URL, {
      params: {
        station: stationId,
        begin_date: formatDate(startDate),
        end_date: formatDate(endDate),
        product: 'predictions',
        datum: 'MLLW',
        units: 'metric',
        time_zone: 'gmt',
        format: 'json',
        application: 'ElementoNautico'
      }
    });

    const predictions: TideData[] = [];
    if (predictionsResponse.data.predictions) {
      predictions.push(
        ...predictionsResponse.data.predictions.map((pred: any) => ({
          time: new Date(pred.t),
          height: parseFloat(pred.v),
          type: pred.type === 'H' ? 'H' : 'L'
        }))
      );
    }

    // Obtener altura actual
    const waterlevelResponse = await axios.get(TIDE_API_URL, {
      params: {
        station: stationId,
        begin_date: formatDate(new Date(Date.now() - 60 * 60 * 1000)),
        end_date: formatDate(new Date()),
        product: 'water_level',
        datum: 'MLLW',
        units: 'metric',
        time_zone: 'gmt',
        format: 'json',
        application: 'ElementoNautico'
      }
    });

    let currentHeight = 0;
    let direction: 'rising' | 'falling' = 'falling';

    if (waterlevelResponse.data.data && waterlevelResponse.data.data.length > 1) {
      const lastReading = waterlevelResponse.data.data[waterlevelResponse.data.data.length - 1];
      const prevReading = waterlevelResponse.data.data[waterlevelResponse.data.data.length - 2];
      
      currentHeight = parseFloat(lastReading.v);
      direction = parseFloat(lastReading.v) > parseFloat(prevReading.v) ? 'rising' : 'falling';
    }

    return {
      current: {
        height: currentHeight,
        direction
      },
      predictions
    };
  } catch (error) {
    console.error('Error fetching tide data:', error);
    return {
      current: { height: 0, direction: 'falling' },
      predictions: []
    };
  }
};

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0].replace(/-/g, '');
}
