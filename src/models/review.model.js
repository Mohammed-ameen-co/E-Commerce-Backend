const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User ID is required']
    },
    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: [true, 'Order ID is required'] 
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: [true, 'Product ID is required']
    },
    variantId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'variant',
        required: [true, 'Variant ID is required']
    },
    rating:{
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5']
    },
    comment:{
        type: String,
    },

},
{
    timestamps: true
});


reviewSchema.index({ userId: 1, orderId: 1},{unique: true});

const reviewModel = mongoose.model('review', reviewSchema);

module.exports = reviewModel;