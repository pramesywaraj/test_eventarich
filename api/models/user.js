const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    
    username: {
        type: String,
        index: true
    },

    password: {
        type: String,
        required: true
    },

    name: {
		    type: String,
        require: true
    },

	  address: {
		    type: String,
        require : true
    },

	  phone_number: {
		    type: String,
        require: true
	  },

    status: {
      type: String,
      default: "1"
    }
});

module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}