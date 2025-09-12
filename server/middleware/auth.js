import jwt from "jsonwebtoken"
export const ensureAuthenticated=(req,res,next)=>{
    try{
        const auth=req.headers['authorization'];
        // console.log("Auth header:", auth);
        // console.log("Request URL:", req.url);
        // console.log("Request method:", req.method);
        
        if(!auth){
            console.log("No auth header found");
            return res.status(403).json({message:"Unauthorized ,JSON token is required"});
        }
        
        // Handle both "Bearer token" and direct token formats
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
        console.log("Extracted token:", token.substring(0, 20) + "...");
        
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        // console.log("Token decoded successfully:", decoded);
        req.user=decoded;
        

        next();
         
    }
    catch(error){
        console.log("Auth error:", error.message);
        return res.status(401).json({message:"Token invalid",error:error.message});
    }
}