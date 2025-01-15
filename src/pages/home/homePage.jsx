import  NavBar  from "../../components/navBar.jsx";

const HomePage = () => {
    return (
        <div className="p-6">
            <NavBar/>
            <h1 className="text-3xl font-bold">Home</h1>
            <p>Welcome to the home page!</p>
        </div>
    );
};

export default HomePage;
