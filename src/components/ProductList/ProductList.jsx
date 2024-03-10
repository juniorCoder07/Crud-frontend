import React, { useEffect, useState } from "react";
import AddProductModel from "../AddProductModel/AddProductModel";
import axios from "axios";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/getallproducts`,

          {
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProducts(result.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (_id) => {
    try {
      setIsLoading(true);
      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/deleteproduct`,
        {
          _id: _id,
        },

        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (result.status === 200) {
        toast.success(result.data.message);
        const updatedProducts = products.filter(
          (product) => product._id !== _id
        );
        setProducts(updatedProducts);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Server Error");
    }
  };

  useEffect(() => {
    if (!cookies.access_token) {
      navigateTo("/");
    }
  }, []);

  const handleLogout = () => {
    removeCookie("access_token");
    navigateTo("/");
  };

  return (
    <div className="container mx-auto mt-8">
      {isLoading && <Loader />}
      <div className="flex justify-between items-center m-4">
        <div>
          <h1 className="text-2xl font-semibold">Your Product List</h1>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-900 focus:outline-none"
          >
            Logout
          </button>
        </div>
        <button
          onClick={() => setShowAddProductModal(true)}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-green-600 focus:outline-none focus:bg-green-600"
        >
          Add Product
        </button>
      </div>
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden m-4"
          >
            <div className="p-4">
              <div className="text-sm text-gray-900">
                Product Name: {product.name}
              </div>
              <div className="text-sm text-gray-900">
                Price: {product.price}
              </div>
              <div className="text-sm text-gray-900">Date: {product.date}</div>
            </div>
            <div className="flex justify-center border-t border-gray-200 py-2">
              <button
                onClick={() => {
                  setEditProduct(product);
                  setShowAddProductModal(true);
                }}
                className="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">No products available</p>
        </div>
      )}

      {showAddProductModal && (
        <AddProductModel
          setShowAddProductModal={setShowAddProductModal}
          editProduct={editProduct}
          products={products}
          setProducts={setProducts}
          setEditProduct={setEditProduct}
        />
      )}
    </div>
  );
};

export default ProductList;
