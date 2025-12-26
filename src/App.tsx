import { RouterProvider } from "react-router";
import router from "./router/router.tsx";

function App() {
  return (
    <RouterProvider router={router}>
    </RouterProvider>
  )
}

export default App
