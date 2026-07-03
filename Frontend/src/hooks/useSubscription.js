import { useState, useEffect } from "react";
import { checkUserSubscription } from "../api/subscriptionapi";

const useSubscription = (isAuthenticated, authToken) => {
  const [currentSubscription, setCurrentSubscription] = useState(null);

  useEffect(() => {
    if (isAuthenticated && authToken) {
      fetchSubscriptionStatus();
    }
  }, [isAuthenticated, authToken]);

  const fetchSubscriptionStatus = async () => {
    try {
      const subscriptionData = await checkUserSubscription(authToken);
      setCurrentSubscription(subscriptionData);
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
    }
  };

  const clearSubscription = () => {
    setCurrentSubscription(null);
  };

  return { currentSubscription, clearSubscription };
};

export default useSubscription;
