import Product from"../models/Product.js";
import User from "../models/User.js";
import dotenv from "dotenv"
import mongoose from "mongoose";

dotenv.config();
console.log(process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));
  var userId = null;
  const testUser =  await User.findOne({email: "test@tester.com"})
  if (!testUser) {
    const userResult = await User.insertOne({
      name: "Lorem Ipsum",
      email: "test@tester.com",
      password: "123",
    });
    userId = userResult._id;
  } else {
    userId = testUser._id;
  }
  console.log(testUser)
const productDocs =
[{"name":"Vintage Lamp","ownerId":userId,"desc":"Retro brass table lamp","open":true,"price":5000,"bid":120,"minBidIncr":5,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C/EEE/31343C"]},
{"name":"Gaming Chair","ownerId":userId,"desc":"Ergonomic chair with lumbar support","open":true,"price":25000,"bid":800,"minBidIncr":10,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Acoustic Guitar","ownerId":userId,"desc":"Solid spruce top guitar","open":true,"price":15000,"bid":450,"minBidIncr":5,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Smart Watch","ownerId":userId,"desc":"Fitness tracker with heart monitor","open":true,"price":8000,"bid":200,"minBidIncr":2,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Coffee Maker","ownerId":userId,"desc":"Programmable espresso machine","open":true,"price":12000,"bid":350,"minBidIncr":5,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Mountain Bike","ownerId":userId,"desc":"Lightweight aluminum frame","open":true,"price":45000,"bid":1500,"minBidIncr":25,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Bookshelf","ownerId":userId,"desc":"Oak 5-tier storage unit","open":true,"price":18000,"bid":600,"minBidIncr":10,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":[]},
{"name":"Bluetooth Speaker","ownerId":userId,"desc":"Portable waterproof speaker","open":true,"price":6000,"bid":180,"minBidIncr":2,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Leather Jacket","ownerId":userId,"desc":"Genuine black leather","open":true,"price":22000,"bid":750,"minBidIncr":15,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Electric Kettle","ownerId":userId,"desc":"Stainless steel 1.7L","open":true,"price":4000,"bid":100,"minBidIncr":1,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Drone","ownerId":userId,"desc":"4K camera quadcopter","open":true,"price":35000,"bid":1200,"minBidIncr":20,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Wall Art","ownerId":userId,"desc":"Abstract canvas painting","open":true,"price":9000,"bid":250,"minBidIncr":5,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Headphones","ownerId":userId,"desc":"Noise-canceling over-ear","open":true,"price":14000,"bid":400,"minBidIncr":10,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Tool Set","ownerId":userId,"desc":"150-piece mechanics kit","open":true,"price":11000,"bid":300,"minBidIncr":5,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Yoga Mat","ownerId":userId,"desc":"Non-slip exercise mat","open":true,"price":3000,"bid":80,"minBidIncr":1,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Desk Fan","ownerId":userId,"desc":"USB-powered mini fan","open":true,"price":2000,"bid":50,"minBidIncr":1,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Sunglasses","ownerId":userId,"desc":"Polarized aviator style","open":true,"price":7000,"bid":200,"minBidIncr":5,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Backpack","ownerId":userId,"desc":"Water-resistant hiking pack","open":true,"price":10000,"bid":320,"minBidIncr":5,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Blender","ownerId":userId,"desc":"High-power smoothie maker","open":true,"price":13000,"bid":400,"minBidIncr":10,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Board Game","ownerId":userId,"desc":"Strategy game for 4 players","open":true,"price":5000,"bid":150,"minBidIncr":2,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Camping Tent","ownerId":userId,"desc":"2-person lightweight tent","open":true,"price":20000,"bid":650,"minBidIncr":15,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Cookware Set","ownerId":userId,"desc":"10-piece non-stick pots","open":true,"price":16000,"bid":500,"minBidIncr":10,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Fitness Bands","ownerId":userId,"desc":"Set of 5 resistance bands","open":true,"price":3500,"bid":90,"minBidIncr":1,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Laptop Stand","ownerId":userId,"desc":"Adjustable aluminum stand","open":true,"price":8000,"bid":220,"minBidIncr":5,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]},
{"name":"Electric Scooter","ownerId":userId,"desc":"Foldable commuter scooter","open":true,"price":40000,"bid":1300,"minBidIncr":25,"created":Date.now(),"end":new Date(new Date().getTime() + (Math.floor(Math.random() *(0 - 10) + 10)*24*60*60*1000)),"imageUrls":["https://placehold.co/600x400/EEE/31343C"]}]
  const productResult = await Product.insertMany(productDocs)

process.exit(0);