const Record = require("../models/RecordModel")

/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Finds Records by tags
* Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
*
* tags List Tags to filter by
* returns List
* */
const search = ({ body }) => {
  return new Promise(
    async (resolve, reject) => {
      try {
        Record.search(body, (err, records) => {
          if(err) {
            throw err
          }
          resolve(Service.successResponse({
            code: 0, message: "Success", records
          }));
        })
        
      } catch (e) {
        reject(Service.rejectResponse(
          e.message || 'Invalid input',
          e.status || 405,
        ));
      }
    },
  );
};


module.exports = {
  search
};
