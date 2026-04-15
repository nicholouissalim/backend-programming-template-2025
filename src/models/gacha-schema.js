module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    prizeId: { type: Number, default: null },
    prizeName: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
  });

  return mongoose.model('Gacha', schema);
};
