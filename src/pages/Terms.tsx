
import React from 'react';
import { Separator } from '@/components/ui/separator';

const Terms: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: April 10, 2025</p>
        
        <div className="prose prose-sm max-w-none">
          <p>
            Please read these Terms of Service ("Terms") carefully before using the SkillSwap platform. By accessing or using SkillSwap, you agree to be bound by these Terms and our Privacy Policy.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By registering for or using the SkillSwap platform, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use the platform.
          </p>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">2. Eligibility</h2>
          <p>
            You must be at least 18 years old to use SkillSwap. By using SkillSwap, you represent and warrant that you meet all eligibility requirements.
          </p>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">3. User Accounts</h2>
          <p>
            When you create an account, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">4. User Conduct</h2>
          <p>
            You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violate any applicable law or regulation</li>
            <li>Impersonate any person or entity</li>
            <li>Harass, abuse, or harm another person</li>
            <li>Interfere with or disrupt the SkillSwap platform</li>
            <li>Create multiple accounts for deceptive purposes</li>
            <li>Use the platform for any illegal or unauthorized purpose</li>
            <li>Post content that is unlawful, harmful, threatening, abusive, or otherwise objectionable</li>
          </ul>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">5. Skill Exchanges</h2>
          <p>
            SkillSwap is a platform that facilitates skill exchanges between users. We do not guarantee the quality, safety, or legality of skills offered or exchanged through the platform. Users are solely responsible for their interactions with other users.
          </p>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">6. Intellectual Property</h2>
          <p>
            SkillSwap and its content, features, and functionality are owned by SkillSwap and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, create derivative works, or exploit any part of the platform without explicit permission.
          </p>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">7. Termination</h2>
          <p>
            We may terminate or suspend your account and access to SkillSwap at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
          </p>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">8. Disclaimer of Warranties</h2>
          <p>
            The SkillSwap platform is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not guarantee that the platform will be uninterrupted, secure, or error-free.
          </p>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, SkillSwap shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
          </p>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">10. Changes to Terms</h2>
          <p>
            We may revise these Terms at any time by updating this page. Your continued use of the platform after any such changes constitutes your acceptance of the new Terms.
          </p>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">11. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:harishkanna068@gmail.com" className="text-primary hover:underline">harishkanna068@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
