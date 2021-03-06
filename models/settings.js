var mongoose              = require('mongoose');
var Schema                = mongoose.Schema;

var Settings = new Schema({
    name: { type: String, ref: 'Restaurant' },
    owner: { type: String, required: true },
    description: String,
    locations: [{
        _id: false,
        address: {
            addressLine1: { type: String, required: true },
            addressLine2: String,
            city: { type: String, required: true },
            state: { type: String, required: true },
            zip: { type: Number, required: true },
            _id: false
        },
        menu: { type: Schema.Types.ObjectId, ref: 'Menu', required: true },
    }]
});

Settings.set('redisCache', true);

module.exports = mongoose.model('Settings', Settings);
