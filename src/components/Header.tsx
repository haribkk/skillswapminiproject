
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { MessageSquare, User } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          SkillSwap
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/browse" className="text-foreground hover:text-primary transition-colors">
            Browse Skills
          </Link>
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <Link to="/messages" className="relative">
                <Button variant="ghost" size="icon">
                  <MessageSquare size={20} />
                </Button>
              </Link>
              
              <Link to="/profile" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={currentUser.profilePicture} 
                    alt={currentUser.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden md:inline">{currentUser.name}</span>
              </Link>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline">
                <User size={16} className="mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
