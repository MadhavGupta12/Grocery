import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
const Category = () => {
  const { navigate } = useAppContext();
  return (
    <div className="mt-16 animate-slide-in-up">
      <div className="mb-2">
        <p className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Shop by Category
        </p>
        <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-2"></div>
      </div>
      <div className=" my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 items-center justify-center">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`group cursor-pointer py-5 px-3 rounded-2xl gap-2 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-primary/20 transform`}
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={category.image}
                alt={category.text}
                className="max-w-28 transition-all duration-300 group-hover:scale-125 group-hover:drop-shadow-lg"
              />
            </div>
            <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Category;
