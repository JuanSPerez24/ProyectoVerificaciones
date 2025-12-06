const API_URL = 
  window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://marcas-en-varificaciones-railway.up.railway.app/api';

export default API_URL;