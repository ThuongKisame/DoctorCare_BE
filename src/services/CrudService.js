import bcrypt from 'bcryptjs';

import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassWordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPassWordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                genderId: data.genderId,
                roleId: data.roleId,
            });
            resolve('create new user succeed');
        } catch (e) {
            reject(e);
        }
    });
};
let hashUserPassword = async (password) => {
    try {
        const hash = await bcrypt.hashSync(password, salt);
        return hash;
    } catch (e) {
        console.error('Lỗi xảy ra khi mã hóa mật khẩu:', e);
        // throw new Error('Lỗi xảy ra khi mã hóa mật khẩu');
    }
};

const getAllUser = async () => {
    try {
        let data = await db.User.findAll();
        return JSON.stringify(data);
    } catch (e) {
        console.log(e);
    }
};

const getUserInfoById = async (userId) => {
    try {
        let data = await db.User.findOne({ where: { id: userId } });
        return JSON.stringify(data);
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    createNewUser,
    getAllUser,
    getUserInfoById,
};
