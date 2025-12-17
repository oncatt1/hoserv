import { useUserStore } from "../../utils/auth";
import CustomSelect from "../common/CustomSelect";

export const SelectAccess = ({label, name, value, loading, onChange, className, data }) => {

    const { user } = useUserStore();
    const {name: dbName, id: id, general} = data || {};
    const formatedName = dbName?.replace("photos_", "");
    const formatedNameGeneral = general?.replace("photos_", "");

    const options = [
        ...(user !== import.meta.env.VITE_ADMIN_NAME
        ? [{ value: id, label: formatedName }]
        : []),
        { value: "1", label: formatedNameGeneral },
    ];
        
    return(
        <div className="flex flex-col w-full">
            <span className="font-semibold text-[17px] pb-1">{label}</span>
            <CustomSelect 
                name={name}
                value={value ?? ""}
                loading={loading}
                onChange={onChange}
                className ={`w-60${className}`}
                placeholder = "Wybierz dostep"
                options = {options}
            />
        </div>
    )
}