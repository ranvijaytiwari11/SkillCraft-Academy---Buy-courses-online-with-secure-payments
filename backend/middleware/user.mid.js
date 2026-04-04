import jwt from "jsonwebtoken";
import config from "../config/config.js";

// -> Validates incoming JWT bearer tokens for secure route access
function userMiddleware(req, res, next) {
  // -> Extracts the Authorization payload from client headers
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }
  
  // -> Isolates the token string
  const token = authHeader.split(" ")[1];

  try {
    // -> Cryptographically verifies token integrity using the server secret
    const decoded = jwt.verify(token, config.JWT_USER_PASSWORD);
    
    // -> Mounts the decoded user identity to the active request context
    req.userId = decoded.id;

    next();
  } catch (error) {
    // -> Rejects expired or tampered session tokens
    return res.status(401).json({ errors: "Invalid token or expired" });
  }
}

export default userMiddleware;