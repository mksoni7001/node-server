const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
//Record Schema

const RecordSchema = mongoose.Schema({
	key: {
		type: String
	}, 
	value: {
		type: String
	},
	counts: [{
		type: Number
	}],
	createdAt:{
		type: Date
	}
});

const Record = module.exports = mongoose.model("Record", RecordSchema);

module.exports.search = function(filterParams, callback){
	Record.aggregate([
		{
			$match: {
				createdAt: {
					$gte : new Date(filterParams.startDate), 
					$lte: new Date(filterParams.endDate),
				},	
			}
		},
		{
			$unwind: '$counts'
		},
		{
			$group: {
				_id: '$_id',
				key: {$first: '$key'},
				createdAt: {$first: '$createdAt'},
				totalCount: {
					$sum: '$counts'
				}
			}
		},
		{
			$match: {
				totalCount: {
					$gte: filterParams.minCount,
					$lte: filterParams.maxCount
				}
			}
		},
		{
			$project: {
				_id: 0
			}
		}
	],
	callback);
}
