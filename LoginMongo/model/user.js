const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    name:String,
    pass:String,
    history:[String],
    last:[{
        time:Number,
        valid:Boolean
    }],
    who:{
        me:[String]
    }
})
module.exports=mongoose.model("user",userSchema);