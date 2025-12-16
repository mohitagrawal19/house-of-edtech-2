import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  students: mongoose.Types.ObjectId[];
  modules: IModule[];
  rating: number;
  reviews: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IModule {
  title: string;
  description: string;
  duration: number;
  lessons: ILesson[];
}

export interface ILesson {
  title: string;
  content: string;
  duration: number;
  videoUrl?: string;
}

const LessonSchema = new Schema<ILesson>({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  duration: { type: Number, required: true, min: 0 },
  videoUrl: { type: String, trim: true },
});

const ModuleSchema = new Schema<IModule>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true, min: 0 },
  lessons: [LessonSchema],
});

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Instructor is required'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'programming',
        'web-development',
        'data-science',
        'design',
        'business',
        'other',
      ],
      index: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    modules: [ModuleSchema],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Text index for search functionality
CourseSchema.index({ title: 'text', description: 'text' });

// Prevent duplicate course creation
CourseSchema.index({ title: 1, instructor: 1 }, { unique: true });

export default mongoose.models.Course ||
  mongoose.model<ICourse>('Course', CourseSchema);
