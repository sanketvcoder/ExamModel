import verifiedUsers from "../utils/verifyEmailPassword.js"

const checkVerification = (req,res,next)=>{
    const userId = req.userId
    console.log(userId)
    if(!verifiedUsers.has(userId)){
        return res.status(403).json({
            success: false,
            message: "Re-verification required before updating profile",
        })
    }

    verifiedUsers.delete(userId);
    next();


}
export default checkVerification