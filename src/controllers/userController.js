import { errorCode, resError } from '../masterData/errCode';
import * as userService from '../services/userService';

//login api
const handleLogin = async (req, res) => {
    const wait = async (milliseconds) => {
        await new Promise((resolve) => setTimeout(resolve, milliseconds));
    };
    await wait(1000);

    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res
            .status(400)
            .json({ errCode: errorCode.missingParameter.value, message: errorCode.missingParameter.description });
    }

    //return user information
    let result = await userService.handleUserLogin(email, password);
    //set jwt

    return res.status(200).json(result?.userData);
};

const handleRegister = async (req, res) => {
    let result = await userService.createUser(req.body);
    return res.status(200).json(result?.createUserResult);
};

const handleGetUser = async (req, res) => {
    const perPage = parseInt(req.body.perPage) || 10; // Số lượng item trên mỗi trang, mặc định là 10
    const page = parseInt(req.body.page) || 1; // Vị trí trang cần lấy, mặc định là 1

    let result = await userService.getUser(perPage, page);

    return res.status(200).json(result?.findResult);
};

const getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.body?.type);
        return res.status(200).json(data);
    } catch (e) {
        console.log('get all code err', e);
        return res.status(200).json(resError);
    }
};

const handleDeleteUser = async (req, res) => {
    let userId = req.body.id;
    let result = await userService.deleteUser(userId);

    return res.status(200).json(result?.deleteResult);
};

const handleEditUser = async (req, res) => {
    let user = req.body.user;
    //validate input,
    let result = await userService.editUser(user);

    return res.status(200).json(result?.editResult);
};

module.exports = {
    handleLogin,
    getAllCode,
    handleRegister,
    handleGetUser,
    handleDeleteUser,
    handleEditUser,
};
