// src/components/ui/Modal.jsx

export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 text-slate-400 transition hover:text-slate-600"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}
