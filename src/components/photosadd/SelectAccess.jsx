import { useMemo } from "react";
import { useUserStore } from "../../utils/auth";
import CustomSelect from "../common/CustomSelect";

// SelectAccess.jsx
export const SelectAccess = ({ data, value, ...props }) => {
    const { user } = useUserStore();
    
    // Ensure we have data before trying to destructure
    const dbId = data?.id; 
    const dbName = data?.name?.replace("photos_", "") || "Prywatne";
    const generalName = data?.general?.replace("photos_", "") || "Publiczne";

    const options = useMemo(() => [
        ...(user !== import.meta.env.VITE_ADMIN_NAME
            ? [{ value: String(dbId), label: dbName }] // Force string for URL matching
            : []),
        { value: "1", label: generalName },
    ], [dbId, dbName, generalName, user]);

    return (
        <div className="flex flex-col w-full">
            <span className="font-semibold text-[17px] pb-1">{props.label}</span>
            <CustomSelect 
                {...props}
                value={value} 
                options={options}
            />
        </div>
    );
};