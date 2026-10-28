import React, { useEffect, useState } from "react";
import apiCall from "../../utils/axiosInstance";
const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);

  useEffect(() => {
    const verifyPremiumUser = async () => {
      const res = await apiCall.get("/premium/verify");

      if (res.data.isPremium) {
        setIsUserPremium(true);
      }
    };
    verifyPremiumUser();
  }, []);

  const handleBuyPremium = async (type) => {
    const order = await apiCall.post("/payment/create", {
      membershipType: type,
    });

    //after an order it should have dialog box open
    const { keyId, amount, currency, orderId, notes } = order.data;
    const { firstName, lastName, emailId } = notes;
    //information require to make dialogbox
    const options = {
      key: keyId,
      amount: amount,
      currency: currency,
      name: "Partner",
      description: "Find your Patner",
      order_id: orderId,
      // callback_url: "http://local:5173/payment-success",
      prefill: {
        name: `${firstName} ${lastName}`,
        email: emailId,
      },
      theme: {
        color: "#F37254",
      },
    };

    //we added script in index.html so Razorpay is attached to window object
    const rzp = new window.Razorpay(options);  //this Razorpay instance will come from script that we added in index.html
    rzp.open();
  };

  return isUserPremium ? (
    <div className="flex flex-col items-center justify-center text-center min-h-[50vh] w-full max-w-md mx-auto px-4 py-8 animate-fadeIn">
      <div className="w-20 h-20 rounded-full bg-success/15 border border-success/30 flex items-center justify-center shadow-lg mb-6 text-4xl" aria-hidden="true">
        👑
      </div>
      <h3 className="text-2xl font-serif font-black text-base-content">Premium Active</h3>
      <p className="text-sm text-base-content/60 mt-3 leading-relaxed">
        You are already a premium cluster member. Thank you for supporting Partner!
      </p>
    </div>
  ) : (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-8 items-stretch w-full max-w-5xl mx-auto">
      {/* Silver Plan Card */}
      <div
        className="card flex-1 bg-base-200 border border-base-300 shadow-xl hover:shadow-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 p-6 sm:p-8 flex flex-col gap-5 rounded-2xl relative overflow-hidden"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-base-content/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-start">
          <span className="badge badge-neutral font-bold tracking-widest uppercase text-[10px] px-2.5 py-1">
            Silver Plan
          </span>
          <div className="text-3xl text-base-content/60" aria-hidden="true">
            🥈 
          </div>
        </div>

        <div>
          <h2 className="font-serif font-black text-2xl text-base-content tracking-tight">
            Silver Membership
          </h2>
          <p className="text-sm text-base-content/60 mt-1 font-medium">
            15 day plan — perfect for getting started
          </p>
        </div>

        <div className="divider my-0 border-base-300" />

        <ul className="flex flex-col gap-3.5 flex-1 text-sm text-base-content/80 font-medium">
          <li className="flex items-center gap-2.5">
            <span className="text-success font-bold text-lg" aria-hidden="true">✓</span> 50 connection requests per day
          </li>
          <li className="flex items-center gap-2.5">
            <span className="text-success font-bold text-lg" aria-hidden="true">✓</span> Silver badge visible on profile
          </li>
          <li className="flex items-center gap-2.5">
            <span className="text-success font-bold text-lg" aria-hidden="true">✓</span> Valid for 15 days
          </li>
        </ul>

        <div className="mt-4 pt-2">
          <button
            className="btn btn-neutral w-full h-12 rounded-xl font-bold tracking-wide shadow-lg shadow-neutral/10 hover:shadow-neutral/20 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-neutral/50"
            onClick={() => handleBuyPremium("silver")}
          >
            Buy Silver - ₹299
          </button>
        </div>
      </div>

      {/* Gold Plan Card */}
      <div
        className="card flex-1 bg-base-200 border-2 border-primary shadow-xl hover:shadow-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 p-6 sm:p-8 flex flex-col gap-5 rounded-2xl relative overflow-hidden"
      >
        {/* Subtle decorative glow overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <span className="absolute top-3 right-3 badge badge-primary font-bold text-[9px] tracking-widest uppercase py-1 px-2.5 shadow-md">
          Most Popular
        </span>

        <div className="flex justify-between items-start">
          <span className="badge badge-primary font-bold tracking-widest uppercase text-[10px] px-2.5 py-1">
            Gold Plan
          </span>
          <div className="text-3xl" aria-hidden="true">
            🥇
          </div>
        </div>

        <div>
          <h2 className="font-serif font-black text-2xl text-base-content tracking-tight">
            Gold Membership
          </h2>
          <p className="text-sm text-base-content/60 mt-1 font-medium">
            1 month plan — our best value offer
          </p>
        </div>

        <div className="divider my-0 border-base-300" />

        <ul className="flex flex-col gap-3.5 flex-1 text-sm text-base-content/80 font-medium">
          <li className="flex items-center gap-2.5">
            <span className="text-primary font-bold text-lg" aria-hidden="true">★</span> Unlimited requests per day
          </li>
          <li className="flex items-center gap-2.5">
            <span className="text-primary font-bold text-lg" aria-hidden="true">★</span> Gold badge visible on profile
          </li>
          <li className="flex items-center gap-2.5">
            <span className="text-primary font-bold text-lg" aria-hidden="true">★</span> Valid for 1 full month
          </li>
        </ul>

        <div className="mt-4 pt-2">
          <button
            className="btn btn-primary w-full h-12 rounded-xl font-bold tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/50 text-primary-content"
            onClick={() => handleBuyPremium("gold")}
          >
            Buy Gold - ₹699
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
