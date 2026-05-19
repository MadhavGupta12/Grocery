import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCartItems } = useAppContext();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        searchParams.get("token");

        // Get pending order from localStorage
        const pendingOrder = localStorage.getItem("pendingOrder");
        if (!pendingOrder) {
          toast.error("Order information not found");
          navigate("/cart");
          return;
        }

        const { orderId, paypalOrderId } = JSON.parse(pendingOrder);

        // Verify payment with backend
        const { data } = await axios.post("/api/order/paypal/verify", {
          orderId,
          paypalOrderId,
        });

        if (data.success) {
          toast.success("Payment verified successfully!");
          setCartItems({});
          localStorage.removeItem("pendingOrder");
          navigate("/my-orders");
        } else {
          toast.error(data.message || "Payment verification failed");
          navigate("/cart");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error(error.message || "Payment verification failed");
        navigate("/cart");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, setCartItems]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {verifying ? (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-lg font-medium">Verifying payment...</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg font-medium">Redirecting...</p>
        </div>
      )}
    </div>
  );
};

export default VerifyPayment;
