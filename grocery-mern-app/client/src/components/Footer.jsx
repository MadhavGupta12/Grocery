const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
      <div className="text-gray-600 pt-12 px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="flex flex-wrap justify-between gap-12 md:gap-8">
          <div className="max-w-80">
            <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
              Mapta
            </h1>
            <p className="text-sm leading-relaxed text-gray-600">
              Your premium quick-commerce companion, bringing farm-fresh groceries, vegetables, fruits, bakery, and dairy items to your doorstep in 10 minutes.
            </p>
            <div className="flex items-center gap-4 mt-5">
              {/* Instagram */}
              <a href="#" className="hover:text-primary hover:scale-125 transition-all duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM4.5 7.75A3.25 3.25 0 017.75 4.5h8.5a3.25 3.25 0 013.25 3.25v8.5a3.25 3.25 0 01-3.25 3.25h-8.5a3.25 3.25 0 01-3.25-3.25v-8.5zm9.5 1a4 4 0 11-4 4 4 4 0 014-4zm0 1.5a2.5 2.5 0 102.5 2.5 2.5 2.5 0 00-2.5-2.5zm3.5-.75a.75.75 0 11.75-.75.75.75 0 01-.75.75z" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="hover:text-primary hover:scale-125 transition-all duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5 9H15V6.5h-1.5c-1.933 0-3.5 1.567-3.5 3.5v1.5H8v3h2.5V21h3v-7.5H16l.5-3h-3z" />
                </svg>
              </a>
              {/* Twitter */}
              <a href="#" className="hover:text-primary hover:scale-125 transition-all duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 5.92a8.2 8.2 0 01-2.36.65A4.1 4.1 0 0021.4 4a8.27 8.27 0 01-2.6 1A4.14 4.14 0 0016 4a4.15 4.15 0 00-4.15 4.15c0 .32.04.64.1.94a11.75 11.75 0 01-8.52-4.32 4.14 4.14 0 001.29 5.54A4.1 4.1 0 013 10v.05a4.15 4.15 0 003.33 4.07 4.12 4.12 0 01-1.87.07 4.16 4.16 0 003.88 2.89A8.33 8.33 0 012 19.56a11.72 11.72 0 006.29 1.84c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.35-.01-.53A8.18 8.18 0 0022 5.92z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="hover:text-primary hover:scale-125 transition-all duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.98 1.98 1.98h.02c1.1 0 1.98-.88 1.98-1.98C6.98 4.38 6.1 3.5 4.98 3.5zM3 8.75h3.96V21H3V8.75zm6.25 0h3.8v1.68h.05c.53-.98 1.82-2.02 3.75-2.02 4.01 0 4.75 2.64 4.75 6.07V21H17v-5.63c0-1.34-.03-3.07-1.88-3.07-1.88 0-2.17 1.47-2.17 2.98V21H9.25V8.75z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="hover:translate-y-0.5 transition-transform duration-300">
            <p className="text-lg font-black text-gray-900 mb-4">COMPANY</p>
            <ul className="flex flex-col gap-3 text-sm">
              {["About", "Careers", "Press", "Blog", "Partners"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary hover:translate-x-1 transition-all duration-300 font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="hover:translate-y-0.5 transition-transform duration-300">
            <p className="text-lg font-black text-gray-900 mb-4">SUPPORT</p>
            <ul className="flex flex-col gap-3 text-sm">
              {["Help Center", "Safety Information", "Cancellation Options", "Contact Us", "Accessibility"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary hover:translate-x-1 transition-all duration-300 font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="max-w-80">
            <p className="text-lg font-black text-gray-900 mb-4">STAY UPDATED</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 mb-4">
              Subscribe to our newsletter for inspiration and special offers.
            </p>
            <div className="flex items-center gap-0 group">
              <input
                type="email"
                className="bg-white border-2 border-gray-200 rounded-l-lg h-10 px-3 outline-none w-full font-medium placeholder-gray-400 focus:border-primary/50 focus:bg-primary/5 transition-all duration-300 group-hover:border-primary/20"
                placeholder="your@email.com"
              />
              <button className="flex items-center justify-center bg-gradient-to-r from-primary to-accent h-10 w-10 rounded-r-lg hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mt-10 mb-6" />
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between py-6">
          <p className="text-sm font-medium">© {new Date().getFullYear()} Mapta. All rights reserved. 💚</p>
          <ul className="flex items-center gap-6">
            {["Privacy", "Terms", "Sitemap"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-primary transition-colors duration-300 font-medium">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
