import { useLocation } from "react-router-dom";
import { useFetch } from "../hooks/useFetchGet";
import Loading from "./loading";
import { useUserStore } from "../utils/auth";
import { useFetchPost } from "../hooks/useFetchPost";
import { useEffect, useMemo } from "react";

export default function Sidebar() {
    const { user } = useUserStore();
    const location = useLocation().pathname;

    const dbUrl = `${import.meta.env.VITE_API_URL}/getDBs`; 
    const dbTablesUrl = `${import.meta.env.VITE_API_URL}/getDbTables`;

    const { data, refetch: refetchDbs } = useFetch(dbUrl);

    const userDbName = data?.name ?? "";
    const generalDbName = data?.general ?? "";

    const userOptions = useMemo(() => ({ dbName: userDbName }), [userDbName]);
    const generalOptions = useMemo(() => ({ dbName: generalDbName }), [generalDbName]);

    const { data: userData, refetch: refetchUserData } = useFetchPost(dbTablesUrl, userOptions);
    const { data: generalData, refetch: refetchGeneralData } = useFetchPost(dbTablesUrl, generalOptions);

    // Refetch all data when user changes
    useEffect(() => {
        if (user) {
            refetchDbs();
        }
    }, [user, refetchDbs]);

    // Refetch table data when database names are loaded
    useEffect(() => {
        if (userDbName) {
            refetchUserData();
        }
    }, [userDbName, refetchUserData]);

    useEffect(() => {
        if (generalDbName) {
            refetchGeneralData();
        }
    }, [generalDbName, refetchGeneralData]);

    if (location !== "/photos") return null;
    if (!data || !userData || !generalData) return <Loading />;
    
    return (
        <aside className="w-1/5 overflow-y-auto h-[525px] bg-violet-800/30 dark:bg-slate-800/40 rounded-br-4xl p-3">
            <div>
                <div>{data.name}</div>
            </div>

            {user === import.meta.env.VITE_ADMIN_NAME ? null : (
                <div>
                    <div>{data.general}</div>
                </div>
            )}
        </aside>
    );
}