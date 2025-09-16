import { useState } from 'react';
import { Student } from '@/types';
import {
  User,
  Mail,
  BookOpen,
  Calendar,
  Edit,
  Save,
  X,
  Clock
} from 'lucide-react';

interface StudentProfileProps {
  student: Student;
  onUpdate: (student: Student) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: student.name,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper functions
  const isTrialActive = () => {
    const trialEnd = new Date(student.trial_end_date);
    return trialEnd > new Date() && !student.is_premium;
  };

  const getTrialDaysLeft = () => {
    if (student.is_premium) return 0;
    const trialEnd = new Date(student.trial_end_date);
    const now = new Date();
    const timeDiff = trialEnd.getTime() - now.getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        name: student.name,
      });
    }
    setIsEditing(!isEditing);
    setMessage(null);
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required' });
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would update the student profile in Supabase
      const updatedStudent = {
        ...student,
        name: formData.name.trim(),
      };

      onUpdate(updatedStudent);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">{student.name}</h1>
              <p className="text-blue-100">Class {student.class} Student</p>
            </div>
          </div>
          
          <div className="text-right">
            {student.is_premium ? (
              <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-medium">
                Premium Member
              </div>
            ) : isTrialActive() ? (
              <div className="bg-orange-400 text-white px-4 py-2 rounded-full font-medium">
                Free Trial ({getTrialDaysLeft()} days left)
              </div>
            ) : (
              <div className="bg-red-400 text-white px-4 py-2 rounded-full font-medium">
                Trial Expired
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Profile Information
          </h2>
          {!isEditing ? (
            <button
              onClick={handleEditToggle}
              className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleEditToggle}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter your full name"
                />
              </div>
            ) : (
              <div className="flex items-center py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-900 dark:text-gray-100">{student.name}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="flex items-center py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-900 dark:text-gray-100">{student.email}</span>
            </div>
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Class
            </label>
            <div className="flex items-center py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-900 dark:text-gray-100">Class {student.class}</span>
            </div>
          </div>

          {/* Join Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Member Since
            </label>
            <div className="flex items-center py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-900 dark:text-gray-100">
                {new Date(student.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Account Status
        </h2>
        
        <div className="space-y-4">
          {/* Membership Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                student.is_premium ? 'bg-green-500' : isTrialActive() ? 'bg-orange-500' : 'bg-red-500'
              }`}></div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {student.is_premium ? 'Premium Member' : isTrialActive() ? 'Free Trial' : 'Trial Expired'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {student.is_premium 
                    ? 'Access to all premium content'
                    : isTrialActive()
                      ? `${getTrialDaysLeft()} days remaining`
                      : 'Upgrade to continue learning'
                  }
                </div>
              </div>
            </div>
            {!student.is_premium && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Upgrade Now
              </button>
            )}
          </div>

          {/* Trial Information */}
          {!student.is_premium && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                <div>
                  <div className="font-medium text-orange-800 dark:text-orange-200">
                    Free Trial Status
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">
                    Trial ends on {new Date(student.trial_end_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;