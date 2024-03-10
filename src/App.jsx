import "./App.css";
import Signup from "./components/Singup/Signup";
import ProductList from "./components/ProductList/ProductList";
import Signin from "./components/Signin/Signin";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Signin />,
    },
    {
      path: "/sign-up",
      element: <Signup />,
    },
    {
      path: "/product-list",
      element: <ProductList />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
