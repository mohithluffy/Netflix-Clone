const mongoose = require("mongoose");

 exports.Database= function Database() {
    const uri = "mongodb+srv://SaiVamshi11:vamshi11@cluster0.chyydai.mongodb.net/netflix-clone?retryWrites=true&w=majority";
    mongoose.set('strictQuery', false);
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("DB Connetion Successfull");
      })
      .catch((err) => {
        console.log(err.message);
      });
}