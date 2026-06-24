import api from './axios';

export const getTwilioSettings = () => api.get('/settings/twilio');

export const updateTwilioSettings = (data) => api.put('/settings/twilio', data);
