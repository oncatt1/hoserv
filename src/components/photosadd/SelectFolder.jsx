import CustomSelect from "../common/CustomSelect";

export const SelectFolder = ({label, name, value, loading, onChange, className, data }) => {
  
    const tables = data?.tableNames || [];
     const options = tables.map((table) => ({
        value: table.folder,
        label: table.folder,
    }));
    return(
        <div className="flex flex-col w-full">
            <span className="font-semibold text-[17px] pb-1">{label}</span>
            <CustomSelect
                name={name} 
                value={value ?? ""}
                loading={loading}
                onChange={onChange}
                className={`w-60 ${className}`}
                placeholder = "Wybierz folder"
                options={options}
            />
        </div>
    )
}