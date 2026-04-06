export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:8001/api/v1"
    : "/api/v1");

  
  
   
