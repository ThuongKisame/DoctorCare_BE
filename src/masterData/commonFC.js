export const bufferToDataUri = (buffer) => {
    const base64String = new Buffer(buffer, 'base64').toString('binary');
    return base64String;
};
