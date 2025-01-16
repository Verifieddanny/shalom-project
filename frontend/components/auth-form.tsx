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
        confirmPassword: "",
        registrationNumber: "",
        phoneNumber: "",
        countryCode: "+234", // Default to Nigeria
      });
      const [isLoading, setIsLoading] = useState(false);
      
      const countryCodeOptions = [
        { value: "+244", label: "🇦🇴 Angola (+244)" },
        { value: "+257", label: "🇧🇮 Burundi (+257)" },
        { value: "+237", label: "🇨🇲 Cameroon (+237)" },
        { value: "+86", label: "🇨🇳 China (+86)" },
        { value: "+20", label: "🇪🇬 Egypt (+20)" },
        { value: "+251", label: "🇪🇹 Ethiopia (+251)" },
        { value: "+233", label: "🇬🇭 Ghana (+233)" },
        { value: "+91", label: "🇮🇳 India (+91)" },
        { value: "+225", label: "🇨🇮 Ivory Coast (+225)" },
        { value: "+81", label: "🇯🇵 Japan (+81)" },
        { value: "+254", label: "🇰🇪 Kenya (+254)" },
        { value: "+212", label: "🇲🇦 Morocco (+212)" },
        { value: "+234", label: "🇳🇬 Nigeria (+234)" },
        { value: "+250", label: "🇷🇼 Rwanda (+250)" },
        { value: "+252", label: "🇸🇴 Somalia (+252)" },
        { value: "+27", label: "🇿🇦 South Africa (+27)" },
        { value: "+211", label: "🇸🇸 South Sudan (+211)" },
        { value: "+249", label: "🇸🇩 Sudan (+249)" },
        { value: "+255", label: "🇹🇿 Tanzania (+255)" },
        { value: "+971", label: "🇦🇪 UAE (+971)" },
        { value: "+256", label: "🇺🇬 Uganda (+256)" },
        { value: "+44", label: "🇬🇧 UK (+44)" },
        { value: "+1", label: "🇺🇸 USA (+1)" },
        { value: "+260", label: "🇿🇲 Zambia (+260)" },
        { value: "+263", label: "🇿🇼 Zimbabwe (+263)" },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (type === "register" && formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        setIsLoading(true);
        try {
            const payload = role === "student" 
                ? type === "login" 
                    ? {registrationNumber: formData.registrationNumber, password: formData.password}
                    : {...formData, phoneNumber: `${formData.countryCode}${formData.phoneNumber.replace(/[^0-9]/g, '')}`}
                : {email: formData.email, password: formData.password};
            
            const response = type === "login" ? await login(payload) : role === "student" ? await register({...payload, role}):  role !== "staff" ? await register(formData) : false;

            setToken(response?.data?.accessToken);

            if (role === 'admin') {
              setAuthData({ ...response?.data?.user, role, accessToken: response?.data?.accessToken });
              router.push(`/${role}/dashboard`);
            } else if (role === "staff" && type === "register") {
              setAuthData({email: formData.email, fullName: formData.fullName, password: formData.password});
              router.push(`/staff/verify-token/`); 
            } else if (role === "staff" && type === "login") {
              setAuthData({ ...response?.data?.user, accessToken: response?.data?.accessToken });
              router.push(`/${role}/dashboard`);
            } else {
              setAuthData({
                email: response?.data?.user?.email,
                fullName: response?.data?.user?.fullName,
                id: response?.data?.user?.id,
                registrationNumber: response?.data?.user?.registrationNumber,
                role: response?.data?.user?.role,
                phoneNumber: response?.data?.user?.phoneNumber,
                accessToken: response?.data?.accessToken
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
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
            {role === "student" && (
              <>
                <input
                  type="text"
                  name="registrationNumber"
                  placeholder="Registration Number"
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                  required
                />
                <div className="flex gap-2">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="border rounded p-2 w-2/5 appearance-none bg-white"
                    required
                  >
                    {countryCodeOptions.map((codeOption) => (
                      <option key={codeOption.value} value={codeOption.value} className="text-base">
                        {codeOption.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    pattern="[0-9\s\-\(\)]+"
                    className="border rounded p-2 w-3/5"
                    required
                  />
                </div>
              </>
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
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition-colors">
          {type === "login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    );
}

export default AuthForm;