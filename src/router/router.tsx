import { createBrowserRouter } from "react-router";
import Layout from "../layout/Layout";
import Home from "../pages/Home.tsx";
import SignIn from "../pages/SignIn.tsx";
import SignUp from "../pages/SignUp.tsx";

const router = createBrowserRouter([
    {
        path:"/",
        element:<Layout />,
        children:[
            { path : "", element : <Home/>},
            { path : "sign-in", element : <SignIn/>},
            { path : "sign-up", element : <SignUp/>},
        ],
    }
]);


export default router;
