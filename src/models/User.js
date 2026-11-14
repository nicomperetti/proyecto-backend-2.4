import mongoose from 'mongoose';
const schema=new mongoose.Schema({first_name:{type:String,required:true,trim:true},last_name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true,match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/},password:{type:String,required:true,select:false},role:{type:String,enum:['user','organizer','admin'],default:'user',required:true}},{timestamps:true,versionKey:false});
export default mongoose.model('User',schema);
