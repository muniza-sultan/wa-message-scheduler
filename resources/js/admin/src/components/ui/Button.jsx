// src/components/ui/Button.jsx

export default function Button({
    children,
    onClick,
    type = "button",
    disabled = false,
    title,
    variant = "primary"
}) {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300",
        secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 disabled:text-slate-400"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition cursor-pointer disabled:cursor-not-allowed ${variants[variant]}`}
        >
            {children}
        </button>
    );
}
