import axios from 'axios';
import {Platform} from 'react-native';

const ADDRESS =
  Platform.OS === 'ios'
    ? 'http://localhost:8000'
    : 'http://192.168.100.82:8000';

const api = axios.create({
  baseURL: ADDRESS,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default api;
