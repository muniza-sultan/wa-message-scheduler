import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Attach the CSRF token (rendered into a <meta> tag by the Blade layout) to
// every outgoing request so Laravel's session-based auth (login/logout, and
// any state-changing requests) passes CSRF verification.
const csrfToken = document.head.querySelector('meta[name="csrf-token"]');

if (csrfToken) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
}
