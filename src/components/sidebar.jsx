import { useLocation } from "react-router-dom"

export default function Sidebar(){
    let location = useLocation().pathname
    if(location == "/photos"){
        return(
            <aside className="w-1/5 overflow-y-auto  h-[525px] bg-violet-800/30 rounded-br-4xl p-3">
                elements
            </aside>
        )
    }
    else{
        return
    }
}