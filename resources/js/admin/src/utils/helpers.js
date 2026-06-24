// src/utils/helpers.js

// Format date nicely
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

// Format date + time
export const formatDateTime = (date) => {
    return new Date(date).toLocaleString();
};

// Convert a "YYYY-MM-DD HH:mm:ss" (or ISO) string into the value a
// <input type="datetime-local"> expects ("YYYY-MM-DDTHH:mm").
export const toDateTimeLocalValue = (date) => {
    if (!date) {
        return "";
    }

    return date.replace(" ", "T").slice(0, 16);
};

// Convert to MySQL datetime format
export const toMySQLDateTime = (date) => {
    return new Date(date)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
};

// AI birthday prompt generator
export const buildBirthdayPrompt = (contactName) => {
    return `
    Write a warm and short WhatsApp birthday message
    for ${contactName}.
    Keep it friendly and personal.
    `;
};