const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cheeseSchema = new Schema(
	{
		author: { type: Schema.Types.ObjectId, ref: 'User' },
		title: { type: String, required: [true, 'Title is required'] },
		seller: { type: String, required: [true, 'Seller is required'] },
		condition: {
			type: String,
			required: [true, 'Condition is required'],
			enum: ['Mild', 'Matured', 'Aged', 'Extra-Aged', 'Vintage'],
		},
		price: {
			type: Number,
			required: [true, 'Price is required'],
			min: [10, 'minimum is $10'],
			max: [10000, 'maximum is $10000'],
		},
		details: { type: String, required: [true, 'Details are required'], maxlength: 250 },
		image: { type: String, required: [true, 'Image is required'] },
		totalOffers: { type: Number, required: [true, 'Total offers is required'], default: 0 },
		active: { type: Boolean, required: [true, 'Active status is required'], default: true },
	},
	{
		timestamps: true,
	}
);

// collection name is cheese in the db
module.exports = mongoose.model('Cheese', cheeseSchema);
