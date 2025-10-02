// // components/utils/ClientOnly.jsx
// import { useState, useEffect } from "react";

// export default function ClientOnly({ children }) {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;
//   return children;
// }
import { useState, useEffect } from "react";

export default function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? children : fallback;
}