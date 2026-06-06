const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-400 mt-16">
      {/* Top Strip */}
      <div className="bg-[#F8C008] text-[#1a1a1a] text-center py-2.5 text-xs font-black tracking-wide flex items-center justify-center gap-2">
        <span className="animate-bounce-slow">⚡</span>
        Delivery in 10 minutes — Available in 100+ cities across India
        <span className="animate-bounce-slow">⚡</span>
      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-12 pb-6">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-1 mb-3">
              <span className="text-3xl font-black text-white tracking-tight">mapta</span>
              <span className="w-3 h-3 rounded-full bg-[#F8C008] mb-4 inline-block"></span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs mb-5">
              India's fastest grocery delivery. Fresh vegetables, fruits, dairy, bakery & essentials at your doorstep in 10 minutes — guaranteed.
            </p>

            {/* Stats */}
            <div className="flex gap-5 mb-6">
              <div>
                <p className="text-white font-black text-lg leading-none">10 min</p>
                <p className="text-gray-600 text-[10px] font-medium uppercase tracking-wide mt-0.5">Delivery</p>
              </div>
              <div className="w-px bg-gray-700"></div>
              <div>
                <p className="text-white font-black text-lg leading-none">5000+</p>
                <p className="text-gray-600 text-[10px] font-medium uppercase tracking-wide mt-0.5">Products</p>
              </div>
              <div className="w-px bg-gray-700"></div>
              <div>
                <p className="text-white font-black text-lg leading-none">100+</p>
                <p className="text-gray-600 text-[10px] font-medium uppercase tracking-wide mt-0.5">Cities</p>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { label: "Instagram", path: "M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM4.5 7.75A3.25 3.25 0 017.75 4.5h8.5a3.25 3.25 0 013.25 3.25v8.5a3.25 3.25 0 01-3.25 3.25h-8.5a3.25 3.25 0 01-3.25-3.25v-8.5zm9.5 1a4 4 0 11-4 4 4 4 0 014-4zm0 1.5a2.5 2.5 0 102.5 2.5 2.5 2.5 0 00-2.5-2.5zm3.5-.75a.75.75 0 11.75-.75.75.75 0 01-.75.75z" },
                { label: "Twitter", path: "M22 5.92a8.2 8.2 0 01-2.36.65A4.1 4.1 0 0021.4 4a8.27 8.27 0 01-2.6 1A4.14 4.14 0 0016 4a4.15 4.15 0 00-4.15 4.15c0 .32.04.64.1.94a11.75 11.75 0 01-8.52-4.32 4.14 4.14 0 001.29 5.54A4.1 4.1 0 013 10v.05a4.15 4.15 0 003.33 4.07 4.12 4.12 0 01-1.87.07 4.16 4.16 0 003.88 2.89A8.33 8.33 0 012 19.56a11.72 11.72 0 006.29 1.84c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.35-.01-.53A8.18 8.18 0 0022 5.92z" },
                { label: "LinkedIn", path: "M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.98 1.98 1.98h.02c1.1 0 1.98-.88 1.98-1.98C6.98 4.38 6.1 3.5 4.98 3.5zM3 8.75h3.96V21H3V8.75zm6.25 0h3.8v1.68h.05c.53-.98 1.82-2.02 3.75-2.02 4.01 0 4.75 2.64 4.75 6.07V21H17v-5.63c0-1.34-.03-3.07-1.88-3.07-1.88 0-2.17 1.47-2.17 2.98V21H9.25V8.75z" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#F8C008] hover:text-[#1a1a1a] text-gray-500 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.path}/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-white font-black text-sm uppercase tracking-wider mb-4">Company</p>
            <ul className="flex flex-col gap-2.5">
              {["About Us", "Careers", "Press", "Blog", "Investors"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-[#F8C008] transition-colors duration-200 font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-white font-black text-sm uppercase tracking-wider mb-4">Support</p>
            <ul className="flex flex-col gap-2.5">
              {["Help Center", "Contact Us", "Refund Policy", "Track Order", "Accessibility"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-[#F8C008] transition-colors duration-200 font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-black text-sm uppercase tracking-wider mb-4">Contact</p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5 text-[#F8C008]"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/></svg>
                <span className="text-sm text-gray-500 font-medium leading-snug">Bengaluru, Karnataka, India – 560001</span>
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#F8C008]"><path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/></svg>
                <a href="tel:18001234567" className="text-sm text-gray-500 hover:text-[#F8C008] transition-colors font-medium">1800-123-4567 (Free)</a>
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#F8C008]"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>
                <a href="mailto:care@mapta.in" className="text-sm text-gray-500 hover:text-[#F8C008] transition-colors font-medium">care@mapta.in</a>
              </li>
            </ul>

            {/* Delivery Hours */}
            <div className="mt-4 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-wider mb-1">Delivery Hours</p>
              <p className="text-white font-bold text-sm">6:00 AM – 12:00 AM</p>
              <p className="text-[#0c831f] font-black text-[10px] mt-0.5">⚡ Always 10 minutes</p>
            </div>
          </div>
        </div>

        {/* Payment Icons */}
        <div className="mt-10 pt-6 border-t border-white/5">
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-3 text-center">We accept</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {["VISA", "Mastercard", "UPI", "PhonePe", "GPay", "PayPal", "COD"].map((method) => (
              <span
                key={method}
                className="bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black px-3 py-1.5 rounded-lg tracking-wide hover:bg-white/10 hover:text-white transition-all cursor-default"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-5 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600 font-medium">
            © {new Date().getFullYear()} Mapta Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"].map((item) => (
              <a key={item} href="#" className="text-[11px] text-gray-600 hover:text-[#F8C008] transition-colors font-medium">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
