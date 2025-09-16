"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Gift, Target, Trophy, Users, BookOpen } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Personalized Dashboard",
      description: "Get insights into your learning progress with AI-powered analytics and personalized recommendations tailored to your learning style."
    },
    {
      icon: Gift,
      title: "Free Trial Access", 
      description: "Start your learning journey with full access to our platform for 14 days. No credit card required, experience everything we offer."
    },
    {
      icon: Target,
      title: "Progress Tracking",
      description: "Monitor your achievements, set learning goals, and track your progress across all courses with detailed analytics and milestones."
    },
    {
      icon: Trophy,
      title: "Gamification",
      description: "Earn badges, climb leaderboards, and unlock achievements as you progress. Make learning fun and competitive with our reward system."
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow learners, join study groups, participate in discussions, and get help from our vibrant learning community."
    },
    {
      icon: BookOpen,
      title: "Expert Content",
      description: "Learn from industry experts with carefully crafted courses, real-world projects, and up-to-date content across various domains."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-900">
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
            Why Choose{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Brainac?
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover the features that make our platform the perfect choice for your learning journey
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="group bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors"
                >
                  <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Indicator */}
                <motion.div
                  className="mt-6 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:w-full transition-all duration-300"
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
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
            onClick={() => window.open('/signup', '_blank')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Experience All Features - Start Free Trial
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
