const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL || "";


export const login = async (data: any) => {
    const result = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(data),
    });

    if(!result.ok) throw new Error("Invalid credentials");
    return result.json();
};

export const register = async (data: any) => {
    const result = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(data),
    });

    if(!result.ok) throw new Error("Registration failed");
    return result.json();
}