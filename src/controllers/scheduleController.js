import { errorCode } from '../masterData/errCode';
import { GetScheduleByDateAId, GetScheduleById, updateSchedule } from '../services/scheduleService';

export const hasDuplicates = (array) => {
    const seen = new Set();
    for (const obj of array) {
        const key = `${obj.doctorId}-${obj.date}-${obj.timeType}`;
        if (seen.has(key)) {
            return true; // Tồn tại đối tượng bị trùng lặp
        }
        seen.add(key);
    }
    return false; // Không có đối tượng trùng lặp
};

export const scheduleController = {
    postSchedule: async (req, res) => {
        let schedules = req.body?.schedules;
        if (!schedules) {
            return res.status(errorCode.missingParameter.status).json(errorCode.missingParameter);
        }

        const isDuplicate = hasDuplicates(schedules);
        if (isDuplicate) {
            return res.status(errorCode.forbidden.status).json(errorCode.forbidden);
        }

        let result = await updateSchedule(schedules);
        return res.status(result?.response?.errCode?.status || 500).json(result?.response);
    },

    handleGetScheduleById: async (req, res) => {
        let doctorId = req.body?.doctorId;
        if (!doctorId) {
            return res.status(errorCode.missingParameter.status).json(errorCode.missingParameter);
        }

        let result = await GetScheduleById(doctorId);
        return res.status(result?.response?.errCode?.status || 500).json(result?.response);
    },

    handleGetScheduleByDateAId: async (req, res) => {
        let doctorId = req.body?.doctorId;
        let date = req.body?.date;
        let params = { doctorId: doctorId, date: date };
        if (!doctorId || !date) {
            return res.status(errorCode.missingParameter.status).json(errorCode.missingParameter);
        }

        let result = await GetScheduleByDateAId(params);
        return res.status(result?.response?.errCode?.status || 500).json(result?.response);
    },
};
