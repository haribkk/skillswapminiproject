
import React from 'react';
import { Skill } from '../types';

interface SkillBadgeProps {
  skill: Skill;
  onClick?: () => void;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, onClick }) => {
  const proficiencyClass = skill.proficiency 
    ? `skill-badge-${skill.proficiency}` 
    : 'bg-secondary text-secondary-foreground';

  return (
    <span 
      className={`skill-badge ${proficiencyClass} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {skill.name}
    </span>
  );
};

export default SkillBadge;
