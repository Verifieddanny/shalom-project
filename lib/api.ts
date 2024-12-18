const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL || "";

interface AuthData {
    email?: string;
    password?: string;
    registrationNumber?: string;
    fullName?: string;
    role?: string;
    lecturerCode?: string;
}
export const login = async (data: AuthData) => {
    const result = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(data),
    });

    if(!result.ok) throw new Error("Invalid credentials");
    return result.json();
};

export const register = async (data: AuthData) => {
    const result = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(data),
    });

    if(!result.ok) throw new Error("Registration failed");
    return result.json();
}