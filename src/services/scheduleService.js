import { Op } from 'sequelize';
import { errorCode } from '../masterData/errCode';
import db from '../models/index';

const isWithinDateRange = (value) => {
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setHours(23, 59, 59, 999);
    maxDate.setDate(today.getDate() + 10);
    return date >= today && date <= maxDate;
};

function findUniqueObjectsInArray(arrA, arrB) {
    return arrA.filter((itemA) => {
        const matchingObject = arrB.find(
            (itemB) =>
                itemB.doctorId === itemA.doctorId &&
                itemB.date === itemA.date &&
                itemB.timeType === itemA.timeType &&
                itemB.maxNumber === itemA.maxNumber,
        );

        return !matchingObject;
    });
}

export const updateSchedule = async (schedules) => {
    try {
        let arrTemp = [];
        for (const schedule of schedules) {
            //kiểm tra thời gian phải nằm từ ngày hiện tại đến 10 ngày tiếp theo
            if (!isWithinDateRange(schedule.date)) {
                continue;
            }
            const { currentNumber, ...newObj } = schedule;
            arrTemp.push({ ...newObj, maxNumber: 10 });
        }

        //delete all items schedules in the database
        if (arrTemp.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const maxDate = new Date();
            maxDate.setHours(23, 59, 59, 999);
            maxDate.setDate(today.getDate() + 10);
            const data = await db.Schedule.findAll({
                where: {
                    doctorId: arrTemp[0].doctorId,
                    date: {
                        [Op.between]: [today, maxDate],
                    },
                },
                attributes: ['doctorId', 'date', 'timeType', 'maxNumber'],
            });

            if (data.length > 0) {
                const uniqueObjectsFromServer = findUniqueObjectsInArray(data, arrTemp);

                ///MISS CHECK DATA

                if (uniqueObjectsFromServer.length > 0) {
                    const whereConditions = uniqueObjectsFromServer.map((obj) => ({
                        doctorId: obj.doctorId,
                        date: obj.date,
                        timeType: obj.timeType,
                    }));

                    await db.Schedule.destroy({
                        where: {
                            [Op.or]: whereConditions,
                        },
                    });
                }

                const uniqueObjectsFromReq = findUniqueObjectsInArray(arrTemp, data);

                if (uniqueObjectsFromReq.length > 0) {
                    await db.Schedule.bulkCreate(uniqueObjectsFromReq);
                }
            }
        }

        return {
            response: {
                errCode: errorCode.success,
            },
        };
    } catch (e) {
        console.log(e);
        return {
            response: {
                errCode: errorCode.errFromServer,
            },
        };
    }
};

export const GetScheduleById = async (doctorId) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date();
        maxDate.setHours(23, 59, 59, 999);
        maxDate.setDate(today.getDate() + 10);

        const data = await db.Schedule.findAll({
            where: {
                doctorId: doctorId,
                date: {
                    [Op.between]: [today, maxDate],
                },
            },
            attributes: ['doctorId', 'date', 'timeType', 'currentNumber'],
        });

        return {
            response: {
                errCode: errorCode.success,
                data: data,
            },
        };
    } catch (e) {
        return {
            response: {
                errCode: errorCode.errFromServer,
            },
        };
    }
};

export const GetScheduleByDateAId = async (params) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date();
        maxDate.setHours(23, 59, 59, 999);
        maxDate.setDate(today.getDate() + 10);

        const data = await db.Schedule.findAll({
            where: {
                doctorId: params.doctorId,
                date: params.date,
            },
            attributes: ['doctorId', 'date', 'timeType', 'currentNumber', 'maxNumber'],
        });

        return {
            response: {
                errCode: errorCode.success,
                data: data,
            },
        };
    } catch (e) {
        return {
            response: {
                errCode: errorCode.errFromServer,
            },
        };
    }
};
