
const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL || "";

export interface Credentials {
    fullName ?: string;
    role?: string
    registrationNumber ?: string;
    password: string;
    email ?: string;
    lecturerCode ?: number;
}

export async function loginUser(role: string, credentials: Credentials) {
    const url = `${BASE_URL}/auth/login`;
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



  // Admin Route: Generate Lecturer Code
  export async function generateLecturerCode(adminToken: string) {
    const url = `${BASE_URL}/admin/create-lecturer-code`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Lecturer code generated successfully: ", data);
            return data;
        } else {
            console.error("Failed to generate lecturer code: ", data);
            throw new Error(data.message || "Failed to generate lecturer code");
        }
    } catch (error) {
        console.error("Error generating lecturer code: ", error);
        throw error;
    }
}
