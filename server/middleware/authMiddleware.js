const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {

    try {

        // ----------------------------------------
        // 1. Get Authorization header
        // ----------------------------------------

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({
                message:
                    "Not authorized. Token required."
            });

        }


        // ----------------------------------------
        // 2. Check Bearer token
        // ----------------------------------------

        if (
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({
                message:
                    "Invalid authorization format"
            });

        }


        // ----------------------------------------
        // 3. Extract token
        // ----------------------------------------

        const token =
            authHeader.split(" ")[1];


        // ----------------------------------------
        // 4. Verify token
        // ----------------------------------------

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // ----------------------------------------
        // 5. Find user
        // ----------------------------------------

        const user =
            await User.findById(
                decoded.userId
            ).select("-password");


        if (!user) {

            return res.status(401).json({
                message:
                    "User no longer exists"
            });

        }


        // ----------------------------------------
        // 6. Attach user to request
        // ----------------------------------------

        req.user = user;


        // ----------------------------------------
        // 7. Continue
        // ----------------------------------------

        next();

    } catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );

        return res.status(401).json({
            message:
                "Invalid or expired token"
        });

    }

};

module.exports = protect;