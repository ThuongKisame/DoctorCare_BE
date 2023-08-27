import db from '../models/index';
import { errorCode, resError } from '../masterData/errCode';
import { bufferToDataUri } from '../masterData/commonFC';
import { getMarkdownById } from './markdownService';

export const getDoctor = async () => {
    try {
        const users = await db.User.findAll({
            attributes: { exclude: ['password'] },
            where: { roleId: 2 },
        });

        users.forEach((user) => {
            user.image = bufferToDataUri(user.image); // Chuyển đổi từ Buffer sang URL data URI
        });

        // await new Promise((resolve) => setTimeout(resolve, 3000));

        return {
            findDoctorResult: {
                errCode: errorCode.success.value,
                users,
            },
        };
    } catch (e) {
        console.log(e);
        return {
            findDoctorResult: {
                ...resError,
            },
        };
    }
};

export const getLimitDoctor = async (perPage, page) => {
    try {
        const { count, rows: users } = await db.User.findAndCountAll({
            where: { roleId: 2 },
            attributes: { exclude: ['password'] },
            limit: perPage, // Giới hạn số lượng item lấy trên mỗi trang
            offset: (page - 1) * perPage, // Bỏ qua số lượng item trên các trang trước đó
        });

        users.forEach((user) => {
            user.image = bufferToDataUri(user.image); // Chuyển đổi từ Buffer sang URL data URI
        });

        // await new Promise((resolve) => setTimeout(resolve, 3000));

        return {
            findDoctorResult: {
                errCode: errorCode.success.value,
                totalUsers: count, // Số lượng người dùng
                currentPage: page,
                totalPages: Math.ceil(count / perPage),
                data: users,
            },
        };
    } catch (e) {
        return {
            findDoctorResult: {
                errCode: errorCode.errFromServer.value,
                message: errorCode.errFromServer.description,
            },
        };
    }
};

export const getDoctorById = async (userId) => {
    try {
        let data = await db.User.findOne({ where: { id: userId } });
        data.image = bufferToDataUri(data.image); // Chuyển đổi từ Buffer sang URL data URI

        // await new Promise((resolve) => setTimeout(resolve, 3000));

        return {
            findDoctorResult: {
                errCode: errorCode.success.value,
                data: data,
            },
        };
    } catch (e) {
        return {
            findDoctorResult: {
                errCode: errorCode.errFromServer.value,
                message: errorCode.errFromServer.description,
            },
        };
    }
};

export const getDoctorDataById = async (userId) => {
    try {
        let doctor = await db.User.findOne({ where: { id: userId } });
        doctor.image = bufferToDataUri(doctor.image); // Chuyển đổi từ Buffer sang URL data URI

        // await new Promise((resolve) => setTimeout(resolve, 3000));
        let markdown = await getMarkdownById(userId);
        return {
            findDoctorResult: {
                errCode: errorCode.success.value,
                data: {
                    doctor: doctor,
                    markdown: markdown,
                },
            },
        };
    } catch (e) {
        return {
            findDoctorResult: {
                errCode: errorCode.errFromServer.value,
                message: errorCode.errFromServer.description,
            },
        };
    }
};
