import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | Jyotirling Connect",
  description: "Privacy policy and data handling practices for Jyotirling Connect.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[100dvh] flex-col pt-24 pb-16 bg-bg">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-6">
              Privacy Policy
            </h1>
            <p className="text-ink-muted">Last Updated: July 2025</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none text-ink-muted prose-headings:text-ink prose-headings:font-display">
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
            <p>
              When you book a journey or contact us through our website, we collect personal information necessary to provide our services. This includes:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Full Name</li>
              <li>Phone Number / WhatsApp Number</li>
              <li>Email Address</li>
              <li>Pickup and Drop-off locations</li>
              <li>Travel Dates and Preferences</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
            <p>
              The information we collect is used strictly for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>To confirm and manage your travel bookings.</li>
              <li>To communicate with you regarding your journey, driver details, and schedules.</li>
              <li>To respond to your inquiries and support requests.</li>
              <li>To improve our services based on your feedback.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Sharing and Third Parties</h2>
            <p>
              We respect your privacy. Jyotirling Connect does <strong>not</strong> sell, rent, or trade your personal information to third parties. We only share necessary details (such as your name and phone number) with your assigned driver to facilitate the pickup and journey.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal data stored in our database. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Cookies</h2>
            <p>
              Our website may use essential cookies to maintain your session (such as your theme preference for light/dark mode). We do not use tracking or advertising cookies without your explicit consent.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Your Rights</h2>
            <p>
              You have the right to request access to the personal data we hold about you, or ask for it to be deleted. To exercise these rights, please contact us using the information provided on our Contact page.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please contact us at <strong>info@jyotirlingconnect.com</strong>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
