import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Privacy Policy
        </h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            1. Introduction
          </h2>
          <p className="text-gray-600">
            We are committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, and safeguard your personal
            information when you use our dashboard application.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            2. Information We Collect
          </h2>
          <p className="text-gray-600">
            We may collect personal information such as your name, email
            address, and usage data when you interact with our application. This
            includes:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            <li>Information provided during account creation.</li>
            <li>Usage data from your interactions with the dashboard.</li>
            <li>Cookies and similar technologies for analytics.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            3. How We Use Your Information
          </h2>
          <p className="text-gray-600">Your information is used to:</p>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            <li>Provide and improve our services.</li>
            <li>Personalize your dashboard experience.</li>
            <li>Communicate updates and support.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            4. Data Security
          </h2>
          <p className="text-gray-600">
            We implement industry-standard security measures to protect your
            data. However, no system is completely secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            5. Your Rights
          </h2>
          <p className="text-gray-600">
            You have the right to access, update, or delete your personal
            information. Contact us at support@dashboardapp.com to exercise
            these rights.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            6. Changes to This Policy
          </h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. Changes will be
            posted here, and continued use of the application constitutes
            acceptance of the updated policy.
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

export default PrivacyPolicy;
