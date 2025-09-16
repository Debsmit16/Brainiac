"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  level: string;
  price: string;
  index: number;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  instructor,
  duration,
  students,
  rating,
  level,
  price,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
      className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600"
    >
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 flex items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(135deg, ${
              index % 3 === 0 ? '#3b82f6, #8b5cf6' :
              index % 3 === 1 ? '#10b981, #3b82f6' :
              '#f59e0b, #ef4444'
            })`
          }}
        >
          <div className="text-white text-center">
            <div className="text-6xl font-bold opacity-20 mb-2">
              {title.charAt(0)}
            </div>
            <div className="text-lg font-semibold">{title.split(' ')[0]}</div>
          </div>
        </div>
        
        {/* Level Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 dark:bg-slate-800/90 text-gray-900 dark:text-white px-3 py-1 rounded-full text-sm font-medium">
            {level}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {price}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Title and Description */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Instructor */}
        <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">
          by <span className="font-medium">{instructor}</span>
        </p>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{students.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 group"
        >
          <span>View Course</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CourseCard;
