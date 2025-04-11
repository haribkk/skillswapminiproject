
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../ProfileEditor';
import { Instagram, Facebook, Phone, ExternalLink } from 'lucide-react';

interface SocialMediaSectionProps {
  form: UseFormReturn<FormValues>;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ form }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Social Media & Contact Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Instagram size={16} />
                  Instagram
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="@username or full URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Facebook size={16} />
                  Facebook
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Username or full URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone size={16} />
                  WhatsApp
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Phone number with country code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="other"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <ExternalLink size={16} />
                  Other Platform
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Website, LinkedIn, etc." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaSection;
