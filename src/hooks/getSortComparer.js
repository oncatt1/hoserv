export const getSortComparer = (type, order) => (a, b) => {
    // 1. Determine the Direction Multiplier (1 for ASC, -1 for DESC)
    // Order '0' (Malejąco/Descending) gives -1
    // Order '1' (Rosnąco/Ascending) gives 1
    const direction = order === '1' ? 1 : -1;

    let aValue, bValue;

    // 2. Determine the Values to Compare based on 'type'
    switch (type) {
        case '0': // Tytuł (Name/Title)
            aValue = a.name;
            bValue = b.name;
            break;
        case '1': // Rozmiar (Size)
            aValue = a.size;
            bValue = b.size;
            break;
        case '2': // Data utworzenia (Created Date)
            aValue = a.created_at; // Assuming 'created_at' field
            bValue = b.created_at;
            break;
        case '3': // Data dodania (Uploaded Date)
            aValue = a.uploaded_at; // Assuming 'uploaded_at' field
            bValue = b.uploaded_at;
            break;
        case '4': // Typ (File Type)
            aValue = a.file_type;
            bValue = b.file_type;
            break;
        default:
            // Fallback: don't sort or use a default property
            return 0;
    }

    // 3. Perform the Comparison
    if (typeof aValue === 'string') {
        // String/Title/Type comparison using localeCompare
        return direction * aValue.localeCompare(bValue);
    } 
    
    // Number/Date comparison
    // Dates are treated as numbers (timestamps) or can be compared directly
    return direction * (aValue < bValue ? -1 : aValue > bValue ? 1 : 0);
};