import jwt from 'jsonwebtoken';

// Middleware xử lý token và phân quyền
const authorizationToken = (req, res, next) => {
    const token = req.headers['authorization'];

    //   if (!token) {
    //     return res.status(401).json({ message: 'Unauthorized: No token provided' });
    //   }

    //   jwt.verify(token, secretKey, (err, user) => {
    //     if (err) {
    //       if (err.name === 'TokenExpiredError') {
    //         // Thông báo hết hạn token
    //         return res.status(401).json({ message: 'Unauthorized: Token has expired' });
    //       }

    //       // Xử lý các lỗi xác thực token khác
    //       return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    //     }

    //     req.user = user;
    //     next();
    //   });
    next();
};

export { authorizationToken };
