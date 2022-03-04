const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();
const { isExpired } = require('../helpers/token');
const User = require('../models/User.model');

async function verifyToken(req, res, next) {
    const token = req.signedCookies.access_token && req.signedCookies.access_token.split(' ')[1];
    
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).render('status', {
            notification: {
                title: 'Unauthorized',
                message: 'Access denied',
            }
        });
    } else {
        const isExpiredToken = await isExpired(token, process.env.ACCESS_TOKEN_SECRET).catch(err => {
            console.error(error);
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Invalid token',
            });
        });

        if (isExpiredToken) {
            return res.status(StatusCodes.UNAUTHORIZED).render('status', {
                notification: {
                    title: 'Token expired',
                    message: 'Your token expired! Please generate a new token',
                }
            })
        }
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findOne({ _id: payload.id });
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).render('status', {
                notification: {
                    title: 'Unauthorized',
                    message: 'You are unauthorized',
                }
            });
        } else {
          req.user = user;  
        }
        next();
    }
}

function refreshToken(req, res) {
    const refreshToken = req.session.token.split(' ')[1];
    if (!refreshToken) {
        return res.status(StatusCodes.UNAUTHORIZED).render("status", {
            notification: {
                title: 'Not found',
                message: 'Refresh token not found',
            }
        })
    }

    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const { id: userId } = user;
        const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET)
        res.cookie('access_token', accessToken);
    } catch (error) {
        return res.status(StatusCodes.FORBIDDEN).render({
            notification: {
                title: 'Forbidden',
                message: 'Invalid token',
            }
        })
    }
}

///////////////////////////
// const catchError = (req, res) => {
//     const { TokenExpiredError } = jwt;
//     if (err instanceof TokenExpiredError) {
//         return res.status(StatusCodes.UNAUTHORIZED).json({
//             success: false,
//             message: 'Unauthorized! Access token was expired',
//         });
//     }
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//             success: false,
//             message: 'Unauthorized!',
//         });
// }

module.exports = {
    verifyToken,
    refreshToken,
};
