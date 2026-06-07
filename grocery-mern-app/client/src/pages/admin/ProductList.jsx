import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { getImageUrl } from "../../utils/getImageUrl";
import { buildProductImageUrl, buildProductPlaceholderImage } from "../../utils/productImages";

const ProductList = () => {
  const { products, fetchProducts, axios } = useAppContext();

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.success(error.message);
    }
  };
  return (
    <div className="flex-1 py-6 md:py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-x-auto rounded-md bg-white border border-gray-500/20">
          <table className="min-w-[560px] md:min-w-0 md:table-auto table-fixed w-full">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">
                  Selling Price
                </th>
                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="border border-gray-300 rounded p-2">
                      <img
                        src={getImageUrl(product.image?.[0])}
                        alt="Product"
                        className="w-16"
                        onError={(e) => {
                          const step = e.currentTarget.dataset.fallbackStep || "0";
                          const fallback = buildProductImageUrl(product.name, product.category);
                          if (step === "0") {
                            e.currentTarget.dataset.fallbackStep = "1";
                            e.currentTarget.src = e.currentTarget.src.includes("tse1.mm.bing.net")
                              ? buildProductPlaceholderImage(product.name, product.category)
                              : fallback;
                          } else if (step === "1") {
                            e.currentTarget.dataset.fallbackStep = "2";
                            e.currentTarget.src = buildProductPlaceholderImage(product.name, product.category);
                          }
                        }}
                      />
                    </div>
                    <span className="truncate w-full">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    ${product.offerPrice}
                  </td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                      <input
                        onClick={() =>
                          toggleStock(product._id, !product.inStock)
                        }
                        checked={product.inStock}
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={product.inStock}
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ProductList;
