const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: "No token provided" });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    try {
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ message: "No user found" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Unauthorized role" });
        }

        next();
    };
};

module.exports = {
    verifyToken,
    checkRole
};
