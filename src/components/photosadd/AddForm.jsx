import { useMemo, useState } from "react";
import { FormInput } from "../common/FormInput";
import { useFetch } from "../../hooks/useFetchGet";
import { useFetchPost } from "../../hooks/useFetchPost";
import { SelectFolder } from "./SelectFolder";
import { SelectAccess } from "./SelectAccess";

export const AddForm = ({onSubmit, loading, error, onError}) => {
    const [ data, setData] = useState({});
    const [ img, setImg] = useState(null);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.entries(data || {}).forEach(([key, value]) => {
            if (value instanceof File || value instanceof Blob) {
                formData.append(key, value, value.name);
            } else if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });
        console.log(formData);
        onSubmit(formData);
    }
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handlePhotoChange = (e) => {
        const file = e.target.files && e.target.files[0]; // change later for multiple
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            if (typeof onError === "function") onError("Wybrany plik nie jest obrazem.");
            return;
        }
        if (typeof onError === "function") onError(null);
        setData(prev => ({ ...prev, ["file"]: file}));
        setData(prev => ({ ...prev, ["name"]: file.name}));
        setData(prev => ({ ...prev, ["lastModified"]: file.lastModifiedDate}))
        setData(prev => ({ ...prev, ["size"]: file.size})) // in bytes
        setImg(URL.createObjectURL(file));
    }

    const dbUrl = `${import.meta.env.VITE_API_URL}/getDBs`; 
    const dbTablesUrl = `${import.meta.env.VITE_API_URL}/getDbTables`;

    const { data: dataDb } = useFetch(dbUrl);
    
    const userDbName = dataDb?.name;
    const generalDbName = dataDb?.general;

    const userOptions = useMemo(() => {
        return userDbName ? { dbName: userDbName } : null;
    }, [userDbName]);

    const generalOptions = useMemo(() => {
        return generalDbName ? { dbName: generalDbName } : null;
    }, [generalDbName]);

    const { data: userData } = useFetchPost(dbTablesUrl, userOptions);
    const { data: generalData } = useFetchPost(dbTablesUrl, generalOptions);

    const folderData = useMemo(() => {
        if (data?.access === '1') { 
            return generalData || [];
        }
        return userData || []; 
    }, [data?.access, userData, generalData]);

    return(
        <form onSubmit={handleSubmit} method="post" className="justify-center items-center flex-col flex">
            <FormInput
                label="Plik"
                type="file"
                name="file"
                value={data?.file}
                loading={loading}
                onChange={handlePhotoChange}
                className="mb-2"
            />
            
            <SelectAccess
                data={dataDb}
                type="text"
                label="Dostęp"
                name="access"
                value={data?.access}
                loading={loading}
                onChange={handleChange}
                className="mb-2 p-2 bg-slate-800"
            /> 
            {data?.access && (
                <SelectFolder 
                    data={folderData}
                    type="text"
                    label="Dostęp"
                    name="folder"
                    value={data?.folder}
                    loading={loading}
                    onChange={handleChange}
                    className="mb-2 p-2 bg-slate-800" 
                />
            )}
            
            <img src={img} className="mt-10 shadow-lg max-h-52">
            </img>
            <button type="submit" 
                disabled={loading}
                className="rounded-2xl cursor-pointer mt-10
                        bg-purple-900/20 min-h-2 w-50 hover:bg-purple-950/40
                        dark:bg-gray-900/20 dark:hover:bg-gray-800/20
                        text-white p-4 shadow-2xl">
                {loading ? "Dodawanie..." : "Dodaj"}
            </button>
        </form>
    )
}