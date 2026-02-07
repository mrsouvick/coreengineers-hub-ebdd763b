import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthProvider";

type AdminState = {
  isAdmin: boolean;
  loading: boolean;
};

const useAdmin = (): AdminState => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadRole = async () => {
      if (!user?.uid) {
        if (active) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      const roleRef = doc(db, "roles", user.uid);
      const snapshot = await getDoc(roleRef);
      if (!active) return;
      const role = snapshot.data()?.role;
      setIsAdmin(role === "admin");
      setLoading(false);
    };

    loadRole();

    return () => {
      active = false;
    };
  }, [user?.uid]);

  return { isAdmin, loading };
};

export default useAdmin;
