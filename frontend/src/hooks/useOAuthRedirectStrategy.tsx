import { getRedirectResult } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../firebase";

const useOAuthRedirectStrategy = async () => {
    useEffect(() => {
        const getResult = async () => {
            await getRedirectResult(auth);
        };
        getResult();
    }, [auth]);
}

export default useOAuthRedirectStrategy;