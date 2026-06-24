// src/pages/Settings.jsx

import { useEffect, useState } from "react";
import { getTwilioSettings, updateTwilioSettings } from "../api/settingsApi";
import Input from "../components/forms/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [hasAuthToken, setHasAuthToken] = useState(false);

    const [form, setForm] = useState({
        twilio_sid: "",
        twilio_auth_token: "",
        twilio_whatsapp_number: ""
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await getTwilioSettings();
            setForm({
                twilio_sid: response.data.twilio_sid || "",
                twilio_auth_token: "",
                twilio_whatsapp_number: response.data.twilio_whatsapp_number || ""
            });
            setHasAuthToken(response.data.has_auth_token);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setSubmitting(true);

        try {
            const response = await updateTwilioSettings(form);
            setHasAuthToken(response.data.has_auth_token);
            setForm({ ...form, twilio_auth_token: "" });
            setSuccess(true);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to save settings.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">WhatsApp / Twilio Settings</h1>
            <p className="mb-5 max-w-xl text-sm text-slate-600">
                Connect your own Twilio WhatsApp account so messages are sent from
                a number your contacts actually recognize as yours — not a shared
                number that might look "creepy" to them.
            </p>

            <Card>
                {loading ? (
                    <p className="text-slate-500">Loading...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        {success && <p className="text-sm text-emerald-600">Settings saved.</p>}

                        <Input
                            label="Twilio Account SID"
                            name="twilio_sid"
                            value={form.twilio_sid}
                            onChange={handleChange}
                            placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            required
                        />

                        <Input
                            label={hasAuthToken ? "Twilio Auth Token (leave blank to keep current)" : "Twilio Auth Token"}
                            name="twilio_auth_token"
                            type="password"
                            value={form.twilio_auth_token}
                            onChange={handleChange}
                            placeholder={hasAuthToken ? "•••••••••••••••• (saved)" : "Your Twilio auth token"}
                            required={!hasAuthToken}
                        />

                        <Input
                            label="WhatsApp Number"
                            name="twilio_whatsapp_number"
                            value={form.twilio_whatsapp_number}
                            onChange={handleChange}
                            placeholder="whatsapp:+14155238886"
                            required
                        />

                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Saving..." : "Save Settings"}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
}
