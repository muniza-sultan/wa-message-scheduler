// src/pages/Contacts/CreateContact.jsx

import { useState } from "react";
import { createContact } from "../../api/contactsApi";
import { useNavigate } from "react-router-dom";
import Input from "../../components/forms/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function CreateContact() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        birthday: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await createContact(form);
            navigate("/contacts");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to save contact.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="mb-5 text-2xl font-semibold tracking-tight text-slate-900">Create Contact</h1>

            <Card>
                <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <Input
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                    />

                    <Input
                        label="Phone Number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. +14155551234"
                        required
                    />

                    <Input
                        label="Birthday"
                        name="birthday"
                        type="date"
                        value={form.birthday}
                        onChange={handleChange}
                    />

                    <Button type="submit">
                        {submitting ? "Saving..." : "Save"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
