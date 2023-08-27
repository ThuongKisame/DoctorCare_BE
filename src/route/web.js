import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import {
    handleGetDoctor,
    handleGetDoctorById,
    handleGetDoctorDataById,
    handleGetLimitDoctor,
} from '../controllers/doctorController';
import { handleCreateMarkdown, handleGetMarkdown } from '../controllers/markdownController';
import { authorization } from '../controllers/authorizationController';
import { middleWareController } from '../masterData/middleWareController';
import { scheduleController } from '../controllers/scheduleController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUDPage);
    router.get('/get-crud', homeController.getCRUDData);

    router.post('/post-crud', homeController.postCrud);

    router.get('/edit-crud', homeController.editCrud);

    // test api
    router.get('/api/test', (req, res) => res.status(200).json('oke'));

    //api
    router.post('/api/login', userController.handleLogin);
    router.post('/api/user/createUser', middleWareController.verifyTokenAndAdminAuth, userController.handleRegister);
    router.post('/api/user/getUser', middleWareController.verifyTokenAndAdminAuth, userController.handleGetUser);
    router.post('/api/user/deleteUser', middleWareController.verifyTokenAndAdminAuth, userController.handleDeleteUser);
    router.post('/api/user/editUser', middleWareController.verifyTokenAndAdminAuth, userController.handleEditUser);

    router.get('/api/doctor/getDoctor', handleGetDoctor);
    router.post('/api/doctor/getLimitDoctor', handleGetLimitDoctor);
    router.post('/api/doctor/getDoctorById', handleGetDoctorById);
    router.post('/api/doctor/getDoctorDataById', handleGetDoctorDataById);

    router.post('/api/markdown/getMarkdown', handleGetMarkdown);
    router.post('/api/markdown/createMarkdown', middleWareController.verifyTokenAndAdminAuth, handleCreateMarkdown);

    router.post('/api/refreshToken/refreshTokenRequest', authorization.handleRefreshTokenRequest);

    router.post('/api/schedule/postSchedule', scheduleController.postSchedule);
    router.post('/api/schedule/getScheduleByDoctorId', scheduleController.handleGetScheduleById);
    router.post('/api/schedule/getScheduleByDateAId', scheduleController.handleGetScheduleByDateAId);

    router.post('/api/allCode', userController.getAllCode);

    return app.use('/', router);
};

module.exports = initWebRoutes;
