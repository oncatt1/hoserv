import { useLocation } from "react-router-dom"

export default function Sidebar(){
    let location = useLocation().pathname
    if(location != "/" && location != "/profile"){
        return(
            <aside className="sticky left-0 top-16 w-1/5 overflow-y-auto  h-[25/100]  bg-gray-700 ">
                <li>
                    <ul>1</ul>
                    <ul>11</ul>
                    <ul>111</ul>
                </li>
            </aside>
        )
    }
    else{
        return
    }
}