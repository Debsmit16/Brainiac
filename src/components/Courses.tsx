"use client";

import React from 'react';
import { motion } from 'framer-motion';
import CourseCard from './CourseCard';

const Courses = () => {
  const courses = [
    {
      title: "React & Next.js Mastery",
      description: "Master modern React development with Next.js, TypeScript, and advanced patterns. Build production-ready applications.",
      instructor: "Sarah Johnson",
      duration: "12 weeks",
      students: 2340,
      rating: 4.9,
      level: "Intermediate",
      price: "Free Trial"
    },
    {
      title: "Python for Data Science",
      description: "Learn Python programming for data analysis, machine learning, and visualization with hands-on projects.",
      instructor: "Dr. Michael Chen",
      duration: "10 weeks",
      students: 1890,
      rating: 4.8,
      level: "Beginner",
      price: "Free Trial"
    },
    {
      title: "UI/UX Design Fundamentals",
      description: "Master the principles of user interface and user experience design with real-world projects and case studies.",
      instructor: "Emma Rodriguez",
      duration: "8 weeks",
      students: 1560,
      rating: 4.9,
      level: "Beginner",
      price: "Free Trial"
    },
    {
      title: "Machine Learning with TensorFlow",
      description: "Dive deep into machine learning algorithms and implement them using TensorFlow and Python.",
      instructor: "Prof. David Kim",
      duration: "16 weeks",
      students: 980,
      rating: 4.7,
      level: "Advanced",
      price: "Free Trial"
    },
    {
      title: "Digital Marketing Strategy",
      description: "Learn comprehensive digital marketing strategies including SEO, social media, content marketing, and analytics.",
      instructor: "Lisa Thompson",
      duration: "6 weeks",
      students: 2100,
      rating: 4.8,
      level: "Beginner",
      price: "Free Trial"
    },
    {
      title: "Cloud Computing with AWS",
      description: "Master Amazon Web Services with hands-on labs covering EC2, S3, Lambda, and cloud architecture patterns.",
      instructor: "Alex Kumar",
      duration: "14 weeks",
      students: 1250,
      rating: 4.6,
      level: "Intermediate",
      price: "Free Trial"
    }
  ];

  return (
    <section id="courses" className="py-20 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Featured{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Courses
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore our carefully curated selection of courses designed by industry experts
          </p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <CourseCard key={course.title} {...course} index={index} />
          ))}
        </div>

        {/* View All Courses CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
          >
            View All Courses
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Courses;
