export const errorCode = {
    errFromServer: {
        status: 500,
        value: -1,
        description: 'Error from server',
    },
    success: {
        value: 0,
        description: 'ok',
        status: 200,
    },
    notFound: {
        value: 1,
        description: 'Not found when query to db',
    },
    wrongPassword: {
        value: 2,
        description: 'wrong password',
    },
    missingParameter: {
        value: 3,
        description: 'missing data',
        status: 401,
    },
    accountIsRunning: {
        value: 4,
        description: 'This account is running in another device',
    },
    forbidden: {
        value: 5,
        description: 'Forbidden',
        status: 403,
    },
    Unauthorized: {
        value: 6,
        description: 'Invalid access',
        status: 401,
    },
    notFound: {
        value: 7,
        description: 'Not found',
        status: 404,
    },
};

export const resError = {
    errCode: errorCode.errFromServer.value,
    message: errorCode.errFromServer.description,
    status: errorCode.errFromServer.status,
};
