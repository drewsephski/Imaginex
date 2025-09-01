import { PageLayout } from '@/components/page-layout';

export default function TermsOfService() {
  return (
    <PageLayout
      title="Terms of Service"
      description="Terms and conditions for using the ImagineX platform."
    >
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground">Effective Date: September 1, 2024</p>
          
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the ImagineX platform (&quot;Service&quot;), you agree to be bound by these Terms of Service 
              (&quot;Terms&quot;). If you do not agree to these Terms, you may not access or use the Service.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p>
              ImagineX provides an AI-powered platform that allows users to generate, edit, and manage digital content. 
              The Service may include web-based and mobile applications, APIs, and other related services.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
            <p>To access certain features of the Service, you may be required to create an account. You agree to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide accurate and complete information when creating an account</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be responsible for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">4. User Content</h2>
            <p>You retain ownership of any content you create, upload, or generate using our Service. By using our Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content solely for the purpose of providing the Service.</p>
            <p className="mt-2">You agree not to upload, post, or otherwise make available any content that:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Infringes any intellectual property rights or other proprietary rights</li>
              <li>Is unlawful, harmful, threatening, abusive, or otherwise objectionable</li>
              <li>Contains viruses or other harmful components</li>
              <li>Violates any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of 
              ImagineX and its licensors. The Service is protected by copyright, trademark, and other laws of both the 
              United States and foreign countries.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">6. Payments and Billing</h2>
            <p>
              Certain features of the Service may require payment of fees. You agree to pay all fees and charges associated 
              with your account on a timely basis. All fees are non-refundable except as required by law or as otherwise 
              specifically permitted in these Terms.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or 
              liability, under our sole discretion, for any reason whatsoever and without limitation, including but not 
              limited to a breach of the Terms.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">8. Disclaimers</h2>
            <p>THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
            <p>IN NO EVENT SHALL IMAGINEX, NOR ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">10. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of material changes by posting the updated Terms on our website.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <address className="not-italic mt-2">
              <strong>Email:</strong> legal@imaginex.com<br />
              <strong>Address:</strong> 123 AI Avenue, Tech City, TC 12345, United States
            </address>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
