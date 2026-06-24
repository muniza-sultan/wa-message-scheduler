// src/pages/Messages/MessageDetails.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { updateMessage, regenerateMessage, getMessageLogs, cancelMessage } from "../../api/messagesApi";
import { getContacts } from "../../api/contactsApi";
import Select from "../../components/forms/Select";
import DateTimePicker from "../../components/forms/DateTimePicker";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/Table";
import { formatDateTime, toDateTimeLocalValue } from "../../utils/helpers";

const STATUS_COLORS = {
    scheduled: "bg-amber-100 text-amber-700",
    sent: "bg-emerald-100 text-emerald-700",
    failed: "bg-red-100 text-red-700",
    cancelled: "bg-slate-200 text-slate-600"
};

export default function MessageDetails() {
    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({ contact_id: "", content: "", scheduled_at: "" });

    const [logs, setLogs] = useState(null);
    const [logsVisible, setLogsVisible] = useState(false);
    const [logsLoading, setLogsLoading] = useState(false);

    useEffect(() => {
        fetchMessage();
        fetchContacts();
    }, [id]);

    const fetchMessage = async () => {
        setLoading(true);
        const response = await api.get(`/messages/${id}`);
        setMessage(response.data);
        setForm({
            contact_id: response.data.contact?.id || "",
            content: response.data.content || "",
            scheduled_at: toDateTimeLocalValue(response.data.scheduled_at)
        });
        setLoading(false);
    };

    const fetchContacts = async () => {
        const response = await getContacts();
        setContacts(response.data);
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const isEditable = message?.status === "scheduled";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setBusy(true);

        try {
            await updateMessage(id, form);
            setSuccess(true);
            await fetchMessage();
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to save changes.");
        } finally {
            setBusy(false);
        }
    };

    const handleRetry = async () => {
        setBusy(true);

        try {
            await regenerateMessage(id);
            await fetchMessage();
        } finally {
            setBusy(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm("Cancel this scheduled message? It will not be sent.")) {
            return;
        }

        setBusy(true);

        try {
            await cancelMessage(id);
            await fetchMessage();
        } finally {
            setBusy(false);
        }
    };

    const handleToggleLogs = async () => {
        if (logsVisible) {
            setLogsVisible(false);
            return;
        }

        setLogsVisible(true);

        if (logs === null) {
            setLogsLoading(true);

            try {
                const response = await getMessageLogs(id);
                setLogs(response.data);
            } finally {
                setLogsLoading(false);
            }
        }
    };

    if (loading) {
        return <p className="text-slate-500">Loading...</p>;
    }

    if (!message) {
        return <p className="text-slate-500">Message not found.</p>;
    }

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Message Details</h1>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLORS[message.status] || "bg-slate-100 text-slate-600"}`}>
                    {message.status}
                </span>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
                    {!isEditable && (
                        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                            This message has already been {message.status} and can no longer be edited.
                        </p>
                    )}

                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {success && <p className="text-sm text-emerald-600">Changes saved.</p>}

                    <Select
                        label="Contact"
                        name="contact_id"
                        value={form.contact_id}
                        onChange={handleChange}
                        options={contacts.map((c) => ({ value: c.id, label: `${c.name} (${c.phone})` }))}
                        required
                        disabled={!isEditable}
                    />

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Message</label>
                        <textarea
                            name="content"
                            value={form.content}
                            placeholder="Message content"
                            onChange={handleChange}
                            required
                            disabled={!isEditable}
                            className="min-h-[100px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                        />
                    </div>

                    <DateTimePicker
                        label="Send at"
                        name="scheduled_at"
                        value={form.scheduled_at}
                        onChange={handleChange}
                        required
                        disabled={!isEditable}
                    />

                    <div className="flex items-center gap-4">
                        {isEditable && (
                            <Button type="submit" disabled={busy}>
                                {busy ? "Saving..." : "Save changes"}
                            </Button>
                        )}
                        {message.status === "failed" && (
                            <Button type="button" onClick={handleRetry} disabled={busy}>
                                {busy ? "Retrying..." : "Retry sending"}
                            </Button>
                        )}
                        {isEditable && (
                            <Button type="button" variant="secondary" onClick={handleCancel} disabled={busy}>
                                {busy ? "Cancelling..." : "Cancel message"}
                            </Button>
                        )}
                        <Button type="button" variant="secondary" onClick={handleToggleLogs}>
                            {logsVisible ? "Hide logs" : "Show logs"}
                        </Button>
                        <Link to="/messages" className="text-sm text-blue-600 hover:underline">
                            Back to messages
                        </Link>
                    </div>
                </form>
            </Card>

            {logsVisible && (
                <Card className="mt-5">
                    <h3 className="mb-4 text-sm font-semibold text-slate-700">Send logs</h3>

                    {logsLoading ? (
                        <p className="text-sm text-slate-500">Loading logs...</p>
                    ) : logs && logs.length > 0 ? (
                        <Table
                            columns={[
                                { accessor: "created_at", label: "Date" },
                                { accessor: "to_number", label: "To" },
                                { accessor: "owner", label: "Owner" },
                                { accessor: "added_by", label: "Added By" },
                                { accessor: "result", label: "Result" },
                                { accessor: "details", label: "Details" }
                            ]}
                            data={logs.map((log) => ({
                                created_at: formatDateTime(log.created_at),
                                to_number: log.to_number,
                                owner: log.owner || "—",
                                added_by: log.added_by || "—",
                                result: (
                                    <span
                                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                            log.success ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {log.success ? "Success" : "Failed"}
                                    </span>
                                ),
                                details: log.success ? log.response_message || "—" : log.error || "—"
                            }))}
                        />
                    ) : (
                        <p className="text-sm text-slate-500">No send attempts logged yet.</p>
                    )}
                </Card>
            )}
        </div>
    );
}
