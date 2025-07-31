import { FaMoon } from "react-icons/fa";
function Footer(){
    return(
        <footer className="flex clear-both sticky bottom-0 h-[50px] 2xl:h-[70px] items-center px-10 
        bg-gradient-to-br to-blue-900 shadow-2xl shadow-blue-600/70">
            <div className="flex-5/6">
                <div className="flex">
                    <span className="flex-1">
                        Pojemność dysków: 14% 
                    </span>
                    <span className="flex-1">
                        Twoje wykorzystanie: 6%
                    </span>
                </div>
            </div>
            <div className="flex-1/6 float-right text-gray-800 text-right">
                <span className="flex justify-end">
                    <FaMoon/>
                </span>
            </div>
        </footer>
    )
}
export default Footer