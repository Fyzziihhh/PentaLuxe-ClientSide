import api from "@/services/apiService";
import { AppHttpStatusCodes } from "@/types/statusCode";
import  { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ITopSellingProduct {
  _id: {
    productName: string;
  };
  sum: number;
}
interface ITopSellingCategory {
  _id: {
    categoryName: string;
  };
  sum: number;
}

const QuickActions = [
  {
    id: Math.random(),
    text: "Add New Product",
    route: "/admin/products/add",
  },
  {
    id: Math.random(),
    text: "Manage Categories",
    route: "/admin/categories",
  },
  {
    id: Math.random(),
    text: "View Orders",
    route: "/admin/orders",
  },
  {
    id: Math.random(),
    text: "Add Offers",
    route: "/admin/offer",
  },
];

// interface ISalesData{
//   field:string;
//   sales:string;
// }

const AdminDashboard = () => {
  const [filter, setFilter] = useState("yearly");
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [products, setProducts] = useState<ITopSellingProduct[]>([]);
  const [categories, setCategories] = useState<ITopSellingCategory[]>([]);

  const handleFilterChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };
  const getAdminDashboard = async () => {
    const res = await api.get(`/api/admin/dashboard?filter=${filter}`);
    if (res.status === AppHttpStatusCodes.OK) {
      const data = res.data.data;
      console.log("sales data",data)
      setSalesData(data.sales);
      setTotalSales(data.totalSales);
      setTotalOrders(data.totalOrders);
      console.log("sales data", res.data);
    }
  };
  const getBestSellingProducts = async () => {
    const res = await api.get("/api/admin/best-selling-products");
    if (res.status === AppHttpStatusCodes.OK) {
      console.log(res.data.data);
      setProducts(res.data.data);
    }
  };
  const getBestSellingCategory = async () => {
    const res = await api.get("/api/admin/best-selling-categories");
    if (res.status === AppHttpStatusCodes.OK) {
      setCategories(res.data.data)
     
    }
  };

  useEffect(() => {
    getAdminDashboard();
    getBestSellingProducts();
    getBestSellingCategory();
  }, [filter]);
  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-b from-gray-100 to-gray-300 text-gray-900">
      {/* Top Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-3xl font-bold ">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <span className="text-lg text-indigo-600 cursor-pointer hover:text-indigo-800">
            🔔
          </span>
          <span className="text-lg text-indigo-600 cursor-pointer hover:text-indigo-800">
            👤
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 space-y-8">
        {/* Overview Cards */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          <div
            className={`w-64 h-64 p-6 rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-green-600  text-white hover:shadow-2xl transition-transform transform hover:scale-105 flex flex-col items-start justify-between`}
          >
            <h2 className="text-xl font-semibold">Total Sales</h2>
            <p className="text-4xl font-bold">{totalSales.toFixed(2)}</p>
          </div>
          <div
            className={`w-64 h-64 p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-400 to-blue-600  text-white hover:shadow-2xl transition-transform transform hover:scale-105 flex flex-col items-start justify-between`}
          >
            <h2 className="text-xl font-semibold">Total Orders</h2>
            <p className="text-4xl font-bold">{totalOrders}</p>
          </div>
          {/* <div
            className={`w-64 h-64 p-6 rounded-lg shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-600  text-white hover:shadow-2xl transition-transform transform hover:scale-105 flex flex-col items-start justify-between`}
          >
            <h2 className="text-xl font-semibold">Total Customers</h2>
            <p className="text-4xl font-bold">{}</p>
          </div> */}
        </div>

        {/* Sales Chart Section */}
        <section className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-indigo-600">
              Sales Analytics
            </h2>
            <select
              value={filter}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="field" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Best Selling Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-6">
            Top 10 Best Selling Products
          </h2>
          <table className="w-full">
            {" "}
            {/* Table width */}
            <thead>
              <tr className="w-full bg-indigo-50 border-b">
                <th className="text-center p-4">Rank</th>{" "}
                {/* Centered header */}
                <th className="text-center p-4">Product</th>{" "}
                {/* Centered header */}
                <th className="text-center p-4">Sales Count</th>{" "}
                {/* Centered header */}
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product?._id.productName}
                  className="border-b hover:bg-indigo-100 transition duration-200"
                >
                  <td className="text-center p-4">{index + 1}</td>{" "}
                  {/* Centered cell */}
                  <td className="text-center p-4">
                    {product._id.productName}
                  </td>{" "}
                  {/* Centered cell */}
                  <td className="text-center p-4">{product.sum}</td>{" "}
                  {/* Centered cell */}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Quick Actions and Best Categories */}

          {/* Quick Actions */}
          <section className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-6">
              Top 3 Best Selling Categories
            </h2>
            <table className="w-full">
              <thead>
                <tr className="w-full bg-indigo-50 border-b">
                  <th className="text-center p-4">Rank</th>
                  <th className="text-center p-4">Category</th>
                  <th className="text-center p-4">Sales count</th>
                 
                </tr>
              </thead>
              <tbody>
                {categories.map((category,index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-indigo-100 transition duration-200"
                  >
                    <td className="p-4 text-center">{index + 1}</td>
                    <td className="p-4 text-center">{category._id.categoryName}</td>
                    <td className="p-4 text-center">{category.sum}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          </div>
          {/* Quick Actions */}
          <section className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto"> {/* Set max width and center */}
  <h2 className="text-2xl font-semibold text-indigo-600 mb-6">
    Quick Actions
  </h2>
  <div className="flex flex-col space-y-4">
    {QuickActions.map((action) => (
      <Link
        to={action.route}
        key={action.id}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
      >
        {action.text}
      </Link>
    ))}
  </div>
</section>

   
      </main>
    </div>
  );
};

export default AdminDashboard;
