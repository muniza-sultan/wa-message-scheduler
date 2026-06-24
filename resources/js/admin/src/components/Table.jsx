// src/components/Table.jsx

export default function Table({ columns = [], data = [] }) {
    return (
        <table className="w-full border-collapse overflow-hidden rounded-lg bg-white text-sm">
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col.accessor} className="border-b border-slate-200 bg-slate-50 px-3 py-2.5 text-left font-medium text-slate-600">
                            {col.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        {columns.map((col) => (
                            <td key={col.accessor} className="border-b border-slate-100 px-3 py-2.5 text-slate-700">
                                {row[col.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
