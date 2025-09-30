import { useFetch } from "../hooks/useFetch";

export const getUser = async () => {
    const {data: user, loading, error } = useFetch("https://192.168.8.175:3000/api/me")
    //todo
};