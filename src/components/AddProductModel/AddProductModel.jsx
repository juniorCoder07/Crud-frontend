import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";
const productSchema = yup.object({
  name: yup.string().required("Product Name is Required"),
  price: yup.number().required("Product Price is Required"),
  date: yup.string().required("Date is required"),
});
const AddProductModel = ({
  setShowAddProductModal,
  editProduct,
  products,
  setProducts,
}) => {
  const [cookies] = useCookies(["access_tokken"]);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    values: editProduct,
    reValidateMode: "onChange",
    resolver: yupResolver(productSchema),
  });

  const onSubmit = async (values) => {
    try {
      if (editProduct) {
        const result = await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/editproduct`,
          {
            _id: editProduct._id,
            name: values.name,
            price: values.price,
            date: values.date,
          },

          {
            headers: {
              Authorization: ` Bearer ${cookies.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (result.status === 200) {
          toast.success(result.data.message);
          const updatedProducts = products.map((product) =>
            product._id === editProduct._id
              ? { ...product, ...result.data.product }
              : product
          );
          console.log(updatedProducts, "update");
          setProducts(updatedProducts);
          setShowAddProductModal(false);
        }
      } else {
        const result = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/addproduct`,
          {
            name: values.name,
            price: values.price,
            date: values.date,
          },

          {
            headers: {
              Authorization: ` Bearer ${cookies.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (result.status === 200) {
          toast.success(result.data.message);
          setShowAddProductModal(false);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Product Name:
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter product name"
              {...register("name", { required: true })}
            />
            <p className="text-sm text-red-600">
              {errors && errors?.name?.message}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price:
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter price"
              {...register("price", { required: true })}
            />
            <p className="text-sm text-red-600">
              {errors && errors?.price?.message}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date:
            </label>
            <input
              type="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter date"
              {...register("date", { required: true })}
            />
            <p className="text-sm text-red-600">
              {errors && errors?.date?.message}
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:bg-gray-600 mr-2"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModel;
