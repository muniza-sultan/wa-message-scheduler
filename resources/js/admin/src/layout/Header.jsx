// src/layout/Header.jsx

import { useState } from "react";

// Rendered server-side into a <meta> tag by dashboard.blade.php.
const userName = document.head.querySelector('meta[name="user-name"]')?.content || "Admin";

export default function Header() {
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);

        try {
            // window.axios (set up in resources/js/bootstrap.js) already carries
            // the X-CSRF-TOKEN header required by Laravel's session-based auth.
            await window.axios.post("/logout");
        } finally {
            // Full page navigation — clears any client-side state and lands
            // the user back on the public homepage.
            window.location.href = "/";
        }
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <h3 className="text-base font-semibold text-slate-800">Admin Panel</h3>

            <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                        {userName.charAt(0).toUpperCase()}
                    </span>
                    {userName}
                </span>
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:text-slate-400"
                >
                    {loggingOut ? "Logging out..." : "Logout"}
                </button>
            </div>
        </header>
    );
}
