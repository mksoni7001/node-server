const config = require("../config")
const logger = require('../logger');
const mongoose = require("mongoose")

module.exports = {
    connect: async function() {
        try{
          await mongoose.connect(config.MONGO_URI);
          logger.info('Database is connected now');
        } catch(err){
          logger.error('Error while connecting to database', err);
        } 
    }
}