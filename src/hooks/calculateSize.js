import { useMemo } from "react";

export const useFormattedSize = (sizeInBytes) => {
    const formatedSize = useMemo(() => {
        if (typeof sizeInBytes !== 'number' || sizeInBytes === 0) {
            return '0 Bytes';
        }

        // Use the browser's native Internationalization API for correct formatting
        return new Intl.NumberFormat('en-US', {
            style: 'unit',
            unit: 'byte',
            unitDisplay: 'short', // 'B', 'KB', 'MB', etc.
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(sizeInBytes);
        
    }, [sizeInBytes]);
   
    // The hook returns the calculated value directly
    return formatedSize;
};