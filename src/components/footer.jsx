import { useLocation } from "react-router-dom"

function Footer(){
    let location = useLocation().pathname

    
    if(location != "/"){
        return(
            <footer className="flex clear-both bottom-0 h-[50px] 2xl:h-[70px] 2xl:text-xl items-center px-10
            bg-gradient-to-br to-blue-900 shadow-blue-600/70 dark:from-gray-900 dark:shadow-stone-800 dark:to-zinc-900 
            shadow-2xl justify-between max-xl:text-xs" >  
                <div className="flex-1/2">
                    Pojemność dysków: 14%   [--------------------------------------------------] 
                </div>
                <div className="flex-1/2 text-right ">
                    Twoje wykorzystanie: 6% [--------------------------------------------------] 
                </div>
            </footer>
        )
    }
    else{
        return
    }
}
export default Footer