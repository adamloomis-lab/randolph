import LegalLayout from "@/components/LegalLayout";
// @ts-expect-error - plain JS module shared with the prerender script
import { BUSINESS } from "@/config/business.js";
import { useSeo } from "@/lib/useSeo";
// @ts-expect-error - plain JS module shared with the prerender script
import { PAGE_SEO } from "@/lib/seoData.js";

export default function Privacy() {
  useSeo({ ...PAGE_SEO["/privacy"], path: "/privacy" });
  return (
    <LegalLayout title="Privacy Policy" updated="May 26, 2026">
      <p>
        This Privacy Policy explains how Randolph Construction ("we," "us," or "our") collects, uses, and protects
        information when you visit <strong>randolph.construction</strong> or contact us for an estimate.
      </p>

      <h2>Information We Collect</h2>
      <p>We only collect information you choose to give us, plus basic technical data:</p>
      <ul>
        <li>
          <strong>Contact details you submit:</strong> when you fill out a quote or contact form, we collect your name,
          phone number, email address, project location, the service you're interested in, and any project details you
          provide.
        </li>
        <li>
          <strong>Basic usage data:</strong> like most websites, our host may log standard information such as your IP
          address, browser type, and the pages you visit, to keep the site secure and running.
        </li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To respond to your inquiry and prepare your estimate.</li>
        <li>To schedule, perform, and follow up on the work you request.</li>
        <li>To improve our website and services.</li>
      </ul>

      <h2>How We Share Information</h2>
      <p>
        We do <strong>not</strong> sell or rent your personal information. We only share it with trusted service
        providers that help us operate — for example, our website host (Netlify), which processes form submissions and
        delivers them to us by email. These providers are only permitted to use your information to provide their
        services to us.
      </p>

      <h2>Data Retention</h2>
      <p>
        We keep inquiry and project information only as long as needed to serve you and to keep reasonable business
        records. You can ask us to delete your information at any time.
      </p>

      <h2>Your Choices</h2>
      <p>
        You may request access to, correction of, or deletion of the personal information you've shared with us by
        emailing <a href={BUSINESS.emailHref}>{BUSINESS.email}</a> or calling{" "}
        <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.
      </p>

      <h2>Children's Privacy</h2>
      <p>Our website is intended for adults and is not directed to children under 13.</p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Any changes will be posted on this page with an updated date above.
      </p>

      <h2>Contact Us</h2>
      <p>
        Randolph Construction — Wadsworth, Ohio
        <br />
        Phone: <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>
        <br />
        Email: <a href={BUSINESS.emailHref}>{BUSINESS.email}</a>
      </p>
    </LegalLayout>
  );
}
