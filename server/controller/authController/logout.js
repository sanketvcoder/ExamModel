import { node_env } from '../../config/config.js'
export const logout=async(req,res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: node_env === 'production' ? true : false,
            sameSite: node_env === 'production' ? 'none' : 'strict',
        });

        return res.status(200).json({
            success: true,
            message: 'Logged out'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}