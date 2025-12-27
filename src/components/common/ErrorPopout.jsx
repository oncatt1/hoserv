import React, { useState, useEffect } from 'react';
import "../../../index.css";

export const ErrorPopout = ({ error }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [classState, setClassState] = useState(null);
    
    let messageToDisplay = '';
    
    if (typeof error === 'object' && error !== null) {
        messageToDisplay = error.message;
    }

    if (!messageToDisplay && typeof error === 'string') {
        try {
            const parsedError = JSON.parse(error);
            messageToDisplay = parsedError?.message;
        } catch (e) {
            messageToDisplay = error;
        }
    }
    if (!messageToDisplay){
        const parsedError = JSON.parse(error);
        messageToDisplay = parsedError?.error;
    }
    const errorMessage = messageToDisplay || "Nieznany, spójrz w konsole";
    
    useEffect(() => {
        if (error) {
            setIsVisible(true);
            setClassState("fade-in-out");

            setTimeout(() => {   
                setClassState("fade-in-out-visible");
            }, 300);

            const autoCloseTimer = setTimeout(() => {
                handleClick();
            }, 7000);

            return () => clearTimeout(autoCloseTimer);
        } else {
            setIsVisible(false);
        }
    }, [error]);

    const handleClick = () => {
        setClassState("fade-in-out-closing");
        setTimeout(() => {
            setIsVisible(false);
        }, 300);
    };

    if (!isVisible) {
        return null;
    }
    return (
        <div
            onClick={handleClick}
            className={`${classState}    
            fixed top-20 right-5 w-100 bg-rose-950 rounded-xl p-4 z-50 shadow-lg border-2 border-black cursor-pointer text-sm`}>
            <p className="text-white text-2xl font-bold">Błąd: </p>
            <span className="text-white">{errorMessage}</span>
        </div>
    );
};