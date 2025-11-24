export const Card = ({ children }) => {
    return (
        <div className="flex flex-col justify-center items-center p-20">
            <div className="justify-center items-center flex-col flex m-8 p-15 w-100 
                shadow-2xl bg-purple-900/20 dark:bg-slate-800/20 rounded-md">
                {children}
            </div>
        </div>
    );
};