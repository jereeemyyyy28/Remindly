import  NavBar  from "../../components/navBar.jsx";
import { signOut } from "firebase/auth";
import { auth } from "../../components/firebaseConfig.js";
import { useNavigate } from "react-router-dom";


const HomePage = () => {

    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully");
            navigate("/login"); // Navigate to the login page after signing out
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    }

    return (
        <div className="p-6">
            <NavBar/>
            <h1 className="text-3xl font-bold">Home</h1>
            <p>Welcome to the home page!</p>

            {/* Sign Out Button */}
            <button
                onClick={handleSignOut}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Sign Out
            </button>
        </div>
    );
};

export default HomePage;
