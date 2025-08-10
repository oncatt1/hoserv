export const getUser = async () => {
    try {
        const res = await fetch("https://192.168.8.175:3000/api/me", {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch user by function');
        
        const data = await res.json();
        return data;
    } catch (err) {
        console.log('Error: ', err);
        return null;
    }
};