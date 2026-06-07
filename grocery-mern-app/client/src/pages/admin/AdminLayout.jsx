import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
const AdminLayout = () => {
   const { setIsAdmin, clearAdminSession, axios, navigate } = useAppContext();
  const sidebarLinks = [
    { name: "Dashboard", path: "/admin", icon: assets.leaf_icon },
    { name: "Add Product", path: "/admin/add-product", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/admin/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/admin/orders", icon: assets.order_icon },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/admin/logout");
      if (data.success) {
        clearAdminSession();
        delete axios.defaults.headers.common["Authorization"];
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      clearAdminSession();
      delete axios.defaults.headers.common["Authorization"];
      setIsAdmin(false);
      navigate("/");
      toast.error(error.response?.data?.message || "Logged out locally");
      console.error(error);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between gap-3 px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
        <Link to={"/"}>
          <h1 className="text-lg sm:text-2xl font-semibold leading-tight">Grocery Store App</h1>
        </Link>
        <div className="flex items-center gap-2 sm:gap-5 text-gray-500">
          <p className="hidden sm:block">Hi! Admin</p>
          <button
            onClick={logout}
            className="border rounded-full text-sm px-3 sm:px-4 py-1 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex min-w-0 flex-col md:flex-row">
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r md:min-h-[calc(100vh-57px)] text-base border-gray-300 flex md:flex-col overflow-x-auto no-scrollbar bg-white">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/admin"}
              className={({ isActive }) => `flex shrink-0 items-center py-3 px-4 gap-3 
                            ${
                              isActive
                                ? "border-b-4 md:border-b-0 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500"
                                : "hover:bg-gray-100/90 border-white "
                            }`}
            >
              <img src={item.icon} alt="" className="w-6 h-6 md:w-7 md:h-7" />
              <p className="text-sm md:text-base whitespace-nowrap">{item.name}</p>
            </NavLink>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default AdminLayout;
