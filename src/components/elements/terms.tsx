import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Terms and Conditions
        </h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-600">
            By accessing or using our dashboard application, you agree to be
            bound by these Terms and Conditions. If you do not agree, you may
            not use the application.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            2. Use of the Application
          </h2>
          <p className="text-gray-600">
            You agree to use the application only for lawful purposes and in
            accordance with these terms. Prohibited activities include:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            <li>Using the application to violate any laws or regulations.</li>
            <li>Attempting to gain unauthorized access to our systems.</li>
            <li>
              Distributing harmful code or interfering with the
              application&apos;s functionality.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            3. Account Responsibilities
          </h2>
          <p className="text-gray-600">
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities under your account.
            Notify us immediately at support@dashboardapp.com if you suspect
            unauthorized use.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            4. Intellectual Property
          </h2>
          <p className="text-gray-600">
            All content, features, and functionality of the application are
            owned by us or our licensors and are protected by intellectual
            property laws. You may not reproduce, distribute, or create
            derivative works without permission.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            5. Limitation of Liability
          </h2>
          <p className="text-gray-600">
            The application is provided &quot;as is&quot; without warranties of
            any kind. We are not liable for any damages arising from your use of
            the application, to the extent permitted by law.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            6. Termination
          </h2>
          <p className="text-gray-600">
            We may suspend or terminate your access to the application at our
            discretion, especially for violations of these terms. You may also
            terminate your account at any time by contacting us.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            7. Changes to Terms
          </h2>
          <p className="text-gray-600">
            We may update these Terms and Conditions from time to time. Changes
            will be posted here, and continued use of the application
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <div className="text-center mt-8">
          <a
            href="mailto:support@dashboardapp.com"
            className="inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
