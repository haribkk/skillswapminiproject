
import React from 'react';
import { Separator } from '@/components/ui/separator';

const Privacy: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: April 10, 2025</p>
        
        <div className="prose prose-sm max-w-none">
          <p>
            At SkillSwap, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create an account</li>
            <li>Complete your profile</li>
            <li>Communicate with other users</li>
            <li>Provide feedback or contact customer support</li>
            <li>Respond to surveys or participate in promotions</li>
          </ul>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Create and manage your account</li>
            <li>Process transactions</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Develop new products and services</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, prevent, and address fraud and other illegal activities</li>
          </ul>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Information Sharing</h2>
          <p>
            We may share your information in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With other users as part of the normal operation of the platform</li>
            <li>With vendors, consultants, and service providers who need access to such information to perform services for us</li>
            <li>In response to a legal process or as required by law</li>
            <li>When we believe disclosure is necessary to protect our rights, property, or safety</li>
            <li>With your consent or at your direction</li>
          </ul>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
          </p>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Your Choices</h2>
          <p>
            You can access, update, or delete your account information at any time by logging into your account settings. You can also contact us directly to request access to, correction of, or deletion of personal information.
          </p>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. If we make material changes, we will notify you through the platform or by other means, such as email.
          </p>

          <Separator className="my-6" />
          
          <h2 className="text-2xl font-semibold mt-6 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:harishkanna068@gmail.com" className="text-primary hover:underline">harishkanna068@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
