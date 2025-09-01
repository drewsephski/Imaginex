import { PageLayout } from '@/components/page-layout';

export default function PrivacyPolicy() {
  return (
    <PageLayout
      title="Privacy Policy"
      description="Learn how we collect, use, and protect your personal information."
    >
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: September 1, 2024</p>
          
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>
              Welcome to ImagineX. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our 
              website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location.</li>
              <li><strong>Usage Data</strong> includes information about how you use our website, products, and services.</li>
              <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from us.</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>To register you as a new customer</li>
              <li>To process and deliver your orders</li>
              <li>To manage our relationship with you</li>
              <li>To improve our website, products/services, marketing, or customer relationships</li>
              <li>To recommend products or services that may be of interest to you</li>
              <li>To comply with legal or regulatory requirements</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p>
              We have implemented appropriate security measures to prevent your personal data from being accidentally lost, 
              used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to 
              those employees, agents, contractors, and other third parties who have a business need to know.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, 
              including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">6. Your Legal Rights</h2>
            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">7. Third-Party Links</h2>
            <p>
              Our website may include links to third-party websites, plug-ins, and applications. Clicking on those links may allow 
              third parties to collect or share data about you. We do not control these third-party websites and are not responsible 
              for their privacy statements.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <address className="not-italic mt-2">
              <strong>Email:</strong> privacy@imaginex.com<br />
              <strong>Address:</strong> 123 AI Avenue, Tech City, TC 12345, United States
            </address>
          </section>

          <section className="mt-8 text-sm text-muted-foreground">
            <p>
              This privacy policy was last updated on September 1, 2024. We may update this policy from time to time. 
              We will notify you of any changes by posting the new privacy policy on this page.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
