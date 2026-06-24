import axios from 'axios';

const csrfToken = document.head.querySelector('meta[name="csrf-token"]');

const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
        ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken.content } : {})
    }
});

export default api;
