'use client'
import { useState } from "react"
import { login, register } from "@/lib/api"
import { setToken } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface AuthFormProps {
    role: "student" | "staff" | "admin";
    type: "login" | "register";
}

const AuthForm = ({role, type}: AuthFormProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        registrationNumber: "",
        fullName: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = role === "student" ? {registrationNumber: formData.registrationNumber, password: formData.password} : {email: formData.email, password: formData.password};

            const response = type === "login" ? await login(payload) : await register(formData);
            console.log(response);
            // setToken(response.token);

            if (role === "staff" && type === "login") {
                router.push("/staff/verify-token"); 
              } else {
                router.push(`/${role}/dashboard`);
              }
        } catch (error) {
            console.error("Error:", error);
            alert("Authentication failed");
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "register" && (
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              className="input"
              required
            />
          )}
          {role === "student" ? (
            <input
              type="text"
              name="registrationNumber"
              placeholder="Registration Number"
              onChange={handleChange}
              className="input"
              required
            />
          ) : (
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="input"
              required
            />
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="input"
            required
          />
          <button type="submit" className="btn-primary">
            {type === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      );
}