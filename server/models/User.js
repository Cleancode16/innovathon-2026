const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    required: [true, 'Please specify a role'],
    enum: {
      values: ['student', 'faculty'],
      message: 'Role must be either student or faculty'
    }
  },
  // Placement subjects - only for students
  subjects: {
    os: {
      current: { type: Number, default: 0, min: 0, max: 100 },
      history: [{ type: Number, min: 0, max: 100 }],
      level: { 
        type: String, 
        enum: ['High', 'Medium', 'Low'], 
        default: 'Low' 
      },
      conceptsCovered: [{ type: String }],
      aiAnalysis: { type: String, default: '' },
      attendance: {
        totalClasses: { type: Number, default: 0, min: 0 },
        attendedClasses: { type: Number, default: 0, min: 0 },
        percentage: { type: Number, default: 0, min: 0, max: 100 }
      }
    },
    cn: {
      current: { type: Number, default: 0, min: 0, max: 100 },
      history: [{ type: Number, min: 0, max: 100 }],
      level: { 
        type: String, 
        enum: ['High', 'Medium', 'Low'], 
        default: 'Low' 
      },
      conceptsCovered: [{ type: String }],
      aiAnalysis: { type: String, default: '' },
      attendance: {
        totalClasses: { type: Number, default: 0, min: 0 },
        attendedClasses: { type: Number, default: 0, min: 0 },
        percentage: { type: Number, default: 0, min: 0, max: 100 }
      }
    },
    dbms: {
      current: { type: Number, default: 0, min: 0, max: 100 },
      history: [{ type: Number, min: 0, max: 100 }],
      level: { 
        type: String, 
        enum: ['High', 'Medium', 'Low'], 
        default: 'Low' 
      },
      conceptsCovered: [{ type: String }],
      aiAnalysis: { type: String, default: '' },
      attendance: {
        totalClasses: { type: Number, default: 0, min: 0 },
        attendedClasses: { type: Number, default: 0, min: 0 },
        percentage: { type: Number, default: 0, min: 0, max: 100 }
      }
    },
    oops: {
      current: { type: Number, default: 0, min: 0, max: 100 },
      history: [{ type: Number, min: 0, max: 100 }],
      level: { 
        type: String, 
        enum: ['High', 'Medium', 'Low'], 
        default: 'Low' 
      },
      conceptsCovered: [{ type: String }],
      aiAnalysis: { type: String, default: '' },
      attendance: {
        totalClasses: { type: Number, default: 0, min: 0 },
        attendedClasses: { type: Number, default: 0, min: 0 },
        percentage: { type: Number, default: 0, min: 0, max: 100 }
      }
    },
    dsa: {
      current: { type: Number, default: 0, min: 0, max: 100 },
      history: [{ type: Number, min: 0, max: 100 }],
      level: { 
        type: String, 
        enum: ['High', 'Medium', 'Low'], 
        default: 'Low' 
      },
      conceptsCovered: [{ type: String }],
      aiAnalysis: { type: String, default: '' },
      attendance: {
        totalClasses: { type: Number, default: 0, min: 0 },
        attendedClasses: { type: Number, default: 0, min: 0 },
        percentage: { type: Number, default: 0, min: 0, max: 100 }
      }
    },
    qa: {
      current: { type: Number, default: 0, min: 0, max: 100 },
      history: [{ type: Number, min: 0, max: 100 }],
      level: { 
        type: String, 
        enum: ['High', 'Medium', 'Low'], 
        default: 'Low' 
      },
      conceptsCovered: [{ type: String }],
      aiAnalysis: { type: String, default: '' },
      attendance: {
        totalClasses: { type: Number, default: 0, min: 0 },
        attendedClasses: { type: Number, default: 0, min: 0 },
        percentage: { type: Number, default: 0, min: 0, max: 100 }
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
