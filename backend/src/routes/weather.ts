import { Router, Request, Response } from 'express';
import { getWindyWeather, getWindyForecast } from '../services/windyService.js';

const router = Router();

// GET /api/weather/current?lat=latitude&lon=longitude
router.get('/current', async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({
        error: 'Parámetros lat y lon requeridos'
      });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({
        error: 'Coordenadas inválidas'
      });
      return;
    }

    const weather = await getWindyWeather(latitude, longitude);

    res.json({
      success: true,
      data: weather,
      location: { latitude, longitude }
    });
  } catch (error) {
    console.error('Error in weather/current:', error);
    res.status(500).json({
      error: 'Error al obtener datos del clima'
    });
  }
});

// GET /api/weather/forecast?lat=latitude&lon=longitude&hours=24
router.get('/forecast', async (req: Request, res: Response) => {
  try {
    const { lat, lon, hours } = req.query;

    if (!lat || !lon) {
      res.status(400).json({
        error: 'Parámetros lat y lon requeridos'
      });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);
    const forecastHours = Math.min(parseInt(hours as string) || 24, 168); // Max 7 días

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({
        error: 'Coordenadas inválidas'
      });
      return;
    }

    const forecast = await getWindyForecast(latitude, longitude, forecastHours);

    res.json({
      success: true,
      data: forecast,
      location: { latitude, longitude },
      hours: forecastHours
    });
  } catch (error) {
    console.error('Error in weather/forecast:', error);
    res.status(500).json({
      error: 'Error al obtener pronóstico del clima'
    });
  }
});

export default router;
