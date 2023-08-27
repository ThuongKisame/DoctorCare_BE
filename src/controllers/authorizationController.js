import { refreshTokenRequest } from '../services/refreshTokenService';

export const authorization = {
    //create token
    handleRefreshTokenRequest: async (req, res) => {
        // console.log('auth ////////////////////////');
        //verify refreshToken
        const refreshToken = req.body.refreshToken;
        // console.log(refreshToken);
        if (!refreshToken) {
            return res.status(401).json({ message: 'cant not find refreshToken' });
        }

        let result = await refreshTokenRequest(refreshToken);

        return res.status(result?.response?.errCode?.status || 201).json(result?.response);
    },
};
