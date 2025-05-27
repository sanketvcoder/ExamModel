export const isAuthenticated = async(req,res)=>{
    try {
        return res.status(200).json({success:true})
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
}