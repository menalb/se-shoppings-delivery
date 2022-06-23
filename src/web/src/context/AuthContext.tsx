import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react"
import { Loader } from "../feature/Loader";
import { auth, db, logInWithEmailAndPassword } from "../firebase-config";

interface Props {
    children: React.ReactNode;
}

export interface IAuth {
    currentUser: User | null
    login?: (email: string, password: string) => void;
    logout?: () => void;
    roles: string[];
}

const defaultState: IAuth = {
    currentUser: null,
    roles: []
}

export const AuthContext = React.createContext(defaultState);

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({} as User | null)
    const [roles, setRoles] = useState([] as string[])

    const [loading, setLoading] = useState(true)

    function login(email: string, password: string) {
        return logInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }

    const setUserRoles = async (userId: string) => {
        const docRef = doc(db, 'users', userId ?? '');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const roles = docSnap.data().roles as string[];
            setRoles(roles);
        }
        else {
            setRoles([] as string[])
        }
        setLoading(false)

    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            if (user) {                
                setUserRoles(user.uid);                
            }
            else {
                setLoading(false)
            }            
        })

        return unsubscribe
    }, [])


    const value = {
        currentUser, login, logout, roles
    };
    return (
        <AuthContext.Provider value={value}>
            {loading ? <Loader isLoading={loading}></Loader> : !loading && children}            
        </AuthContext.Provider>
    )
}
export function useAuth() {
    return useContext(AuthContext);
}