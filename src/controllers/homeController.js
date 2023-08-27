import db from '../models/index';
import CrudService from '../services/CrudService';

let getHomePage = (req, res) => {
    return res.render('homepage.ejs');
};

let getAboutPage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        // console.log(data);
        return res.render('test/about.ejs', { data: JSON.stringify(data) });
    } catch (e) {
        console.log(e);
    }
};

let getCRUDPage = (req, res) => {
    return res.render('test/CRUD.ejs');
};

let postCrud = async (req, res) => {
    await CrudService.createNewUser(req.body);
    console.log('thêm thành công');
    return res.render('test/CRUD.ejs');
};

let getCRUDData = async (req, res) => {
    try {
        let data = await CrudService.getAllUser();
        // console.log(data);
        return res.render('test/get-crud.ejs', { data: JSON.parse(data) });
    } catch (e) {
        console.log(e);
    }
};

const editCrud = async (req, res) => {
    try {
        let userId = req.query.id;

        let data = await CrudService.getUserInfoById(userId);
        // console.log(data);
        return res.render('test/edit-crud.ejs', { data: JSON.parse(data) });
    } catch (e) {
        console.log(e);
    }
};

// object: {
//     key: '',
//     value: ''
// }

const handleLogin = (req, res) => {
    return res.status(200).json({
        message: 'hello',
    });
};

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUDPage: getCRUDPage,
    postCrud: postCrud,
    getCRUDData: getCRUDData,
    handleLogin: handleLogin,
    editCrud: editCrud,
};
