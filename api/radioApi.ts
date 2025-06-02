export interface RadioStation {
  changeuuid: string;
  stationuuid: string;
  serveruuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  votes: number;
  lastchangetime: string;
  lastchangetime_iso8601: string;
  codec: string;
  bitrate: number;
  hls: number;
  lastcheckok: number;
  lastchecktime: string;
  lastchecktime_iso8601: string;
  lastcheckoktime: string;
  lastcheckoktime_iso8601: string;
  lastlocalchecktime: string;
  lastlocalchecktime_iso8601: string;
  clicktimestamp: string;
  clicktimestamp_iso8601: string;
  clickcount: number;
  clicktrend: number;
  ssl_error: number;
  geo_lat: number;
  geo_long: number;
  has_extended_info: boolean;
}

const API_BASE = 'https://de1.api.radio-browser.info/json';

/**
 * Fetch radio stations by country
 */
export const fetchRadioStations = async (country: string): Promise<RadioStation[]> => {
  try {
    const response = await fetch(`${API_BASE}/stations/bycountry/${country}?hidebroken=true&limit=100`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching radio stations:', error);
    return [];
  }
};

/**
 * Search radio stations by query
 */
export const searchRadioStations = async (query: string): Promise<RadioStation[]> => {
  try {
    const response = await fetch(
      `${API_BASE}/stations/search?name=${encodeURIComponent(query)}&limit=30&hidebroken=true`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching radio stations:', error);
    return [];
  }
};

/**
 * Fetch trending stations based on category
 */
export const fetchTrendingStations = async (
  category: 'votes' | 'clicks' | 'recent'
): Promise<RadioStation[]> => {
  try {
    let endpoint;
    
    switch (category) {
      case 'votes':
        endpoint = `${API_BASE}/stations/topvote/50`;
        break;
      case 'clicks':
        endpoint = `${API_BASE}/stations/topclick/50`;
        break;
      case 'recent':
        endpoint = `${API_BASE}/stations/lastchange/50`;
        break;
      default:
        endpoint = `${API_BASE}/stations/topvote/50`;
    }
    
    const response = await fetch(`${endpoint}&hidebroken=true`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trending stations:', error);
    return [];
  }
};

/**
 * Get station details by UUID
 */
export const getStationById = async (stationId: string): Promise<RadioStation | null> => {
  try {
    const response = await fetch(`${API_BASE}/stations/byuuid/${stationId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching station details:', error);
    return null;
  }
};

/**
 * Fetch stations by tag/genre
 */
export const fetchStationsByTag = async (tag: string): Promise<RadioStation[]> => {
  try {
    const response = await fetch(
      `${API_BASE}/stations/bytag/${encodeURIComponent(tag)}?hidebroken=true&limit=30`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stations by tag:', error);
    return [];
  }
};