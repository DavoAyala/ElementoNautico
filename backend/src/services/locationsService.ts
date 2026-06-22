import axios from 'axios';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  region?: string;
  type: 'harbor' | 'coast' | 'ocean';
}

const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

export const searchLocation = async (query: string): Promise<Location[]> => {
  try {
    const response = await axios.get(`${NOMINATIM_API}/search`, {
      params: {
        q: query,
        format: 'json',
        limit: 10,
        addressdetails: 1
      }
    });

    return response.data.map((item: any, index: number) => ({
      id: `${item.lat}-${item.lon}`,
      name: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      country: item.address?.country,
      region: item.address?.state || item.address?.province,
      type: determineLocationType(item.type, item.class)
    }));
  } catch (error) {
    console.error('Error searching location:', error);
    return [];
  }
};

export const getLocationByCoordinates = async (
  latitude: number,
  longitude: number
): Promise<Location | null> => {
  try {
    const response = await axios.get(`${NOMINATIM_API}/reverse`, {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
        addressdetails: 1
      }
    });

    if (response.data) {
      return {
        id: `${latitude}-${longitude}`,
        name: response.data.display_name,
        latitude,
        longitude,
        country: response.data.address?.country,
        region: response.data.address?.state,
        type: determineLocationType(response.data.type, response.data.class)
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

function determineLocationType(
  type: string,
  classification: string
): 'harbor' | 'coast' | 'ocean' {
  if (
    classification === 'amenity' ||
    classification === 'port' ||
    type.includes('harbor')
  ) {
    return 'harbor';
  }
  if (classification === 'natural' || type.includes('coast')) {
    return 'coast';
  }
  return 'ocean';
}
