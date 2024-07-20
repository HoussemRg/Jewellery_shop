const mongoose = require('mongoose');

const validateId = (req, res, next) => {
    const invalidIds = Object.keys(req.params).filter(param => !mongoose.Types.ObjectId.isValid(req.params[param]));
    if (invalidIds.length > 0) return res.status(400).send(`Invalid ID(s): ${invalidIds.join(', ')}`);
    next();
}

module.exports = { validateId };