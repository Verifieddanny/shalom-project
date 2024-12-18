"use client"
import { createContext, useContext, useState, } from "react";

interface AuthData {
    email?: string;
    fullName?: string;
    id?: string;
    registrationNumber?: string;
    role ?: string;
}

interface AuthContextType {
    authData: AuthData | null;
    setAuthData: React.Dispatch<React.SetStateAction<any>>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({children}: {children : React.ReactNode}) => {
    const [authData, setAuthData] = useState<AuthData | null>(null);

    return (
        <AuthContext.Provider value={{authData, setAuthData}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
