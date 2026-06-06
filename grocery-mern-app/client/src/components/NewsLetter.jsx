const NewsLetter = () => {
  return (
    <div className="my-16 flex flex-col items-center justify-center text-center space-y-6 animate-slide-in-up">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-primary/5 to-transparent rounded-3xl blur-3xl"></div>
      
      <div className="space-y-3">
        <h1 className="md:text-4xl text-2xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">
          Never Miss a Deal! 🎁
        </h1>
        <p className="md:text-lg text-gray-600 font-medium max-w-xl mx-auto">
          Subscribe to get the latest offers, new arrivals, and exclusive discounts delivered to your inbox
        </p>
      </div>

      <form className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12 group">
        <input
          className="border-2 border-gray-200 rounded-l-2xl h-full outline-none w-full px-5 text-gray-700 font-medium placeholder-gray-400 focus:border-primary/50 focus:bg-primary/5 transition-all duration-300 group-hover:border-primary/20"
          type="email"
          placeholder="✉️ Enter your email"
          required
        />
        <button
          type="submit"
          className="md:px-8 px-6 h-full text-white bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 cursor-pointer rounded-r-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          Subscribe
        </button>
      </form>

      <p className="text-xs text-gray-500 font-medium">
        ✓ No spam, unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  );
};
export default NewsLetter;
