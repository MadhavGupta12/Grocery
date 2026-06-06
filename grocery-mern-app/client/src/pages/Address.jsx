import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Address = () => {
  const [address, setAddress] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const [loading, setLoading] = React.useState(false);
  const { axios, navigate } = useContext(AppContext);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { data } = await axios.post("/api/address/add", { address });
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border-2 border-gray-200 focus:border-[#F8C008] rounded-xl px-4 py-3 text-sm font-medium text-[#1a1a1a] outline-none transition-all placeholder-gray-400 bg-gray-50 focus:bg-white";
  const labelClass = "block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="mt-6 pb-16 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-6">
        <Link to="/" className="hover:text-[#0c831f] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-[#0c831f] transition-colors">Cart</Link>
        <span>/</span>
        <span className="text-[#1a1a1a] font-bold">Add Address</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form Panel */}
        <div className="flex-1 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-[#F8C008] px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a1a1a]/10 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#1a1a1a"/></svg>
            </div>
            <div>
              <h1 className="font-black text-[#1a1a1a] text-lg">Delivery Address</h1>
              <p className="text-[#1a1a1a]/60 text-xs font-medium">Where should we deliver in 10 minutes?</p>
            </div>
          </div>

          <form onSubmit={submitHandler} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className={labelClass}>First Name</label>
              <input type="text" name="firstName" value={address.firstName} onChange={handleChange} placeholder="John" className={inputClass} required />
            </div>

            {/* Last Name */}
            <div>
              <label className={labelClass}>Last Name</label>
              <input type="text" name="lastName" value={address.lastName} onChange={handleChange} placeholder="Doe" className={inputClass} required />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className={labelClass}>Email Address</label>
              <input type="email" name="email" value={address.email} onChange={handleChange} placeholder="you@email.com" className={inputClass} required />
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label className={labelClass}>Phone Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">+91</span>
                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className={`${inputClass} pl-12`}
                  required
                />
              </div>
            </div>

            {/* Street */}
            <div className="md:col-span-2">
              <label className={labelClass}>Street Address</label>
              <input type="text" name="street" value={address.street} onChange={handleChange} placeholder="House no., Building, Street, Area" className={inputClass} required />
            </div>

            {/* City */}
            <div>
              <label className={labelClass}>City</label>
              <input type="text" name="city" value={address.city} onChange={handleChange} placeholder="Mumbai" className={inputClass} required />
            </div>

            {/* State */}
            <div>
              <label className={labelClass}>State</label>
              <input type="text" name="state" value={address.state} onChange={handleChange} placeholder="Maharashtra" className={inputClass} required />
            </div>

            {/* Zip Code */}
            <div>
              <label className={labelClass}>PIN Code</label>
              <input type="number" name="zipCode" value={address.zipCode} onChange={handleChange} placeholder="400001" className={inputClass} required />
            </div>

            {/* Country */}
            <div>
              <label className={labelClass}>Country</label>
              <input type="text" name="country" value={address.country} onChange={handleChange} placeholder="India" className={inputClass} required />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0c831f] hover:bg-[#0a7019] disabled:bg-gray-300 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white"/></svg>
                    Save Delivery Address
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Panel */}
        <div className="lg:w-72 flex flex-col gap-4">
          {/* Delivery Info */}
          <div className="bg-[#0c831f] text-white rounded-3xl p-5">
            <div className="text-4xl mb-3">🛵</div>
            <h3 className="font-black text-lg mb-1">10-Min Delivery</h3>
            <p className="text-white/70 text-sm font-medium leading-relaxed">
              Once your address is saved, we'll deliver your order in 10 minutes guaranteed!
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {["Free delivery on first order", "Real-time order tracking", "Delivered by verified riders"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs font-semibold text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F8C008] shrink-0"></span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-[#F8C008]/10 border border-[#F8C008]/20 rounded-3xl p-5">
            <h3 className="font-black text-[#1a1a1a] text-sm mb-3 flex items-center gap-2">
              <span>💡</span> Address Tips
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                "Include apartment/flat number",
                "Add a nearby landmark",
                "Double-check your PIN code",
                "Ensure phone number is reachable",
              ].map((tip) => (
                <li key={tip} className="text-xs text-gray-600 font-medium flex items-start gap-2">
                  <span className="text-[#0c831f] mt-0.5 shrink-0">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Back to Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="w-full border-2 border-gray-200 hover:border-[#0c831f] text-[#1a1a1a] font-black py-3 rounded-2xl transition-all cursor-pointer text-sm hover:bg-[#0c831f]/5 flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Address;
