
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const SkillCategoriesSection = () => {
  const categories = [
    { name: 'Programming', icon: '💻', color: 'bg-blue-100' },
    { name: 'Languages', icon: '🗣️', color: 'bg-green-100' },
    { name: 'Music', icon: '🎵', color: 'bg-purple-100' },
    { name: 'Cooking', icon: '🍳', color: 'bg-yellow-100' },
    { name: 'Photography', icon: '📸', color: 'bg-pink-100' },
    { name: 'Fitness', icon: '💪', color: 'bg-red-100' },
    { name: 'Art & Design', icon: '🎨', color: 'bg-indigo-100' },
    { name: 'Business', icon: '📊', color: 'bg-teal-100' },
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Skill Categories</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div 
              key={category.name}
              className={`${category.color} rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="font-medium">{category.name}</h3>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button asChild variant="outline">
            <Link to="/browse">
              Explore All Categories
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SkillCategoriesSection;
