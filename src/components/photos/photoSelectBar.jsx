import { useMemo, useState } from "react";
import FormInput from "../common/FormInput";
import CustomSelect from "../common/CustomSelect";
import { MdAddAPhoto } from "react-icons/md";
import { Link } from "react-router-dom";
import { getSortComparer } from "../../hooks/getSortComparer";

export default function PhotoSelectBar({ finalPhotos, inputValue = '', setInputValue = () => {} }) {
    const [type, setType] = useState('0');
    const [order, setOrder] = useState('0');
    const [size, setSize] = useState('0');
    const handleInputChange = (e) => setInputValue(e.target.value);
    const handleSortChange = (e) => setType(e.target.value);
    const handleOrderChange = (e) => setOrder(e.target.value);
    const handleSizeChange = (e) => setSize(e.target.value);

    const optionsType = [
        { value: "0", label: "Tytuł" },
        { value: "1", label: "Rozmiar" },
        { value: "2", label: "Data utworzenia" },
        { value: "3", label: "Data dodania" },
        { value: "4", label: "Typ" }
    ];
    const optionsOrder = [
        { value: "0", label: "Malejąco" },
        { value: "1", label: "Rosnąco" },
    ];
    const optionsSize = [
        { value: "0", label: "Średnie ikony" },
        { value: "1", label: "Duże ikony" },
        { value: "2", label: "Szczegóły" },
    ]
    const sortedPhotos = useMemo(() => {
            if (!finalPhotos || finalPhotos.length === 0) return [];
    
            const photosCopy = [...finalPhotos];
            const comparer = getSortComparer(type, order);
            return photosCopy.sort(comparer);
    
        }, [finalPhotos, type, order]);

    const barJsx = (
        <div className="h-10 p-8 rounded-lg m-2 justify-between items-center flex bg-fuchsia-900/30 dark:bg-slate-700/60">
            <div className="m-2 p-1 flex-5/6">
                <FormInput
                    type="text" 
                    name="search" 
                    placeholder="Wyszukaj zdjęcia" 
                    onChange={handleInputChange} 
                    value={inputValue} 
                    className="w-170" 
                />
            </div>
            <div className="m-2 p-1 flex-1/6"> {/* type select */}
                <CustomSelect
                    name="type" 
                    value={type}
                    onChange={handleSortChange}
                    options = {optionsType}
                />
            </div>
            <div className="m-2 p-1 flex-1/6"> {/* order select */}
                <CustomSelect 
                    name="order"  
                    value={order}
                    onChange={handleOrderChange}
                    options={optionsOrder}
                />
            </div>
            <div className="m-2 p-1 flex-1/6"> {/* view size select*/}
                <CustomSelect 
                    name="view" 
                    value={size}
                    onChange={handleSizeChange}
                    options={optionsSize}
                />
            </div>
            <div className="m-2 p-1">
                <Link to="/add"><MdAddAPhoto className="size-8"/></Link>
            </div>
        </div>
    )
    return {
        barJsx,
        sortedPhotos,
        size
    }
}