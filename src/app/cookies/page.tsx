import { PageLayout } from '@/components/page-layout';

export default function CookiesPolicy() {
  return (
    <PageLayout
      title="Cookies Policy"
      description="Learn how we use cookies and similar technologies on our website."
    >
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Last updated: September 1, 2024</p>
          
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and to provide information to the site owners.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Essential Cookies:</strong> These are necessary for the website to function and cannot be switched off.</li>
              <li><strong>Performance Cookies:</strong> These help us understand how visitors interact with our website.</li>
              <li><strong>Functionality Cookies:</strong> These enable enhanced functionality and personalization.</li>
              <li><strong>Targeting Cookies:</strong> These may be set through our site by our advertising partners.</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">3. Types of Cookies We Use</h2>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">3.1 Strictly Necessary Cookies</h3>
              <p>These cookies are essential for you to browse the website and use its features.</p>
              <div className="bg-card p-4 rounded-lg mt-2 text-sm">
                <p><strong>Example:</strong> Authentication cookies that keep you logged in during your visit.</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">3.2 Performance Cookies</h3>
              <p>These cookies collect information about how you use our website.</p>
              <div className="bg-card p-4 rounded-lg mt-2 text-sm">
                <p><strong>Example:</strong> Google Analytics cookies that help us understand how visitors use our site.</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">3.3 Functionality Cookies</h3>
              <p>These cookies allow the website to remember choices you make.</p>
              <div className="bg-card p-4 rounded-lg mt-2 text-sm">
                <p><strong>Example:</strong> Language preference cookies that remember your selected language.</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">3.4 Targeting/Advertising Cookies</h3>
              <p>These cookies are used to deliver ads more relevant to you and your interests.</p>
              <div className="bg-card p-4 rounded-lg mt-2 text-sm">
                <p><strong>Example:</strong> Cookies used by advertising networks to show you relevant ads.</p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">4. Third-Party Cookies</h2>
            <p>
              We may also use various third-party cookies to report usage statistics of the Service, deliver advertisements 
              on and through the Service, and so on. These are set by third-party services that we use to enhance our site.
            </p>
            <div className="bg-card p-4 rounded-lg mt-4">
              <h3 className="font-semibold mb-2">Examples of third-party cookies include:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Google Analytics</li>
                <li>Facebook Pixel</li>
                <li>Stripe (for payment processing)</li>
                <li>Intercom (for customer support)</li>
              </ul>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">5. How to Control Cookies</h2>
            <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">5.1 Browser Settings</h3>
              <p>Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.aboutcookies.org" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a>.</p>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">5.2 Cookie Consent</h3>
              <p>When you first visit our website, you will be presented with a cookie consent banner where you can choose which types of cookies you want to allow. You can change these settings at any time by clicking on the "Cookie Settings" link in the footer of our website.</p>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">6. Changes to This Policy</h2>
            <p>We may update our Cookies Policy from time to time. We will notify you of any changes by posting the new Cookies Policy on this page and updating the "Last updated" date at the top of this policy.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this Cookies Policy, please contact us at:
            </p>
            <address className="not-italic mt-2">
              <strong>Email:</strong> privacy@imaginex.com<br />
              <strong>Address:</strong> 123 AI Avenue, Tech City, TC 12345, United States
            </address>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
