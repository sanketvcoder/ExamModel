import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../../models/userModel.js'
import { company, jwtSec, node_env, senderEmail } from '../../config/config.js'

import transporter from '../../config/nodemailer.js'

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Missing details'
        });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const user = new userModel({
            name: name,
            email: email,
            password: hashedPass
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, jwtSec, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: node_env === 'production' ? true : false,
            sameSite: node_env === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        //sending welcome email
        const mailOption={
            from:senderEmail,
            to:email,
            subject:`welcome to ${company} `,
            text:`Welcome to ${company}'s website. Your account has been created with email id : ${email}`
        }
        await transporter.sendMail(mailOption)
        return res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
