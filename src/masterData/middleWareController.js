import jwt from 'jsonwebtoken';

export const middleWareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers?.authorization;
        // console.log(token);
        if (token) {
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).json('Token is not valid');
                }
                req.user = user;
                // console.log(req.user);
                next();
            });
        } else {
            return res.status(401).json("You're not authenticated");
        }
    },
    verifyTokenAndAdminAuth: (req, res, next) => {
        middleWareController.verifyToken(req, res, () => {
            if (req.user.roleId === '1') {
                next();
            } else {
                return res.status(403).json("You're not allowed to delete other");
            }
        });
    },
};
