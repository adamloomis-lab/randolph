import LegalLayout from "@/components/LegalLayout";
// @ts-expect-error - plain JS module shared with the prerender script
import { BUSINESS } from "@/config/business.js";
import { useSeo } from "@/lib/useSeo";
// @ts-expect-error - plain JS module shared with the prerender script
import { PAGE_SEO } from "@/lib/seoData.js";

export default function Terms() {
  useSeo({ ...PAGE_SEO["/terms"], path: "/terms" });
  return (
    <LegalLayout title="Terms of Use" updated="May 26, 2026">
      <p>
        Welcome to <strong>randolph.construction</strong>. By using this website, you agree to these Terms of Use. If
        you do not agree, please do not use the site.
      </p>

      <h2>Use of This Site</h2>
      <p>
        This website is provided for general information about Randolph Construction and the services we offer. You agree
        to use it only for lawful purposes and not to interfere with its operation or security.
      </p>

      <h2>Estimates &amp; Quotes</h2>
      <p>
        Any pricing, availability, or service information on this site is for general guidance only and is not a binding
        offer. Project pricing is confirmed only in a written estimate or agreement provided directly by Randolph
        Construction after we understand the scope of your project.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content on this site — including text, logos, photographs of our work, and design — is the property of
        Randolph Construction and may not be copied or reused without our permission.
      </p>

      <h2>Photography</h2>
      <p>Project photos shown on this site represent real work completed by Randolph Construction.</p>

      <h2>Third-Party Links</h2>
      <p>
        Our site may link to third-party websites (such as maps or social media). We are not responsible for the content
        or practices of those sites.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        This website is provided "as is" without warranties of any kind. To the fullest extent permitted by law,
        Randolph Construction is not liable for any damages arising from your use of this website.
      </p>

      <h2>Governing Law</h2>
      <p>These Terms are governed by the laws of the State of Ohio.</p>

      <h2>Changes to These Terms</h2>
      <p>We may update these Terms at any time. Continued use of the site means you accept the current version.</p>

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
