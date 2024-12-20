
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

export const generateToken = async (accessToken: string) => {
    const result = await fetch(`${BASE_URL}/admin/create-lecturer-code`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + accessToken
      },
    });

    console.log(result);

    const contentType = result.headers.get("content-type");
    if (!result.ok) {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await result.json();
        throw new Error(errorData.message || "Failed to generate token");
      } else {
        const errorText = await result.text();
        throw new Error(errorText || "Failed to generate token");
      }
    }

    if (contentType && contentType.includes("application/json")) {
      return result.json();
    } else {
      const responseText = await result.text();
      throw new Error(responseText || "Unexpected response format");
    }
};

  export const registerCourses = async  (data: {session: string, semester: number; courses: string[]}) => {
    const result = await fetch(`${BASE_URL}/student/register-courses`, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(data),
    });

    if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.message || "Failed to register courses");
    }

    return result.json();
  }

  export const getRegisteredCourses = async (session?: string, semester?: number) => {
    const queryParams = new URLSearchParams();

    if (session) queryParams.append("session", session);
    if (semester) queryParams.append("semester", semester.toString());

    const result = await fetch(`${BASE_URL}/student/registered-courses?${queryParams.toString()}`, {
        method: "GET",
        headers: {"content-type": "application/json"},
    });

    if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.message || "Failed to retrieve registered courses");
      }
    
      return result.json();
  }

  export const deleteCourseRegistration = async (id: string) => {
    const result = await fetch(`${BASE_URL}/student/registration/${id}`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
  
    if (!result.ok) {
      const errorData = await result.json();
      throw new Error(errorData.message || "Failed to delete course registration");
    }
  
    return result.json();
  };