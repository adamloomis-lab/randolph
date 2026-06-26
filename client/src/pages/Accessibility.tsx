import LegalLayout from "@/components/LegalLayout";
// @ts-expect-error - plain JS module shared with the prerender script
import { BUSINESS } from "@/config/business.js";
import { useSeo } from "@/lib/useSeo";
// @ts-expect-error - plain JS module shared with the prerender script
import { PAGE_SEO } from "@/lib/seoData.js";

export default function Accessibility() {
  useSeo({ ...PAGE_SEO["/accessibility"], path: "/accessibility" });
  return (
    <LegalLayout title="Accessibility Statement" updated="June 2026">
      <h2>Our Commitment</h2>
      <p>
        This site is built to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, the standard
        referenced by the ADA for web accessibility. We review and update our accessibility practices on an ongoing
        basis.
      </p>

      <h2>What We Have Done</h2>
      <p>We have taken the following steps to make this site accessible to as many visitors as possible:</p>
      <ul>
        <li>
          We include skip links so keyboard and screen reader users can bypass navigation and get straight to the main
          content.
        </li>
        <li>
          A visible outline appears on every interactive element when navigated by keyboard, so you always know where
          your focus is.
        </li>
        <li>
          Text colors are chosen to meet the 4.5:1 minimum contrast ratio for readability by people with low vision.
        </li>
        <li>
          All form fields, buttons, and interactive elements have descriptive labels readable by screen readers.
        </li>
        <li>
          Animations automatically reduce for users who have the Reduce Motion preference enabled on their device.
        </li>
      </ul>

      <h2>Report an Issue</h2>
      <p>
        If you encounter any accessibility barrier on this site, please contact us and we will address it promptly.
        Call us at <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a> and we will be glad to help.
      </p>
    </LegalLayout>
  );
}
