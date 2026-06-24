// src/pages/Contacts/ContactsList.jsx

import { useEffect, useState } from "react";
import { getContacts, deleteContact } from "../../api/contactsApi";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { formatDate } from "../../utils/helpers";

export default function ContactsList() {
    const [contacts, setContacts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const response = await getContacts();
        setContacts(response.data);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this contact? Their scheduled messages will be removed too.")) {
            return;
        }

        await deleteContact(id);
        fetchContacts();
    };

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Contacts</h1>
                <Link to="/contacts/create">
                    <Button>+ Add Contact</Button>
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium text-slate-600">Name</th>
                            <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium text-slate-600">Phone</th>
                            <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium text-slate-600">Birthday</th>
                            <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact) => (
                            <tr key={contact.id} className="hover:bg-slate-50">
                                <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{contact.name}</td>
                                <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{contact.phone}</td>
                                <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                                    {contact.birthday ? formatDate(contact.birthday) : "—"}
                                </td>
                                <td className="border-b border-slate-100 px-4 py-3">
                                    <div className="flex items-center gap-4 text-sm">
                                        <button
                                            className="text-blue-600 underline-offset-2 hover:underline"
                                            onClick={() => navigate(`/messages/schedule?contact_id=${contact.id}`)}
                                        >
                                            Schedule message
                                        </button>
                                        <Link to={`/contacts/${contact.id}/edit`} className="text-blue-600 underline-offset-2 hover:underline">
                                            Edit
                                        </Link>
                                        <button
                                            className="text-red-600 underline-offset-2 hover:underline"
                                            onClick={() => handleDelete(contact.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {contacts.length === 0 && (
                            <tr>
                                <td className="px-4 py-3 text-slate-500" colSpan={4}>No contacts yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
