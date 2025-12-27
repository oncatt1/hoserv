import { useMemo, useState } from "react";
import { FormInput } from "../common/FormInput";
import { useSearchParams } from "react-router-dom";

export const AddFolderForm = ({onSubmit, loading, error}) => {
    
    const [searchParams] = useSearchParams();
    const currentAccess = searchParams.get("db") || "";
    const currentId = searchParams.get("id") || "";
    
    const [data, setData] = useState({
            "id": currentId
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(data);
    }
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return(
        <form onSubmit={handleSubmit} method="post" className="justify-center items-center flex-col flex">
            <FormInput
                label="Dostęp"
                type="text"
                name="access"
                loading={true}
                className="mb-2"
                value={currentAccess}
            />

            <FormInput
                label="Folder"
                type="text"
                name="folder"
                loading={loading}
                onChange={handleChange}
                className="mb-2"
                value={data?.folder}
            />

            <button 
            type="submit" 
            disabled={loading}
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