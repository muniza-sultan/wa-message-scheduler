// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { getContacts } from "../api/contactsApi";
import { getMessages } from "../api/messagesApi";
import Card from "../components/ui/Card";

export default function Dashboard() {
    const [stats, setStats] = useState({ contacts: null, scheduled: null, sent: null });

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const [contactsRes, messagesRes] = await Promise.all([getContacts(), getMessages()]);
        const messages = messagesRes.data;

        setStats({
            contacts: contactsRes.data.length,
            scheduled: messages.filter((m) => m.status === "scheduled").length,
            sent: messages.filter((m) => m.status === "sent").length
        });
    };

    const cards = [
        { label: "Total Contacts", value: stats.contacts, accent: "text-blue-600" },
        { label: "Scheduled Messages", value: stats.scheduled, accent: "text-amber-600" },
        { label: "Messages Sent", value: stats.sent, accent: "text-emerald-600" }
    ];

    return (
        <div>
            <h1 className="mb-5 text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {cards.map((card) => (
                    <Card key={card.label}>
                        <h3 className="text-sm font-medium text-slate-500">{card.label}</h3>
                        <p className={`mt-2 text-3xl font-bold ${card.accent}`}>{card.value ?? "--"}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
