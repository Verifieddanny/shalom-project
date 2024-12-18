'use client'
import { useState } from "react"
import { login, register } from "@/lib/api"
import { setToken } from "@/lib/auth"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

interface AuthFormProps {
    role: "student" | "staff" | "admin";
    type: "login" | "register";
}

const AuthForm = ({role, type}: AuthFormProps) => {
    const router = useRouter();
    const { setAuthData } = useAuth();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        registrationNumber: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = role === "student" ? {registrationNumber: formData.registrationNumber, password: formData.password} : {email: formData.email, password: formData.password};
            
            console.log(({...formData, role}))
            const response = type === "login" ? await login(payload) : role === "student" ? await register({...formData, role}):  role !== "staff" ? await register(formData) : false;
            console.log(response);
            setToken(response?.data?.accessToken
            );
            if (role === "staff" && type === "register") {
              setAuthData({email: formData.email, password: formData.password})
                router.push(`/staff/verify-token/`); 
              } else {
                setAuthData(formData)
                router.push(`/${role}/dashboard`);
                            }
        } catch (error) {
            console.error("Error:", error);
            alert("Authentication failed");
        }
    };


    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md gap-4 w-80 flex flex-col ">
          {type === "register" && (
            <>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
              />
            </>
          )}
          {role === "student" && type === "register" ? (
            <>
            <input
              type="text"
              name="registrationNumber"
              placeholder="Registration Number"
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
              />
              <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
              />
              </>
          ) : (
            <input
              type="text"
              name="registrationNumber"
              placeholder="Registration Number"
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
              />
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            {type === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      );
}

export default AuthForm;