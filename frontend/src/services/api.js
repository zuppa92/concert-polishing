import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

class ConcertApi {
  static token = localStorage.getItem('token');

  static async request(endpoint, params = {}, verb = 'get', contentType = 'application/json') {
    const headers = {
      Authorization: ConcertApi.token ? `Bearer ${ConcertApi.token}` : undefined,
      'Content-Type': contentType,
    };

    let q;
    if (verb === 'get') {
      q = axios.get(`${BASE_URL}/${endpoint}`, { params, headers });
    } else if (verb === 'post') {
      q = axios.post(`${BASE_URL}/${endpoint}`, params, { headers });
    } else if (verb === 'patch') {
      q = axios.patch(`${BASE_URL}/${endpoint}`, params, { headers });
    } else if (verb === 'delete') {
      q = axios.delete(`${BASE_URL}/${endpoint}`, { headers, data: params });
    }

    try {
      const response = await q;
      return response.data;
    } catch (err) {
      console.error('API Error:', err.response || err.message);
      let message = err.response?.data?.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Method to fetch artist data, now includes Setlist.fm data
  static async getArtistData(artistName) {
    let res = await this.request('api/artists', { artistName });
    return res; // Return the combined response which includes Last.fm, Spotify, and Setlist.fm data
  }

  // Method to register a new user
  static async register(data) {
    let res = await this.request('api/auth/register', data, 'post');
    if (res.token) {
      localStorage.setItem('token', res.token);
      ConcertApi.token = res.token;
    }
    return res;
  }

  // Method to log in a user
  static async login(data) {
    let res = await this.request('api/auth/login', data, 'post');
    if (res.token) {
      localStorage.setItem('token', res.token);
      ConcertApi.token = res.token;
    }
    return res;
  }

  // Method to get the current user's data
  static async getCurrentUser() {
    let res = await this.request('api/users/me');
    return res;
  }

  // Method to handle profile picture upload
  static async uploadProfilePic(username, formData) {
    let res = await this.request(
      `api/users/${username}/profile-pic`,
      formData,
      'patch',
      'multipart/form-data'
    );
    return res;
  }
}

export default ConcertApi;