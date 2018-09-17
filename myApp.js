var mongoose= require('mongoose');
mongoose.connect(process.env.MONGO_URI);
var AutoIncrement = require('mongoose-sequence')(mongoose);
var mongoose= require('mongoose');

mongoose.connect(process.env.MONGO_URI);

var Schema = mongoose.Schema;
var shURLschema= new Schema({
  original_url: {
    type: String
  },
  short_url: Number
});
//shURLschema.plugin(AutoIncrement, {inc_field: 'short_url'});
var shURL= mongoose.model('shURL', shURLschema);


var createURL = function(url , done){
  shURL.count({}, function(err,c){
    if (err) return done(err);
    shURL.findOne ({original_url: url} , function (err , data){
      if (err) return done (err);
      //console.log(url)
      if (!data){
        
        shURL.create({original_url: url , short_url: c+1} , function (err,data){
          if (err) return done(err);
          done (null,data);
        })
      }
      else{
        done (null, data);
      }
    });
    });
}

var findURL= function(url, done){
  shURL.findOne({short_url: url}, function(err,data){
    if (err) return done(err);
    done(null, data);
  });
}

exports.createURL = createURL;
exports.shURLmodel = shURL;
exports.findURL = findURL;
