const { number } = require("@hapi/joi");
const mongoose = require("mongoose");

const bookcoverpath = "uploads/bookscover";

const bookSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Summary: {
      type: String,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    Coverimage: {
      type: Buffer,
      required: true,
    },
    Coverimagetype: {
      type: String,
      required: true,
    },

    Publisher: {
      type: String,
      required: true,
    },

    WhoLoveIt: {
      type: [String],
    }
  },

  { timestamps: true }
);

bookSchema.virtual("coverimagepath").get(function () {
  if (this.Coverimage != null && this.Coverimagetype != null) {
    return `data:${this.Coverimagetype};charset=utf-8;base64,${this.Coverimage.toString(`base64`)}`
  }
})



const books = mongoose.model("books", bookSchema);
module.exports = books;

