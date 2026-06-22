import { Router, Request, Response } from 'express';
import { searchLocation, getLocationByCoordinates } from '../services/locationsService.js';

const router = Router();

// GET /api/locations/search?q=query
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({
        error: 'Parámetro q (query) requerido'
      });
      return;
    }

    const locations = await searchLocation(q);

    res.json({
      success: true,
      data: locations,
      count: locations.length
    });
  } catch (error) {
    console.error('Error in locations/search:', error);
    res.status(500).json({
      error: 'Error al buscar ubicaciones'
    });
  }
});

// GET /api/locations/reverse?lat=latitude&lon=longitude
router.get('/reverse', async (req: Request, res: Response) => {
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

    const location = await getLocationByCoordinates(latitude, longitude);

    if (!location) {
      res.status(404).json({
        error: 'Ubicación no encontrada'
      });
      return;
    }

    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Error in locations/reverse:', error);
    res.status(500).json({
      error: 'Error al obtener ubicación'
    });
  }
});

export default router;
