function Footer(){
    return(
        <footer className="flex clear-both bottom-0 h-[50px] 2xl:h-[70px] items-center px-10 
        bg-gradient-to-br to-blue-900 shadow-2xl shadow-blue-600/70 justify-between" >  
            <div className="flex-1/2">
                Pojemność dysków: 14%  [---------------------------------------] 
            </div>
            <div className="flex-1/2 text-right ">
                Twoje wykorzystanie: 6% [---------------------------------------] 
            </div>
        </footer>
    )
}
export default Footer