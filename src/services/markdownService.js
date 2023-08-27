import db from '../models/index';
import { errorCode, resError } from '../masterData/errCode';
export const getMarkdown = async (id) => {
    let convertId = parseInt(id);
    console.log(convertId);
    try {
        let data = await db.Markdown.findOne({ where: { doctorId: convertId } });

        // await new Promise((resolve) => setTimeout(resolve, 3000));

        return {
            response: {
                errCode: errorCode.success.value,
                data: data,
            },
        };
    } catch (e) {
        console.log(e + 'error ////////////////////////////////////');
        return {
            response: {
                ...resError,
            },
        };
    }
};

export const getMarkdownById = async (userId) => {
    try {
        let data = await db.Markdown.findOne({ where: { doctorId: userId } });
        return data;
    } catch (error) {
        throw new Error(e);
    }
};

export const createMarkdown = async (params) => {
    try {
        let data = await db.Markdown.findOne({ where: { doctorId: params.doctorId } });
        if (data) {
            await data.update({
                description: params.description,
                contentMarkdown: params.contentMarkdown,
                contentHTML: params.contentHTML,
            });
        } else {
            await db.Markdown.create({
                doctorId: params.doctorId,
                description: params.description,
                contentMarkdown: params.contentMarkdown,
                contentHTML: params.contentHTML,
            });
            //create new markdown
        }

        // await new Promise((resolve) => setTimeout(resolve, 3000));

        return {
            response: {
                errCode: errorCode.success.value,
                data: data,
            },
        };
    } catch (e) {
        console.log(e);
        return {
            response: {
                ...resError,
            },
        };
    }
};
