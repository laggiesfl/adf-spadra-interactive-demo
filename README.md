# ADF/SPADRA Interactive Demonstration

## Live Airtable resource publishing

The public Knowledge Hub always shows six bundled illustrative resources. When configured, it also loads persistent records from Airtable. Only records whose `Publication status` is `Published` are public.

The protected workspace identifies its sole demonstration user as **Fadila Lagadien — BeAccessible**. It is not an ADF staff account. Authentication, Airtable access and file upload are handled by same-origin Vercel Functions. No secret belongs in browser JavaScript.

Required Vercel environment variables are listed—with empty values—in `.env.example`. Generate the password hash privately with `npm run create:password-hash`. Use a separate random value of at least 32 characters for `SESSION_SECRET`. Configure all values in Vercel rather than committing an `.env` file.

The Airtable base is named `ADF SPADRA Demo Resources` and contains a `Resources` table with the fields documented in the approved design specification. Restrict the Airtable personal access token to that base and the required record/attachment permissions.

Accepted uploads are PDF, DOCX and TXT up to 4 MB. This fits both Airtable attachment upload and Vercel request-body constraints.

An interview-ready, browser-based demonstration of the proposed SPADRA Online Hub embedded within the African Disability Forum digital ecosystem.

## Recommended interview route

Select **Start guided demonstration** and follow the seven prompts. The route takes approximately five to seven minutes and covers the country explorer, policy tracker, Knowledge Hub, learning, low-bandwidth mode, staff workflow and accessibility controls.

## Two-minute fallback route

1. Introduce SPADRA from the overview.
2. Filter the policy tracker by one country.
3. Turn on low-bandwidth mode.
4. Sign in as Fadila, publish a real demonstration resource and show it in the Knowledge Hub.
5. Open accessibility settings and explain production testing.

## Safe demonstration behaviour

- All records are illustrative.
- The Join form remains a local simulation and sends no personal information.
- Staff resource records and attachments persist in Airtable; learning progress remains in the current browser.
- **Reset demonstration preferences** does not delete persistent resources.

## Production continuity

The interface separates content records, state and rendering. After appointment, Airtable can remain for a small editorial workflow or be replaced by an ADF-approved CMS/database and organisational identity system without a visual rebuild.

## Accessibility Compliance Note

The demonstration targets WCAG 2.1 Level AA and incorporates selected WCAG 2.2 and AAA improvements where feasible. It includes semantic structure, keyboard access, visible focus, reflow, reduced motion, high contrast, text resizing, live status messages, accessible errors, low-bandwidth support and non-colour-only communication. It is not a formal conformance certification; production requires assistive-technology testing, content review and testing involving persons with disabilities.

