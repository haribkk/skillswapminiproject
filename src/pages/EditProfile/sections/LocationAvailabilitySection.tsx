
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../ProfileEditor';

interface LocationAvailabilitySectionProps {
  form: UseFormReturn<FormValues>;
}

const LocationAvailabilitySection: React.FC<LocationAvailabilitySectionProps> = ({ form }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Location & Availability</h2>
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} placeholder="City, Country" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="locationPreference"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Teaching/Learning Preference</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="in-person">In-person only</SelectItem>
                  <SelectItem value="online">Online only</SelectItem>
                  <SelectItem value="both">Both in-person & online</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Availability</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="When are you available for skill swaps?" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default LocationAvailabilitySection;
