import jwt from 'jsonwebtoken';
import { jwtSec } from '../config/config.js'; 
import userModel from '../models/userModel.js';

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not Authorized. Please login again.'
        });
    }

    try {
        const tokenDecode = jwt.verify(token, jwtSec);

        if (tokenDecode && tokenDecode.id) {
            req.userId = tokenDecode.id; 
            // ✅ Fetch user and attach to req
            const user = await userModel.findById(tokenDecode.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.'
                });
            }

            req.user = user; 
            next(); // Proceed to the next middleware or route
        } else {
            return res.status(403).json({
                success: false,
                message: 'Token invalid. Please login again.'
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

export default userAuth;
