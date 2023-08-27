import { errorCode } from '../masterData/errCode';
import db from '../models/index';
import jwt from 'jsonwebtoken';

const addRefreshToken = async (refreshTokenParam, userIdParam) => {
    try {
        let existingData = await db.Refresh_tokens.findOne({ where: { userId: userIdParam } });

        if (existingData) {
            // console.log(existingData.refreshToken);
            return existingData.refreshToken;
        } else {
            await db.Refresh_tokens.create({ refreshToken: refreshTokenParam, userId: userIdParam });
        }

        return 1; // Lưu thành công
    } catch (e) {
        console.log('Error saving refresh token:', e);
        return -1;
    }
};

const verifyRefreshToken = async (refreshToken) => {
    try {
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
            return data;
        });
        return decode;
    } catch (e) {
        console.log('forbidden refresh token');
        return false;
    }
};

export const refreshTokenRequest = async (refreshToken) => {
    console.log('request refresh token ');
    //verify refreshToken
    const decode = await verifyRefreshToken(refreshToken);
    if (!decode) {
        return {
            response: {
                errCode: errorCode.forbidden,
            },
        };
    }

    try {
        //check refresh token inside database
        let existToken = await db.Refresh_tokens.findOne({ where: { userId: decode?.id } });

        if (!existToken) {
            return {
                response: {
                    errCode: errorCode.notFound,
                },
            };
        }

        const accessToken = jwt.sign(
            {
                id: decode.id,
                firstName: decode.firstName,
                roleId: decode.roleId,
                lastName: decode.lastName,
                // image: exitsData.image,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '30s',
            },
        );

        return {
            response: {
                errCode: errorCode.success,
                access_token: accessToken,
            },
        };
    } catch (e) {
        return {
            response: {
                errCode: errorCode.errFromServer,
            },
        };
    }
};

export const checkRefreshToken = (userId, refreshToken) => {};

export { addRefreshToken };
