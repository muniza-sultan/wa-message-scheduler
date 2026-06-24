// src/pages/Messages/ScheduleMessage.jsx

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { scheduleMessage } from "../../api/messagesApi";
import { getContacts } from "../../api/contactsApi";
import { getTwilioSettings } from "../../api/settingsApi";
import Select from "../../components/forms/Select";
import DateTimePicker from "../../components/forms/DateTimePicker";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { buildBirthdayPrompt } from "../../utils/helpers";

export default function ScheduleMessage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [contacts, setContacts] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [twilioConfigured, setTwilioConfigured] = useState(true);
    const [checkingTwilio, setCheckingTwilio] = useState(true);

    const [form, setForm] = useState({
        contact_id: searchParams.get("contact_id") || "",
        content: "",
        scheduled_at: ""
    });

    useEffect(() => {
        fetchContacts();
        checkTwilioStatus();
    }, []);

    const fetchContacts = async () => {
        const response = await getContacts();
        setContacts(response.data);
    };

    const checkTwilioStatus = async () => {
        setCheckingTwilio(true);
        try {
            const response = await getTwilioSettings();
            setTwilioConfigured(Boolean(response.data.configured));
        } finally {
            setCheckingTwilio(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSuggest = () => {
        const contact = contacts.find((c) => String(c.id) === String(form.contact_id));

        if (!contact) {
            return;
        }

        // Quick local birthday-message suggestion. (buildBirthdayPrompt is meant
        // to feed an AI generator later — for now we just draft something simple.)
        setForm({
            ...form,
            content: `Happy Birthday, ${contact.name}! 🎉 Wishing you a fantastic day filled with joy and good things ahead.`
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setSubmitting(true);

        try {
            await scheduleMessage(form);
            setSuccess(true);
            setForm({ contact_id: "", content: "", scheduled_at: "" });
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to schedule message.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="mb-5 text-2xl font-semibold tracking-tight text-slate-900">Schedule Message</h1>

            <Card>
                <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
                    {!checkingTwilio && !twilioConfigured && (
                        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
                            You haven't connected your Twilio WhatsApp account yet, so messages
                            can't be scheduled. Head over to{" "}
                            <Link to="/settings" className="font-medium underline">Settings</Link>{" "}
                            to add your Twilio SID, auth token and WhatsApp number.
                        </p>
                    )}

                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {success && (
                        <p className="text-sm text-emerald-600">
                            Message scheduled!{" "}
                            <button type="button" className="text-blue-600 underline" onClick={() => navigate("/messages")}>
                                View scheduled messages
                            </button>
                        </p>
                    )}

                    <Select
                        label="Contact"
                        name="contact_id"
                        value={form.contact_id}
                        onChange={handleChange}
                        options={contacts.map((c) => ({ value: c.id, label: `${c.name} (${c.phone})` }))}
                        required
                    />

                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-700">Message</label>
                            <button type="button" className="text-xs text-blue-600 underline" onClick={handleSuggest}>
                                Suggest birthday message
                            </button>
                        </div>
                        <textarea
                            name="content"
                            value={form.content}
                            placeholder="Message content"
                            onChange={handleChange}
                            required
                            className="min-h-[100px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <DateTimePicker
                        label="Send at"
                        name="scheduled_at"
                        value={form.scheduled_at}
                        onChange={handleChange}
                        required
                    />

                    <Button
                        type="submit"
                        disabled={submitting || !twilioConfigured}
                        title={!twilioConfigured ? "Connect your Twilio WhatsApp account in Settings first" : undefined}
                    >
                        {submitting ? "Scheduling..." : "Schedule"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
