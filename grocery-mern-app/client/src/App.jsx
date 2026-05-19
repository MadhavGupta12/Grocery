import { Routes, Route, useLocation } from "react-router-dom";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import Auth from "./modals/Auth";
import ProductCategory from "./pages/ProductCategory";
import Address from "./pages/Address";
import MyOrders from "./pages/MyOrders";
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AddProduct from "./pages/admin/AddProduct";
import ProductList from "./pages/admin/ProductList";
import Orders from "./pages/admin/Orders";
import Analytics from "./pages/admin/Analytics";
import VerifyPayment from "./pages/VerifyPayment";

const App = () => {
  const isAdminPath = useLocation().pathname.includes("admin");
  const { showUserLogin, isAdmin } = useAppContext();
  return (
    <div className="text-default min-h-screen">
      {isAdminPath ? null : <Navbar />}
      {showUserLogin ? <Auth /> : null}
      <Toaster />
      <div
        className={`${isAdminPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/product/:category/:id" element={<SingleProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<Address />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/verify-payment" element={<VerifyPayment />} />
          <Route
            path="/admin"
            element={isAdmin ? <AdminLayout /> : <AdminLogin />}
          >
            <Route index element={isAdmin ? <Analytics /> : null} />
            <Route
              path="add-product"
              element={isAdmin ? <AddProduct /> : null}
            />
            <Route
              path="product-list"
              element={isAdmin ? <ProductList /> : null}
            />
            <Route path="orders" element={isAdmin ? <Orders /> : null} />
          </Route>
        </Routes>
      </div>
      {isAdminPath ? null : <Footer />}
    </div>
  );
};
export default App;
