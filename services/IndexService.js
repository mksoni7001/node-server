/* eslint-disable no-unused-vars */
const Service = require("./Service");

/**
 * Finds Indexs by tags
 * Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
 *
 * tags List Tags to filter by
 * returns List
 * */
const health = ({ body }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          code: 0,
          message: "Health status OK",
        })
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || "Invalid input", e.status || 405)
      );
    }
  });

module.exports = {
  health,
};
