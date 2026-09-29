const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

// ============================================
// REGISTER
// ============================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // ----------------------------------------
        // Validate input
        // ----------------------------------------

        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                message:
                    "Name, email and password are required"
            });

        }


        // ----------------------------------------
        // Check existing user
        // ----------------------------------------

        const existingUser =
            await User.findOne({
                email
            });


        if (existingUser) {

            return res.status(400).json({
                message:
                    "User already exists"
            });

        }


        // ----------------------------------------
        // Hash password
        // ----------------------------------------

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ----------------------------------------
        // Create user
        // ----------------------------------------

        const user =
            await User.create({

                name,

                email,

                password:
                    hashedPassword

            });


        // ----------------------------------------
        // Response
        // ----------------------------------------

        res.status(201).json({

            message:
                "User registered successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });

    } catch (error) {

        console.error(
            "Register error:",
            error
        );

        res.status(500).json({

            message:
                "Registration failed",

            error:
                error.message

        });

    }

});


// ============================================
// LOGIN
// ============================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ----------------------------------------
        // Validate input
        // ----------------------------------------

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({
                message:
                    "Email and password are required"
            });

        }


        // ----------------------------------------
        // Find user
        // ----------------------------------------

        const user =
            await User.findOne({
                email
            });


        if (!user) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });

        }


        // ----------------------------------------
        // Compare password
        // ----------------------------------------

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });

        }


        // ----------------------------------------
        // Create JWT
        // ----------------------------------------

        const token =
            jwt.sign(

                {
                    userId:
                        user._id
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "7d"
                }

            );


        // ----------------------------------------
        // Send response
        // ----------------------------------------

        res.status(200).json({

            message:
                "Login successful",

            token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email

            }

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({

            message:
                "Login failed",

            error:
                error.message

        });

    }

});

router.get("/me", protect, async (req, res) => {

    res.status(200).json({

        message:
            "You are authenticated",

        user:
            req.user

    });

});

module.exports = router;