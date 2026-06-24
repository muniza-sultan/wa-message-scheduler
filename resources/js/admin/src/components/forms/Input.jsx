// src/components/forms/Input.jsx

export default function Input({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    required = false
}) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
        </div>
    );
}
