import { useUserStore } from "../../utils/auth";

export const SelectAccess = ({label, name, value, loading, onChange, className, data }) => {

    const { user } = useUserStore();
    const {name: dbName, id: id, general} = data || {};
    const formatedName = dbName?.replace("photos_", "");
    const formatedNameGeneral = general?.replace("photos_", "");
    return(
        <div className="flex flex-col w-full">
            <span className="font-semibold text-[17px] pb-1">{label}</span>
            <select 
                name={name} 
                value={value ?? ""}
                disabled={loading}
                onChange={onChange}
                className={`bg-gray-900 text-gray-400 text-lg hover:bg-gray-800/40 rounded-lg 
                        focus:outline-1 focus:bg-gray-800/40 focus:outline-gray-700/40 w-60${className}`}
            >
                <option value="" disabled hidden>
                    Wybierz dostep
                </option>
                {user !== import.meta.env.VITE_ADMIN_NAME && (
                    <option value={id}>{formatedName}</option>
                )}
                <option value="1">{formatedNameGeneral}</option>
            </select>
        </div>
    )
}