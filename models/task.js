const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Number,
    required: function() {
      return this.dueDate;
    },
  },
  repeat: {
    type: Boolean,
    required: true,
  },
  repeatDays: {
    type: Array,
    required: function() {
      return this.repeat;
    },
  },
  tags: {
    type: Array,
    required: false,
  },
  priority: {
    type: String,
    required: true,
    default: 'low',
  },
});

module.exports = mongoose.model('Task', taskSchema);
