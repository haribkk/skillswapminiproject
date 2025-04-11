
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skill, ProficiencyLevel } from '@/types';

interface TeachableSkillsSectionProps {
  teachableSkills: Skill[];
  setTeachableSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const TeachableSkillsSection: React.FC<TeachableSkillsSectionProps> = ({ 
  teachableSkills, 
  setTeachableSkills 
}) => {
  const [newTeachableSkill, setNewTeachableSkill] = useState('');
  const [newTeachableSkillProficiency, setNewTeachableSkillProficiency] = 
    useState<ProficiencyLevel>('intermediate');
  
  const addTeachableSkill = () => {
    if (newTeachableSkill.trim()) {
      setTeachableSkills([
        ...teachableSkills,
        {
          id: Date.now().toString(),
          name: newTeachableSkill.trim(),
          proficiency: newTeachableSkillProficiency,
        },
      ]);
      setNewTeachableSkill('');
    }
  };
  
  const removeTeachableSkill = (skillId: string) => {
    setTeachableSkills(teachableSkills.filter(skill => skill.id !== skillId));
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Skills I Can Teach</h2>
        
        <div className="mb-4">
          {teachableSkills.map((skill) => (
            <div key={skill.id} className="flex items-center mb-2">
              <span className={`skill-badge skill-badge-${skill.proficiency}`}>
                {skill.name} ({skill.proficiency})
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeTeachableSkill(skill.id)}
                className="ml-2 h-6 text-destructive"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-2">
          <Input
            value={newTeachableSkill}
            onChange={(e) => setNewTeachableSkill(e.target.value)}
            placeholder="Add a skill you can teach"
            className="flex-grow"
          />
          <Select 
            value={newTeachableSkillProficiency}
            onValueChange={(value: ProficiencyLevel) => 
              setNewTeachableSkillProficiency(value)
            }
          >
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={addTeachableSkill}
          disabled={!newTeachableSkill.trim()}
          className="w-full md:w-auto"
        >
          Add Skill
        </Button>
      </CardContent>
    </Card>
  );
};

export default TeachableSkillsSection;
