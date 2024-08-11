const { getConnection } = require('../Utils/dbconnection');
const { Store } = require('../Models/Store');

const connectStoreDb = async (req, res, next) => {
  try {
    const storeConnection = await getConnection('Users');
    const StoreModel = storeConnection.model('Store', Store.schema);
    const store = await StoreModel.findById(req.user.store);
    if (!store) return res.status(400).send('Store not found');

    req.storeDb = await getConnection(store.database);
    req.store = store;
    next();
  } catch (err) {
    return res.status(500).send('Server Error');
  }
};

module.exports = { connectStoreDb };