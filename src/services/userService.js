import bcrypt from 'bcryptjs';
import db from '../models/index';
import { errorCode, resError } from '../masterData/errCode';
import jwt from 'jsonwebtoken';
import { addRefreshToken } from './refreshTokenService';
import { bufferToDataUri } from '../masterData/commonFC';

const { Op } = require('sequelize');

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = async (password) => {
    try {
        const hash = await bcrypt.hashSync(password, salt);
        return hash;
    } catch (e) {
        throw new Error(e);
    }
};

const handleUserLogin = async (email, password) => {
    let exitsData = null;

    try {
        exitsData = await checkUserEmail(email);
        exitsData.image = bufferToDataUri(exitsData.image);
    } catch (error) {
        console.log(error);
        return { userData: resError };
    }

    if (exitsData) {
        //check password
        let comparePassword = await bcrypt.compare(password, exitsData.password);

        let userDataWithoutPassword = JSON.parse(JSON.stringify(exitsData));
        delete userDataWithoutPassword.password;

        if (comparePassword) {
            // Tạo access token ở đây
            const accessToken = jwt.sign(
                {
                    id: exitsData.id,
                    firstName: exitsData.firstName,
                    roleId: exitsData.roleId,
                    lastName: exitsData.lastName,
                    // image: exitsData.image,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '30s',
                },
            );

            //save refreshToken to db

            let addToken = await addRefreshToken(refreshToken, exitsData.id);

            if (addToken === -1) {
                return { userData: resError };
            }

            if (addToken !== 1) {
                return {
                    userData: {
                        errCode: errorCode.success.value,
                        message: 'ok',
                        access_token: accessToken,
                        refresh_token: addToken,
                        user: userDataWithoutPassword,
                    },
                };
            }
            const refreshToken = jwt.sign(
                {
                    id: exitsData.id,
                    firstName: exitsData.firstName,
                    roleId: exitsData.roleId,
                    lastName: exitsData.lastName,
                    // image: exitsData.image,
                },
                process.env.REFRESH_TOKEN_SECRET,
            );

            return {
                userData: {
                    errCode: errorCode.success.value,
                    message: 'ok',
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    user: userDataWithoutPassword,
                },
            };
        } else {
            return {
                userData: {
                    errCode: errorCode.wrongPassword.value,
                    message: "Your's password is wrong!",
                },
            };
        }
    } else {
        return {
            userData: {
                errCode: errorCode.notFound.value,
                message: "your's email isn't exits in the system!",
            },
        };
    }
};

const checkUserEmail = async (userEmail) => {
    try {
        let data = await db.User.findOne({ where: { email: userEmail } });
        return data ? data : false;
    } catch (e) {
        throw new Error(e);
    }
};

const getAllCodeService = (inputType) => {
    return new Promise(async (resolve, reject) => {
        try {
            let allCode;
            if (inputType) {
                allCode = await db.Allcode.findAll({ where: { type: inputType } });
            } else {
                allCode = await db.Allcode.findAll();
            }
            resolve({ errCode: errorCode.success.value, data: allCode });
        } catch (e) {
            reject(e);
        }
    });
};

const createUser = async (data) => {
    // console.log(data);
    try {
        let hashPassWordFromBcrypt = await hashUserPassword(data.password);
        //check mail, phone number

        let check = await checkUserInf(data.email, data.phoneNumber);

        if (check) {
            await db.User.create({
                email: data?.email,
                password: hashPassWordFromBcrypt,
                firstName: data?.firstName,
                lastName: data?.lastName,
                address: data?.address,
                phoneNumber: data?.phoneNumber,
                genderId: data?.genderId,
                roleId: data?.roleId,
                positionId: data?.positionId,
                image: data?.image,
            });
            return {
                createUserResult: {
                    errCode: errorCode.success.value,
                    message: errorCode.success.description,
                },
            };
        } else {
            return {
                createUserResult: {
                    errCode: errorCode.notFound.value,
                    message: 'is exist',
                },
            };
        }
    } catch (e) {
        return {
            createUserResult: {
                errCode: errorCode.errFromServer.value,
                message: errorCode.errFromServer.description,
            },
        };
    }
};

const checkUserInf = async (emailIp, phoneNumberIp) => {
    try {
        let data = await db.User.findOne({ where: { [Op.or]: [{ email: emailIp }, { phoneNumber: phoneNumberIp }] } });
        return data ? false : true;
    } catch (e) {
        throw new Error(e);
    }
};

const getUser = async (perPage, page) => {
    try {
        const { count, rows: users } = await db.User.findAndCountAll({
            attributes: { exclude: ['password'] },
            limit: perPage, // Giới hạn số lượng item lấy trên mỗi trang
            offset: (page - 1) * perPage, // Bỏ qua số lượng item trên các trang trước đó
        });

        users.forEach((user) => {
            user.image = bufferToDataUri(user.image); // Chuyển đổi từ Buffer sang URL data URI
        });

        // await new Promise((resolve) => setTimeout(resolve, 3000));

        return {
            findResult: {
                errCode: errorCode.success.value,
                totalUsers: count, // Số lượng người dùng
                currentPage: page,
                totalPages: Math.ceil(count / perPage),
                users,
            },
        };
    } catch (e) {
        return {
            findResult: {
                errCode: errorCode.errFromServer.value,
                message: errorCode.errFromServer.description,
            },
        };
    }
};

const deleteUser = async (userId) => {
    console.log(userId);
    try {
        const user = await db.User.findOne({ where: { id: userId } });

        if (!user) {
            return {
                deleteResult: {
                    errCode: errorCode.notFound.value,
                    message: errorCode.notFound.description,
                },
            };
        }

        let result = await user.destroy();

        if (result) {
            return {
                deleteResult: {
                    errCode: errorCode.success.value,
                    message: 'Delete user successfully.',
                },
            };
        } else {
            return {
                deleteResult: {
                    errCode: errorCode.errFromServer.value,
                    message: errorCode.errFromServer.description,
                },
            };
        }
    } catch (e) {
        return {
            deleteResult: {
                errCode: errorCode.errFromServer.value,
                message: errorCode.errFromServer.description,
            },
        };
    }
};

const editUser = async (updatedUser) => {
    try {
        const user = await db.User.findOne({ where: { id: updatedUser.id } });

        if (!user) {
            return {
                editResult: {
                    errCode: errorCode.notFound.value,
                    message: errorCode.notFound.description,
                },
            };
        }

        const result = await user.update(updatedUser);

        if (result) {
            return {
                editResult: {
                    errCode: errorCode.success.value,
                    message: 'Edit user successfully.',
                },
            };
        } else {
            return {
                editResult: {
                    errCode: errorCode.errFromServer.value,
                    message: errorCode.errFromServer.description,
                },
            };
        }
    } catch (e) {
        console.log(e);
        return {
            editResult: {
                errCode: errorCode.errFromServer.value,
                message: errorCode.errFromServer.description,
            },
        };
    }
};

export { getAllCodeService, handleUserLogin, createUser, getUser, deleteUser, editUser };
