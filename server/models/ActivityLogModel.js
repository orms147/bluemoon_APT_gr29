import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        enum: ['create', 'update', 'delete'],
        require: true,
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: false,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;