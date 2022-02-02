/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Finds Items by tags
* Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
*
* tags List Tags to filter by
* returns List
* */
const search = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      console.log("body params", body)
      // ToDo: response
      const response = []
      resolve(Service.successResponse({
        response,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);


module.exports = {
  search
};
