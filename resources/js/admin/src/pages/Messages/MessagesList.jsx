// src/pages/Messages/MessagesList.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMessages } from "../../api/messagesApi";
import { getTwilioSettings } from "../../api/settingsApi";
import Button from "../../components/ui/Button";
import { formatDateTime } from "../../utils/helpers";

const STATUS_COLORS = {
    scheduled: "bg-amber-100 text-amber-700",
    sent: "bg-emerald-100 text-emerald-700",
    failed: "bg-red-100 text-red-700",
    cancelled: "bg-slate-200 text-slate-600"
};

export default function MessagesList() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [twilioConfigured, setTwilioConfigured] = useState(true);

    useEffect(() => {
        fetchMessages();
        checkTwilioStatus();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const response = await getMessages();
        setMessages(response.data);
        setLoading(false);
    };

    const checkTwilioStatus = async () => {
        const response = await getTwilioSettings();
        setTwilioConfigured(Boolean(response.data.configured));
    };

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Scheduled Messages</h1>
                {twilioConfigured ? (
                    <Link to="/messages/schedule">
                        <Button>+ Schedule Message</Button>
                    </Link>
                ) : (
                    <Button
                        disabled
                        title="Connect your Twilio WhatsApp account in Settings before scheduling messages"
                    >
                        + Schedule Message
                    </Button>
                )}
            </div>

            {!twilioConfigured && (
                <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
                    Connect your Twilio WhatsApp account in{" "}
                    <Link to="/settings" className="font-medium underline">Settings</Link>{" "}
                    to start scheduling messages.
                </p>
            )}

            {loading ? (
                <p className="text-slate-500">Loading...</p>
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium text-slate-600">Contact</th>
                                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium text-slate-600">Message</th>
                                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium text-slate-600">Scheduled At</th>
                                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium text-slate-600">Status</th>
                                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium text-slate-600"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((msg) => (
                                <tr key={msg.id} className="hover:bg-slate-50">
                                    <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{msg.contact?.name ?? "—"}</td>
                                    <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                                        {msg.content?.length > 60 ? `${msg.content.slice(0, 60)}…` : msg.content}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                                        {msg.scheduled_at ? formatDateTime(msg.scheduled_at) : "—"}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-3">
                                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLORS[msg.status] || "bg-slate-100 text-slate-600"}`}>
                                            {msg.status}
                                        </span>
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-3">
                                        <Link to={`/messages/${msg.id}`} className="text-blue-600 hover:underline">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {messages.length === 0 && (
                                <tr>
                                    <td className="px-4 py-3 text-slate-500" colSpan={5}>No messages scheduled yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
