import { useState } from "react";
import { FormInput } from "../common/FormInput";

export const AddForm = ({onSubmit, loading, error}) => {
    const [ data, setData] = useState(null); //change
    const [ img, setImg] = useState(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    }
    
    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    const handlePhotoChange = (e) => {
        const file = e.target.files[0]; //zmienic pozniej na wiecej niz jedno
        if (!file) return;

        handleChange(e);
        setImg(URL.createObjectURL(file));
    }
    return(
        //sam plik, kto ma dostep (domyslnie uzytkownik), podglad (nie jezeli duzo), dokąd, 
        <form onSubmit={handleSubmit} method="post"  className="justify-center items-center flex-col flex">
            <FormInput
                label="Plik"
                type="file"
                name="file"
                value={data}
                loading={loading}
                onChange={handlePhotoChange}
            />
            <FormInput
                type="text"
                label="Dostęp"
                name="access"
                value={data}
                loading={loading}
                onChange={handleChange}
            />
            <FormInput
                label="Folder"
                name="folder"
                value={data}
                loading={loading}
                onChange={handleChange}
            />
            <img src={img}>
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