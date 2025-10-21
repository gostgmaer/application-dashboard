import { useModal } from "@/contexts/modal-context";
import Head from "next/head";

export default function PrivacyPolicy() {
  const { showConfirm, showAlert, showCustom, closeModal } = useModal();
  const handleAccept = () => {
    closeModal();
  };

  return (
    <>
      <Head>
        <title>Privacy Policy</title>
        <meta
          name="description"
          content="Privacy Policy for using our services"
        />
      </Head>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg text-gray-900 dark:text-gray-100">
          {/* <h1 className="text-3xl font-bold mb-6 text-center">
            Privacy Policy
          </h1> */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Last Updated: October 17, 2025
          </p>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We are committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              personal information when you use our services, including our
              website, mobile applications, and other platforms
              (&quot;Services&quot;). By using our Services, you consent to the
              practices described in this Privacy Policy.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              2. Information We Collect
            </h2>
            <div className="text-gray-700 dark:text-gray-300">
              We may collect the following types of information:
              <ul className="list-disc pl-6 mt-2">
                <li>
                  <strong>Personal Information:</strong> Information that
                  identifies you, such as your name, email address, phone
                  number, and payment details provided during registration or
                  subscription.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about your
                  interaction with our Services, including IP address, browser
                  type, device information, pages visited, and time spent on our
                  Services.
                </li>
                <li>
                  <strong>User-Generated Content:</strong> Content you submit,
                  such as comments, reviews, or feedback.
                </li>
                <li>
                  <strong>Cookies and Tracking Technologies:</strong> Data
                  collected via cookies, web beacons, and similar technologies
                  to enhance your experience and analyze usage.
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              3. How We Use Your Information
            </h2>
            <div className="text-gray-700 dark:text-gray-300">
              We use your information to:
              <ul className="list-disc pl-6 mt-2">
                <li>Provide, operate, and improve our Services.</li>
                <li>Process transactions and manage subscriptions.</li>
                <li>
                  Communicate with you, including sending service-related
                  notifications, updates, or promotional offers.
                </li>
                <li>
                  Analyze usage patterns to enhance user experience and optimize
                  our Services.
                </li>
                <li>Comply with legal obligations and protect our rights.</li>
              </ul>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              4. How We Share Your Information
            </h2>
            <div className="text-gray-700 dark:text-gray-300">
              We may share your information with:
              <ul className="list-disc pl-6 mt-2">
                <li>
                  <strong>Service Providers:</strong> Third-party vendors who
                  perform services on our behalf, such as payment processing,
                  data analysis, or hosting.
                </li>
                <li>
                  <strong>Business Partners:</strong> With your consent, we may
                  share information with partners for marketing or promotional
                  purposes.
                </li>
                <li>
                  <strong>Legal Authorities:</strong> When required by law,
                  regulation, or legal process, or to protect our rights,
                  safety, or property.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets, your information may
                  be transferred.
                </li>
              </ul>
              We do not sell your personal information to third parties.
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              5. Cookies and Tracking Technologies
            </h2>
            <div className="text-gray-700 dark:text-gray-300">
              We use cookies and similar technologies to:
              <ul className="list-disc pl-6 mt-2">
                <li>Remember your preferences and settings.</li>
                <li>Analyze how you interact with our Services.</li>
                <li>Deliver personalized content and advertisements.</li>
              </ul>
              You can manage cookie preferences through your browser settings.
              However, disabling cookies may affect the functionality of our
              Services.
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">6. Data Security</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We implement reasonable technical and organizational measures to
              protect your personal information from unauthorized access, loss,
              or misuse. However, no system is completely secure, and we cannot
              guarantee absolute security of your data.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              7. Your Rights and Choices
            </h2>
            <div className="text-gray-700 dark:text-gray-300">
              Depending on your jurisdiction, you may have the following rights:
              <ul className="list-disc pl-6 mt-2">
                <li>Access, correct, or delete your personal information.</li>
                <li>Opt out of promotional communications.</li>
                <li>Request a copy of your data in a portable format.</li>
                <li>Object to or restrict certain processing activities.</li>
              </ul>
              To exercise these rights, contact us using the information below.
              We will respond in accordance with applicable laws.
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              8. International Data Transfers
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our Services are operated from the United States. If you are
              located outside the United States, your information may be
              transferred to and processed in the United States or other
              jurisdictions where our servers or service providers are located.
              We ensure appropriate safeguards are in place to comply with data
              protection laws.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              9. Children&lsquo;s Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our Services are not intended for individuals under 13 years of
              age (or 16 in certain jurisdictions). We do not knowingly collect
              personal information from children. If we learn that we have
              collected such information, we will take steps to delete it.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">10. Data Retention</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We retain your personal information only for as long as necessary
              to fulfill the purposes outlined in this Privacy Policy, comply
              with legal obligations, or resolve disputes, unless a longer
              retention period is required or permitted by law.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              11. Third-Party Links
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our Services may contain links to third-party websites or
              services. We are not responsible for the privacy practices or
              content of these third parties. We encourage you to review their
              privacy policies before providing any personal information.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              12. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update this Privacy Policy from time to time. We will
              notify you of material changes by posting the updated policy on
              our website or through other communication methods. Your continued
              use of our Services after such changes constitutes your acceptance
              of the updated Privacy Policy.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">13. Accessibility</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We are committed to making our Services accessible to all users,
              including those with disabilities. If you have difficulty
              accessing our Services or this Privacy Policy, please contact us,
              and we will work to provide reasonable accommodations.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">
              14. Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us at:
              <br />
              Email: privacy@example.com
              <br />
              Address: 123 Example Street, San Francisco, CA 94105, USA
            </p>
          </section>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleAccept}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Accept Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
