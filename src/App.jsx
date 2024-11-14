import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
// import Footer from "./Components/Footer";
import './index.css'

function App() {
  return (
    <div className="flex flex-col h-screen ">
      <Navbar />
      <main className="h-full">
        <Outlet/>      
      </main>
    </div>
  );
}

export default App;