import { createPortal } from "react-dom";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
                <p className="text-slate-400 mb-6">{message}</p>
                
                <div className="flex gap-3 justify-end">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                        Nie
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
                    >
                        Tak
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}