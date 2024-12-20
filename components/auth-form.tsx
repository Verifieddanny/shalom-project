'use client'
import { useState } from "react"
import { login, register } from "@/lib/api"
import { setToken } from "@/lib/auth"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import Loader from "./loader"

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
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = role === "student" ? {registrationNumber: formData.registrationNumber, password: formData.password} : {email: formData.email, password: formData.password};
            
            const response = type === "login" ? await login(payload) : role === "student" ? await register({...formData, role}):  role !== "staff" ? await register(formData) : false;

            setToken(response?.data?.accessToken);

            if (role === 'admin') {
              setAuthData({ ...response?.data?.user, role, accessToken: response?.data?.accessToken });
              router.push(`/${role}/dashboard`);
            } else if (role === "staff" && type === "register") {
              setAuthData({email: response?.data?.user?.email, fullName: response?.data?.user?.fullName});
              router.push(`/staff/verify-token/`); 
            } else {
              setAuthData({
                email: response?.data?.user?.email,
                fullName: response?.data?.user?.fullName,
                id: response?.data?.user?.id,
                registrationNumber: response?.data?.user?.registrationNumber,
                role: response?.data?.user?.role,
              });
              router.push(`/${role}/dashboard`);
            }
        } catch (error) {
          setIsLoading(false);
          console.error("Error:", error);
          alert("Authentication failed");
        }
    };

    if (isLoading) {
      return <Loader />
    }

    return (
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md gap-4 w-80 flex flex-col">
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
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
            {role === "student" && (
              <input
                type="text"
                name="registrationNumber"
                placeholder="Registration Number"
                onChange={handleChange}
                className="border rounded w-full p-2"
                required
              />
            )}
          </>
        )}
        {type === "login" && (
          <>
            {role === "student" ? (
              <input
                type="text"
                name="registrationNumber"
                placeholder="Registration Number"
                onChange={handleChange}
                className="border rounded w-full p-2"
                required
              />
            ) : (
              <input
                type="email"
                name="email"
                placeholder="Email"
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
          </>
        )}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          {type === "login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    );
}

export default AuthForm;