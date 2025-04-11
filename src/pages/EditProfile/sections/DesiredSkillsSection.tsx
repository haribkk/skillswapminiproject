
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skill } from '@/types';

interface DesiredSkillsSectionProps {
  desiredSkills: Skill[];
  setDesiredSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const DesiredSkillsSection: React.FC<DesiredSkillsSectionProps> = ({ 
  desiredSkills, 
  setDesiredSkills 
}) => {
  const [newDesiredSkill, setNewDesiredSkill] = useState('');
  
  const addDesiredSkill = () => {
    if (newDesiredSkill.trim()) {
      setDesiredSkills([
        ...desiredSkills,
        {
          id: Date.now().toString(),
          name: newDesiredSkill.trim(),
        },
      ]);
      setNewDesiredSkill('');
    }
  };
  
  const removeDesiredSkill = (skillId: string) => {
    setDesiredSkills(desiredSkills.filter(skill => skill.id !== skillId));
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Skills I Want to Learn</h2>
        
        <div className="mb-4">
          {desiredSkills.map((skill) => (
            <div key={skill.id} className="flex items-center mb-2">
              <span className="skill-badge">
                {skill.name}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeDesiredSkill(skill.id)}
                className="ml-2 h-6 text-destructive"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2 mb-2">
          <Input
            value={newDesiredSkill}
            onChange={(e) => setNewDesiredSkill(e.target.value)}
            placeholder="Add a skill you want to learn"
            className="flex-grow"
          />
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={addDesiredSkill}
          disabled={!newDesiredSkill.trim()}
          className="w-full md:w-auto"
        >
          Add Skill
        </Button>
      </CardContent>
    </Card>
  );
};

export default DesiredSkillsSection;
