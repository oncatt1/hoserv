import { useMemo } from "react";

export const useFormattedSize = (sizeInBytes) => {
    const formatedSize = useMemo(() => {
    const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    const value = sizeInBytes / Math.pow(1024, i);

        // Ensure the input is a valid number greater than zero
        if (typeof sizeInBytes !== 'number' || sizeInBytes <= 0) {
            return '0 B';
        }
        
        // Using 'en-US' locale for consistent formatting
        return new Intl.NumberFormat('en-US', {
            style: 'unit',
            unit: units[i],
            unitDisplay: 'narrow', // or 'short', 'long'
            maximumFractionDigits: 2, 
        }).format(value);
        
    }, [sizeInBytes]);
   
    // The hook returns the calculated value directly
    return formatedSize;
};