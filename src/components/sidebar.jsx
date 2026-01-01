import { useLocation, useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetchGet";
import { useUserStore } from "../utils/auth";
import { useFetchPost } from "../hooks/useFetchPost";
import { useEffect, useMemo, useState } from "react";
import { MdAdd, MdOutline7kPlus } from "react-icons/md";
import FormInput from "./common/FormInput";
import { useDebounce } from "../hooks/useDebounce";

export default function Sidebar() {
    const location = useLocation().pathname;

    if (location !== "/photos") return null;

    return <SidebarContent />;
}
function SidebarContent() {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const debouncedSearchTerm = useDebounce(inputValue, 1000);

    const dbUrl = `${import.meta.env.VITE_API_URL}/getDBs`; 
    const folderUrl = `${import.meta.env.VITE_API_URL}/getFolders`;
    const { data, refetch: refetchDbs } = useFetch(dbUrl);
    
    const userOptions = useMemo(() => {
        return data ? { access: data.id } : null;
    }, [data]);

    const { data: generalData } = useFetchPost(folderUrl, { access: 1 });
    const { data: userData } = useFetchPost(folderUrl, userOptions);

    const filteredUserData = useMemo(() => {
        if (!userData?.result) return [];
        if (!debouncedSearchTerm) return userData.result;
        return userData.result.filter(entry => 
            entry.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [userData, debouncedSearchTerm]);

    const filteredGeneralData = useMemo(() => {
        if (!generalData?.result) return [];
        if (!debouncedSearchTerm) return generalData.result;
        return generalData.result.filter(entry => 
            entry.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [generalData, debouncedSearchTerm]);

    // Refetch all data when user changes
    useEffect(() => {
        if (user) {
            refetchDbs();
        }
    }, [user, refetchDbs]);
    if (!data) return null;

    const onTableNameClick = async (name, db) => {
        navigate(`/photos?folder=${encodeURIComponent(name)}&db=${encodeURIComponent(db)}`);
    }
    const addFolder = async (id, db) => {
        navigate(`/addFolder?id=${encodeURIComponent(id)}&db=${encodeURIComponent(db)}`);
    }
    const handleInputChange = (e) => setInputValue(e.target.value);
    

    const headerClass = `
        font-medium text-gray-400
        cursor-pointer
        m-1 px-3 py-2
        transition-all duration-200
        bg-slate-900/30
        hover:bg-slate-900/20 hover:text-gray-300
        rounded-md
        border-t border-gray-600/60
    `;

    const rowClass = `
        cursor-pointer
        ml-6
        px-3 py-2
        transition-colors duration-200
        hover:text-gray-300 hover:bg-slate-900/10
        border-gray-700/60
        rounded-sm
        truncate
    `;

    const bgButton = `text-right p-1 bg-slate-700/30 rounded-2xl`;

    return (
        <aside className="w-64 h-full flex flex-col opacity-0 animate-fadeIn
        bg-slate-800/60 backdrop-blur-md border-r border-slate-700/50">
            <div className="flex-1 overflow-y-auto">
            {/* User Database Section */}
            {data.name && (filteredUserData.length > 0 || !debouncedSearchTerm) && (
                <div className="p-2">
                    <div className={`flex flex-row w-full justify-between ${headerClass}`}
                        onClick={() => onTableNameClick("", data.name)}>
                        <div>
                            {data.name.replace("photos_", "")}
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                            <div className={bgButton} onClick={() => addFolder(data.id, data.name.replace("photos_", ""))}>
                                <MdAdd/>
                            </div>
                        </div>
                    </div>
                    {filteredUserData.map((entry, i) => (
                        <div 
                            key={i} 
                            onClick={() => onTableNameClick(entry.id, data.name)} 
                            className={`${rowClass} ${i === filteredUserData.length - 1 ? '' : 'border-b'}`}
                        >
                            {entry.name}
                        </div>
                    ))}
                </div>
            )}
            {/* General/Admin Database Section */}
            {user !== import.meta.env.VITE_ADMIN_NAME && data.general && (filteredGeneralData.length > 0 || !debouncedSearchTerm) && (
                <div className="p-2">
                    <div className={`flex flex-row w-full justify-between ${headerClass}`}
                        onClick={() => onTableNameClick("", data.general)}>
                        <div>
                            {data.general.replace("photos_", "")}
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                            <div className={bgButton} onClick={() => addFolder(1, data.general.replace("photos_", ""))}>
                                <MdAdd/>
                            </div>
                        </div>

                    </div>
                    {filteredGeneralData.map((entry, i) => (
                        <div 
                            key={i} 
                            onClick={() => onTableNameClick(entry.id, data.general)} 
                            className={`${rowClass} ${i === filteredGeneralData.length - 1 ? '' : 'border-b'}`}
                        >
                            {entry.name}
                        </div>
                    ))}
                </div>
            )}
            </div>
            <div className="p-2 border-t border-slate-700/50">
                <FormInput
                    type="text" 
                    name="search" 
                    placeholder="Wyszukaj folder" 
                    onChange={handleInputChange} 
                    value={inputValue} 
                    className="w-full! text-sm! py-2! px-3! bg-slate-900/50! border! border-slate-700/50! rounded-md! focus:bg-slate-900/80! transition-all"
                    containerClassName="px-1" 
                />
            </div>
        </aside>
    );
}