import { Routes, Route } from "react-router-dom"
import AdminLayout from "../layout/AdminLayout"
import Dashboard from "../pages/Dashboard"
import ContactsList from "../pages/Contacts/ContactsList"
import CreateContact from "../pages/Contacts/CreateContact"
import EditContact from "../pages/Contacts/EditContact"
import MessagesList from "../pages/Messages/MessagesList"
import ScheduleMessage from "../pages/Messages/ScheduleMessage"
import MessageDetails from "../pages/Messages/MessageDetails"
import Settings from "../pages/Settings"
import React from "react";

// Note: BrowserRouter is provided by main.jsx, so we only define routes here.
export default function AppRoutes() {
    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/contacts" element={<ContactsList />} />
                <Route path="/contacts/create" element={<CreateContact />} />
                <Route path="/contacts/:id/edit" element={<EditContact />} />
                <Route path="/messages" element={<MessagesList />} />
                <Route path="/messages/schedule" element={<ScheduleMessage />} />
                <Route path="/messages/:id" element={<MessageDetails />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </AdminLayout>
    )
}
