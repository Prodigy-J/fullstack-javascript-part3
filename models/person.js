const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to", url);
  })
  .catch((error) => {
    console.log("error occurred", error.message);
  });

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        return /^\d{2}(?:\d-\d{5}|-\d{6})$/.test(v);
      },
      message: (props) => `${props.value} is not a valid number`,
    },
  },
});

mongoose.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
