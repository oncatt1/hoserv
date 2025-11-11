import { useRef } from "react";

export const FormInput = ({ label, type = "text", value, onChange, name, loading = "", className = ""}) =>
{
    const fileRef = useRef(null);

    if (type === "file") {
        const fileName = value && typeof value === "object" && value.name ? value.name : null;
        return (
            <div className="flex flex-col w-full">
                <span className="font-semibold text-[17px] pb-1">{label}</span>
                <div className={`flex gap-3 ${className} flex-col`}>
                    <button
                        type="button"
                        onClick={() => fileRef.current && fileRef.current.click()}
                        disabled={loading}
                        className="bg-slate-800 text-white rounded-lg px-1 py-1 shadow">
                        Wybierz plik
                    </button>
                    <span className="text-sm text-gray-300">{fileName ?? "Brak pliku"}</span>
                </div>
                <input
                    ref={fileRef}
                    type="file"
                    name={name}
                    onChange={onChange}
                    disabled={loading}
                    className="hidden"
                />
            </div>
        );
    }

    return(
        <div className="flex flex-col w-full">
            <span className="font-semibold text-[17px] pb-1">{label}</span> 
                <input 
                    type={type} 
                    name={name} 
                    value={value ?? ""}
                    onChange={onChange}
                    disabled={loading}
                    className={`bg-gray-900 text-gray-400 text-lg hover:bg-gray-800/40 rounded-lg 
                        focus:outline-1 focus:bg-gray-800/40 focus:outline-gray-700/40 w-60 ${className}`}/>
        </div>
    )
}