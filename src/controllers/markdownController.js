import { createMarkdown, getMarkdown } from '../services/markdownService';

export const handleGetMarkdown = async (req, res) => {
    let doctorId = req.body.doctorId;
    //validate input,
    let result = await getMarkdown(doctorId);

    return res.status(200).json(result?.response);
};

export const handleCreateMarkdown = async (req, res) => {
    let params = {
        doctorId: req.body.doctorId,
        description: req.body.description,
        contentMarkdown: req.body.contentMarkdown,
        contentHTML: req.body.contentHTML,
    };
    console.log(params);

    //validate input,
    let result = await createMarkdown(params);

    return res.status(200).json(result?.response);
};
