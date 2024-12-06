
const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL || "";

interface Credentials {
    fullName ?: string;
    role?: string
    registrationNumber ?: string;
    password: string;
    email ?: string;
    lecturerCode ?: number;
}

export async function loginUser(role: string, credentials: Credentials) {
    const url = `${BASE_URL}/login`;
    let body;

    if(role === "student") {
        body = {
            registrationNumber: credentials.registrationNumber,
            password: credentials.password,
        };
    } else {
        body = {
            email: credentials.email,
            password: credentials.password,
        };
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if(response.ok) {
            console.log("Login successful: ", data);
        } else {
            console.error("Login failed: ", data);
        }
    } catch (error) {
        console.error("Error during login: ", error);
    }
}

export async function signUp(role: string, credentials: Credentials) {
    const url = `${BASE_URL}/auth/register`
    let body;

    if (role === "student") {
        body = {
            fullName: credentials.fullName,
            email: credentials.email,
            password: credentials.password,
            role,
            registrationNumber: credentials.registrationNumber,
        }
    } else {
        body = {
            fullName: credentials.fullName,
            email: credentials.email,
            password: credentials.password,
            role,
            lecturerCode: credentials.lecturerCode,
        }
    }

   try{ const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if(response.ok) {
        console.log("Sign up successful: ", data);
    } else {
        console.error("Sign up failed: ", data);
    }} catch (error) {
        console.error("Error during sign up: ", error);
    }
}