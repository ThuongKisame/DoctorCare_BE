import { getDoctor, getDoctorById, getDoctorDataById, getLimitDoctor } from '../services/doctorService';

export const handleGetDoctor = async (req, res) => {
    //validate input,
    let result = await getDoctor();

    return res.status(200).json(result?.findDoctorResult);
};

export const handleGetLimitDoctor = async (req, res) => {
    const perPage = parseInt(req.body.perPage) || 10; // Số lượng item trên mỗi trang, mặc định là 10
    const page = parseInt(req.body.page) || 1; // Vị trí trang cần lấy, mặc định là 1
    //validate input,
    console.log(page, ' ', perPage);
    let result = await getLimitDoctor(perPage, page);

    return res.status(200).json(result?.findDoctorResult);
};

export const handleGetDoctorById = async (req, res) => {
    const doctorId = req.body.doctorId;
    let result = await getDoctorById(doctorId);

    return res.status(200).json(result?.findDoctorResult);
};

export const handleGetDoctorDataById = async (req, res) => {
    const doctorId = req.body.doctorId;
    let result = await getDoctorDataById(doctorId);

    return res.status(200).json(result?.findDoctorResult);
};
