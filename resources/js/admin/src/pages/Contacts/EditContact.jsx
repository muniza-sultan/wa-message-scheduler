// src/pages/Contacts/EditContact.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateContact } from "../../api/contactsApi";
import api from "../../api/axios";
import Input from "../../components/forms/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function EditContact() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        phone: "",
        birthday: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchContact();
    }, []);

    const fetchContact = async () => {
        try {
            const response = await api.get(`/contacts/${id}`);
            setForm({
                name: response.data.name || "",
                phone: response.data.phone || "",
                birthday: response.data.birthday || ""
            });
        } catch (err) {
            setError("Could not load contact.");
        } finally {
            setLoading(false);
        }
    };

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
            await updateContact(id, form);
            navigate("/contacts");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to update contact.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p className="text-slate-500">Loading...</p>;
    }

    return (
        <div>
            <h1 className="mb-5 text-2xl font-semibold tracking-tight text-slate-900">Edit Contact</h1>

            <Card>
                <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <Input
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Phone Number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
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
                        {submitting ? "Updating..." : "Update"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
