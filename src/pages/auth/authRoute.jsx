import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged} from "firebase/auth";

const AuthRoute = ({ children }) => {


    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, [auth]);

    return user ? <div>{ children }</div> : null;
}


export default AuthRoute
