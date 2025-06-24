import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../frontend_assets/assets';

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">IIIT Community</span>
              <span className="block text-indigo-200">Buy & Sell Platform</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              A secure marketplace exclusively for IIIT students and faculty. 
              Verify with your institute email to start trading.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Link 
                to="/collection" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
            Popular Categories
          </h2>
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4">
            {[
              { title: 'Textbooks', icon: '📚' },
              { title: 'Electronics', icon: '💻' },
              { title: 'Lab Equipment', icon: '🔬' },
              { title: 'Notes & Resources', icon: '📝' },
            ].map((category) => (
              <div key={category.title} className="group relative">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{category.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Why Choose Our Platform?
            </h2>
          </div>
          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {[
                {
                  title: 'Verified Community',
                  description: 'Only IIIT email addresses can register and trade',
                  icon: '🔒'
                },
                {
                  title: 'Campus Pickup',
                  description: 'Easy and secure item exchange within campus',
                  icon: '🏫'
                },
                {
                  title: 'Student Friendly',
                  description: 'No platform fees, direct student-to-student transactions',
                  icon: '🤝'
                }
              ].map((feature) => (
                <div key={feature.title} className="relative">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300 pt-16 pb-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">IIIT Marketplace</h3>
              <p className="text-sm leading-relaxed mb-4">
                A community-driven platform for IIIT students to buy and sell within campus.
                Built by students, for students.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/guidelines" className="hover:text-white">Community Guidelines</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} IIIT Community Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;