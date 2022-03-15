module.exports = {
    trimObj: (obj) => {
        for (const key in obj) {
            obj[key] = obj[key].trim();
        }
        return obj;
    },
};