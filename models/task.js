const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  dueDate: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    required: function() {
      return this.dueDate;
    },
  },
  repeat: {
    type: Boolean,
    required: true,
  },
  repeatDays: {
    type: [String],
    required: false,
    // required: function() {
    //   return this.repeat;
    // },
  },
  tags: {
    type: [String],
    required: false,
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    default: 'low',
  },
});

module.exports = mongoose.model('Task', taskSchema);
