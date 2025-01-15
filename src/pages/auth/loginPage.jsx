import { useState} from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import app  from "../../components/firebaseConfig";

const LoginPage = () => {
    // Initialise Firebase authentication and navigation
    const auth = getAuth(app);
    const navigate = useNavigate();

    // State variables for managing authentication state
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Sign-in with Google
    const signInWithGoogle = async () => {
        setAuthing(true);

        // Sign in with google using Firebase
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(response => {
                console.log(response.user.uid);
                navigate("/");
            })
            .catch(err => {
                console.log(err);
                setAuthing(false);
            });
    }

    // Sign in with email and password
    const signInWithEmail = async () => {
        setAuthing(true);
        setError("");

        // Sign in with email and password using Firebase
        signInWithEmailAndPassword(auth, email, password)
            .then(response => {
                console.log(response.user.uid);
                navigate("/");
            })
            .catch(err => {
                console.log(err);
                setError(err.message);
                setAuthing(false);
            });
    }

    return (
        <div className="w-full h-screen items-center flex justify-center bg-zinc-800">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h3 className="text-2xl font-bold text-center text-black mb-6">Login</h3>

                {/* Input fields */}
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                </div>

                {/* Login button */}
                <button
                    onClick={signInWithEmail}
                    disabled={authing}
                    className="w-full bg-blue-600 text-white font-bold py-3 mt-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    Log In with Email and Password
                </button>

                {/* Error message */}
                {error && (
                    <div className="text-red-500 text-sm mt-4 text-center">{error}</div>
                )}

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="w-full h-[1px] bg-gray-300"></div>
                    <span className="px-4 text-gray-500">OR</span>
                    <div className="w-full h-[1px] bg-gray-300"></div>
                </div>

                {/* Google login button */}
                <button
                    onClick={signInWithGoogle}
                    disabled={authing}
                    className="w-full bg-red-600 text-white font-bold py-3 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
                >
                    Log in with Google
                </button>

                {/* Register link */}
                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
}


export default LoginPage;
