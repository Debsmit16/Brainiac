"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BarChart3, Users2 } from 'lucide-react';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: GraduationCap,
      title: "Expert Mentors",
      description: "Learn from industry professionals with years of real-world experience. Get personalized guidance and career advice from experts who've been where you want to go.",
      features: [
        "1-on-1 mentorship sessions",
        "Industry professionals",
        "Career guidance",
        "Real-world experience"
      ]
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Track your progress with AI-powered analytics that adapt to your learning style. Get insights into your strengths and areas for improvement.",
      features: [
        "AI-powered insights",
        "Progress tracking",
        "Performance analytics",
        "Personalized recommendations"
      ]
    },
    {
      icon: Users2,
      title: "Community Support",
      description: "Join a vibrant community of learners, participate in discussions, collaborate on projects, and build lasting professional networks.",
      features: [
        "Active community forums",
        "Study groups",
        "Collaborative projects",
        "Networking opportunities"
      ]
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-white dark:bg-slate-900">
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
            We provide more than just courses - we offer a complete learning ecosystem designed for your success
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Card */}
                <motion.div
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 h-full"
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors"
                  >
                    <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {reason.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {reason.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {reason.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.2 + featureIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Hover Indicator */}
                  <motion.div
                    className="mt-6 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:w-full transition-all duration-300"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "50K+", label: "Happy Students" },
            { value: "200+", label: "Expert Instructors" },
            { value: "500+", label: "Courses Available" },
            { value: "94%", label: "Success Rate" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
