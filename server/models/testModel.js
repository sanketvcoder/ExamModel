import mongoose from "mongoose";

const testModel = new mongoose.Schema({
    testId: {
        type: String,
        required: true,
        unique: true,
      },
      testPassword: {
        type: String,
        required: true,
      },
      createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
      },
      questions: [],
      availableSections: [{
        type: String, // Assuming sections are strings like 'Math', 'Science', etc.
      }],
    }, { timestamps: true }
)

const Test =mongoose.model.Test|| mongoose.model('Test', testModel);

export default Test;