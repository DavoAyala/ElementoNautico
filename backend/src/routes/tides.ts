import { Router, Request, Response } from 'express';
import { getTideData } from '../services/tideService.js';

const router = Router();

// GET /api/tides/current?lat=latitude&lon=longitude
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

    const tideData = await getTideData(latitude, longitude, 1);

    res.json({
      success: true,
      data: tideData,
      location: { latitude, longitude }
    });
  } catch (error) {
    console.error('Error in tides/current:', error);
    res.status(500).json({
      error: 'Error al obtener datos de mareas'
    });
  }
});

// GET /api/tides/prediction?lat=latitude&lon=longitude&days=7
router.get('/prediction', async (req: Request, res: Response) => {
  try {
    const { lat, lon, days } = req.query;

    if (!lat || !lon) {
      res.status(400).json({
        error: 'Parámetros lat y lon requeridos'
      });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);
    const daysToForecast = Math.min(parseInt(days as string) || 7, 30); // Max 30 días

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({
        error: 'Coordenadas inválidas'
      });
      return;
    }

    const tideData = await getTideData(latitude, longitude, daysToForecast);

    res.json({
      success: true,
      data: tideData,
      location: { latitude, longitude },
      days: daysToForecast
    });
  } catch (error) {
    console.error('Error in tides/prediction:', error);
    res.status(500).json({
      error: 'Error al obtener predicción de mareas'
    });
  }
});

export default router;
