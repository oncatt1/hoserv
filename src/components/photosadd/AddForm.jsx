import { useEffect, useMemo, useState } from "react";
import { FormInput } from "../common/FormInput";
import { useFetch } from "../../hooks/useFetchGet";
import { useFetchPost } from "../../hooks/useFetchPost";
import { SelectFolder } from "./SelectFolder";
import { SelectAccess } from "./SelectAccess";
import { useSearchParams } from "react-router-dom";

export const AddForm = ({onSubmit, loading, error, onError}) => {
    const [data, setData] = useState({});
    const [files, setFiles] = useState([]);
    const [imgPreview, setImgPreview] = useState(null);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const urlFolder = searchParams.get("folder");
        const urlDb = searchParams.get("db");

        if ((urlFolder || urlDb) && Object.keys(data).length === 0) {
            setData({
                access: urlDb || "",
                folder: urlFolder || ""
            });
        }
    }, [searchParams, data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.entries(data || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });
        
        files.forEach((file) => {
            formData.append('files', file, file.name);
        });
        
        if (files.length > 0) {
             formData.append('lastModified', files[0].lastModifiedDate);
        }
        
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
        const selectedFiles = Array.from(e.target.files);
        
        if (selectedFiles.length === 0) return;

        const invalidFile = selectedFiles.find(file => 
            !file.type.startsWith("image/") && !file.type.startsWith("video/")
        );

        if (invalidFile) {
            if (typeof onError === "function") onError(`Plik '${invalidFile.name}' nie jest zdjęciem ani wideo.`);
            setFiles([]);
            setImgPreview(null);
            return;
        }

        if (typeof onError === "function") onError(null);
        
        setFiles(selectedFiles);
        
        const firstFile = selectedFiles[0];
        if (firstFile.type.startsWith("image/")) {
             setImgPreview(URL.createObjectURL(firstFile));
        } else {
             setImgPreview(null); 
        }

    }

    const dbUrl = `${import.meta.env.VITE_API_URL}/getDBs`; 
    const folderUrl = `${import.meta.env.VITE_API_URL}/getFolders`;
    const { data: dataDb, refetch: refetchDbs } = useFetch(dbUrl);
    
    const userOptions = useMemo(() => {
        return dataDb ? { access: dataDb?.id } : null;
        }, [dataDb]);
    const { data: generalData } = useFetchPost(folderUrl, { access: 1 });
    const { data: userData } = useFetchPost(folderUrl, userOptions);
    
    const folderData = useMemo(() => {
        if (data?.access === '1') { 
            return generalData?.result || [];
        }
        return userData?.result || []; 
    }, [data?.access, userData, generalData]);

    const getFileCountLabel = (count) => {
        if (count === 1) {
            return `Wybrano: 1 plik.`;
        }
        
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;
        
        if ((lastDigit >= 2 && lastDigit <= 4) && !(lastTwoDigits >= 12 && lastTwoDigits <= 14)) {
            return `Wybrano: ${count} pliki.`;
        }
        
        return `Wybrano: ${count} plików.`;
    };
    
    return(
        <form onSubmit={handleSubmit} method="post" className="justify-center items-center flex-col flex">
            naprawic to 
            <FormInput
                label="Plik"
                type="file"
                name="files"
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

            {imgPreview && <img src={imgPreview} className="mt-10 shadow-lg max-h-52" />}
            {files.length > 0 && (
                <p className="mt-2 text-sm text-gray-400">
                    {getFileCountLabel(files.length)}
                </p>
            )}

            <button 
            type="submit" 
            disabled={loading || files.length === 0}
            className="
                w-60 px-4 py-2.5 mt-10
                bg-gray-900 text-gray-200 text-lg rounded-lg
                hover:bg-gray-800/40 
                focus:outline-1 focus:bg-gray-800/40 focus:outline-gray-700/40
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                cursor-pointer shadow-lg
            "
            >
            {loading ? "Dodawanie..." : `Dodaj`}
            </button>
        </form>
    )
}