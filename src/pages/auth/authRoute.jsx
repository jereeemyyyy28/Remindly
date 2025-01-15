import React, { useEffect, useState } from "react";
import { onAuthStateChanged} from "firebase/auth";
import { auth } from "../../components/firebaseConfig";

const AuthRoute = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                console.log("User log: ", user);
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, [auth]);

    return user ? <div>{ children }</div> : null;
}


export default AuthRoute
