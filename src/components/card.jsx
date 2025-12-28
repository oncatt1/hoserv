export const Card = ({ children }) => {
    return (
        <div className="flex flex-col justify-center items-center p-20">
            <div className="justify-center items-center flex-col flex m-4 p-20 w-100 opacity-0 animate-fadeIn 
                shadow-2xl bg-slate-800/20 rounded-md border border-slate-700/60">
                {children}
            </div>
        </div>
    );
};