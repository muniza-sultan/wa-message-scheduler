import api from './axios';

export const getMessages = () =>
    api.get('/messages');

export const scheduleMessage = (data) =>
    api.post('/messages', data);

export const updateMessage = (id, data) =>
    api.put(`/messages/${id}`, data);

export const regenerateMessage = (id) =>
    api.post(`/messages/${id}/regenerate`);

export const cancelMessage = (id) =>
    api.post(`/messages/${id}/cancel`);

export const getMessageLogs = (id) =>
    api.get(`/messages/${id}/logs`);