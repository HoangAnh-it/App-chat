function oneToObject(mongoose) {
    return mongoose ? mongoose.toObject() : mongoose;
}

function multipleToObject(mongooses) {
    return mongooses.length > 0 ? mongooses.map(mongoose => mongoose.toObject()) : mongooses;
    return 1;
}

module.exports = {
    oneToObject,
    multipleToObject,
}
