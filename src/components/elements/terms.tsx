import { useModal } from "@/contexts/modal-context";
import Head from "next/head";

export default function TermsAndConditions() {
  const { showConfirm, showAlert, showCustom, closeModal } = useModal();
  const handleAccept = () => {
    closeModal();
  };

  return (
    <>
      <Head>
        <title>Terms and Conditions</title>
        <meta
          name="description"
          content="Terms and Conditions for using our services"
        />
      </Head>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg text-gray-900 dark:text-gray-100">
          {/* <h1 className="text-3xl font-bold mb-6 text-center">
            Terms and Conditions
          </h1> */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Last Updated: October 17, 2025
          </p>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              By accessing or using our services, you agree to be bound by these
              Terms and Conditions (&quot;Terms&quot;). If you do not agree with
              any part of these Terms, you must not use our services. These
              Terms apply to all users, including visitors, registered users,
              and subscribers.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">2. Eligibility</h2>
            <p className="text-gray-700 dark:text-gray-300">
              You must be at least 18 years old or have the legal capacity to
              enter into contracts to use our services. By using our services,
              you represent and warrant that you meet these eligibility
              requirements.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              3. User Responsibilities
            </h2>
            <div className="text-gray-700 dark:text-gray-300">
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You agree to:
              <ul className="list-disc pl-6 mt-2">
                <li>
                  Provide accurate and complete information during registration.
                </li>
                <li>
                  Notify us immediately of any unauthorized use of your account.
                </li>
                <li>
                  Not use our services for any illegal or unauthorized purpose.
                </li>
                <li>Comply with all applicable laws and regulations.</li>
              </ul>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              4. Intellectual Property
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              All content, trademarks, logos, and intellectual property on our
              services are owned by us or our licensors. You may not reproduce,
              distribute, or create derivative works from any content without
              our express written permission. You retain ownership of any
              content you submit, but you grant us a non-exclusive, worldwide,
              royalty-free license to use, display, and distribute such content
              in connection with our services.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              5. Prohibited Conduct
            </h2>
            <div className="text-gray-700 dark:text-gray-300">
              You agree not to:
              <ul className="list-disc pl-6 mt-2">
                <li>
                  Use our services to transmit harmful code, such as viruses or
                  malware.
                </li>
                <li>
                  Engage in any activity that disrupts or interferes with our
                  services.
                </li>
                <li>
                  Attempt to gain unauthorized access to our systems or
                  networks.
                </li>
                <li>
                  Use automated systems (e.g., bots or scrapers) to access our
                  services without permission.
                </li>
                <li>
                  Engage in any activity that violates the rights of others.
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              6. User-Generated Content
            </h2>
            <div className="text-gray-700 dark:text-gray-300">
              You may submit content, such as comments, reviews, or other
              materials (&quot;User Content&quot;). You are solely responsible
              for your User Content and represent that it does not:
              <ul className="list-disc pl-6 mt-2">
                <li>
                  Infringe on any third-party rights, including intellectual
                  property or privacy rights.
                </li>
                <li>Contain unlawful, defamatory, or offensive material.</li>
                <li>Violate these Terms or applicable laws.</li>
              </ul>
              We reserve the right to remove or modify User Content at our
              discretion.
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              7. Subscription Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you subscribe to any paid services, you agree to pay all
              applicable fees and taxes. Subscriptions may automatically renew
              unless canceled before the renewal date. You may cancel your
              subscription at any time, but no refunds will be provided for the
              unused portion of the subscription period unless required by law.
              For more details on subscription pricing and terms, please visit
              our website.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              8. Electronic Communications
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              By using our services, you consent to receive communications from
              us electronically, including emails, text messages, or in-app
              notifications. You agree that all agreements, notices,
              disclosures, and other communications we provide electronically
              satisfy any legal requirement that such communications be in
              writing.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              9. International Users
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our services are controlled and operated from the United States.
              If you access our services from outside the United States, you are
              responsible for complying with local laws. You acknowledge that
              your data may be processed and stored in the United States or
              other jurisdictions in accordance with our Privacy Policy.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">10. Termination</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We reserve the right to suspend or terminate your access to our
              services at our sole discretion, with or without notice, for any
              reason, including violation of these Terms. Upon termination, your
              right to use our services will cease immediately, and we may
              delete your account data.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              11. Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              To the fullest extent permitted by law, we are not liable for any
              indirect, incidental, special, consequential, or punitive damages
              arising from your use of our services. Our total liability for any
              claim will not exceed the amount you paid us, if any, for the use
              of our services in the past six months.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              12. Disclaimer of Warranties
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our services are provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, either express or
              implied, including but not limited to implied warranties of
              merchantability, fitness for a particular purpose, or
              non-infringement. We do not guarantee that our services will be
              uninterrupted, secure, or error-free.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              13. Third-Party Links and Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our services may contain links to third-party websites or services
              that we do not own or control. We are not responsible for the
              content, policies, or practices of any third-party websites or
              services. You access them at your own risk.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">14. Indemnification</h2>
            <p className="text-gray-700 dark:text-gray-300">
              You agree to indemnify, defend, and hold harmless us, our
              affiliates, officers, directors, employees, and agents from any
              claims, liabilities, damages, or expenses (including reasonable
              attorneys&apos; fees) arising from your use of our services, your
              User Content, or your violation of these Terms.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">15. Assignment</h2>
            <p className="text-gray-700 dark:text-gray-300">
              You may not assign or transfer your rights or obligations under
              these Terms without our prior written consent. We may assign or
              transfer our rights and obligations under these Terms without
              restriction, including in connection with a merger, acquisition,
              or sale of assets.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">16. Feedback</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Any feedback, suggestions, or ideas you provide about our services
              (&ldquo;Feedback&ldquo;) is non-confidential. We may use,
              reproduce, and incorporate Feedback into our services without any
              obligation to you, and you grant us a perpetual, irrevocable,
              worldwide license to use such Feedback.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">17. Accessibility</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We are committed to ensuring our services are accessible to all
              users, including those with disabilities. If you have difficulty
              accessing any part of our services, please contact us, and we will
              work to provide reasonable accommodations.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              18. Governing Law and Dispute Resolution
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              These Terms are governed by the laws of the State of California,
              USA, without regard to its conflict of law principles. Any
              disputes arising from these Terms or your use of our services will
              be resolved through binding arbitration in accordance with the
              rules of the American Arbitration Association. You agree to waive
              any right to a jury trial or to participate in a class action.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              19. Modifications to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update these Terms from time to time at our sole
              discretion. We will notify you of any material changes by posting
              the updated Terms on our website or through other communication
              methods. Your continued use of our services after such changes
              constitutes your acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">20. Privacy Policy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Your use of our services is also governed by our Privacy Policy,
              which describes how we collect, use, and protect your personal
              information. The Privacy Policy is incorporated into these Terms
              by reference.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">21. Force Majeure</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We are not liable for any failure to perform our obligations under
              these Terms due to events beyond our reasonable control, including
              but not limited to natural disasters, war, terrorism, strikes, or
              governmental restrictions.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">22. Severability</h2>
            <p className="text-gray-700 dark:text-gray-300">
              If any provision of these Terms is found to be invalid or
              unenforceable by a court of competent jurisdiction, that provision
              will be enforced to the maximum extent permissible, and the
              remaining provisions will remain in full force and effect.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              23. Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any questions about these Terms, please contact us at:
              <br />
              Email: support@example.com
              <br />
              Address: 123 Example Street, San Francisco, CA 94105, USA
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">24. Miscellaneous</h2>
            <p className="text-gray-700 dark:text-gray-300">
              These Terms constitute the entire agreement between you and us
              regarding the use of our services. Our failure to enforce any
              right or provision will not be considered a waiver of those
              rights. Any rights not expressly granted herein are reserved.
            </p>
          </section>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleAccept}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Accept Terms
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
