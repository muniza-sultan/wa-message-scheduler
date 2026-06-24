// src/components/forms/DateTimePicker.jsx

export default function DateTimePicker({
    label,
    name,
    value,
    onChange,
    required = false,
    disabled = false
}) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
            <input
                type="datetime-local"
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
            />
        </div>
    );
}
