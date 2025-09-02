import { useState, useEffect } from "react";

type Role = "teacher" | "student";

export const useRole = (): Role => {
  const [role] = useState<Role>("teacher"); 
  // const [role] = useState<Role>("student"); 


//   useEffect(() => {
//     // Example: get role from localStorage
//     const storedRole = localStorage.getItem("role") as Role | null;

//     if (storedRole === "teacher" || storedRole === "student") {
//       setRole(storedRole);
//     } else {
//       // fallback (you can default to "student" if needed)
//       setRole("teacher");
//     }
//   }, []);

  return role;
};
