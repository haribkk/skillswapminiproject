
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import UserCard from '../components/UserCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

const BrowsePage: React.FC = () => {
  const { users, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [skillTypeFilter, setSkillTypeFilter] = useState<'teachable' | 'desired'>('teachable');
  
  const filteredUsers = useMemo(() => {
    return users
      .filter(user => user.id !== currentUser?.id) // Exclude current user
      .filter(user => {
        if (!searchTerm) return true;
        
        const searchLower = searchTerm.toLowerCase();
        
        // Search by name
        if (user.name.toLowerCase().includes(searchLower)) return true;
        
        // Search by location
        if (user.location.toLowerCase().includes(searchLower)) return true;
        
        // Search by skills based on current tab
        if (skillTypeFilter === 'teachable') {
          return user.teachableSkills.some(skill => 
            skill.name.toLowerCase().includes(searchLower)
          );
        } else {
          return user.desiredSkills.some(skill => 
            skill.name.toLowerCase().includes(searchLower)
          );
        }
      })
      .filter(user => {
        if (locationFilter === 'all') return true;
        if (locationFilter === 'online' && 
            (user.locationPreference === 'online' || user.locationPreference === 'both')) {
          return true;
        }
        if (locationFilter === 'in-person' && 
            (user.locationPreference === 'in-person' || user.locationPreference === 'both')) {
          return true;
        }
        return false;
      });
  }, [users, currentUser, searchTerm, locationFilter, skillTypeFilter]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Skills</h1>
      
      <div className="mb-8">
        <Tabs defaultValue="teachable" onValueChange={(value) => setSkillTypeFilter(value as 'teachable' | 'desired')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="teachable">People Teaching Skills</TabsTrigger>
            <TabsTrigger value="desired">People Learning Skills</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder={`Search by name, location, or ${skillTypeFilter === 'teachable' ? 'teachable' : 'desired'} skills...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <TabsContent value="teachable" className="mt-0">
            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No users found matching your search criteria.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="desired" className="mt-0">
            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No users found matching your search criteria.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BrowsePage;
