/**
 * Task Model
 * Defines the schema for task management
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'completed'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['personal', 'work', 'urgent', 'other'],
        default: 'personal'
    },
    dueDate: {
        type: Date,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Automatically set completedAt when task is completed
taskSchema.pre('save', function(next) {
    if (this.status === 'completed' && !this.completedAt) {
        this.completedAt = new Date();
        this.completed = true;
    }
    next();
});

// Index for faster queries
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ dueDate: 1 });

// Method to check if task is overdue
taskSchema.methods.isOverdue = function() {
    if (!this.dueDate || this.completed) {
        return false;
    }
    return new Date() > this.dueDate;
};

// Virtual for task summary
taskSchema.virtual('summary').get(function() {
    return {
        id: this._id,
        title: this.title,
        status: this.status,
        priority: this.priority,
        dueDate: this.dueDate,
        isOverdue: this.isOverdue()
    };
});

module.exports = mongoose.model('Task', taskSchema);
```
