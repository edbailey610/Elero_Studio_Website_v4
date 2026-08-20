ELERO STUDIO WEBSITE — V4

CHANGES
-------
1. Hero
   - Fixed the clipped final "s" in "businesses".
   - Kept the 3D hero but removed the decorative floating spheres.
   - Updated the mock browser address to elerostudio.com.

2. Services
   - Kept the section clean with 3 core service rows.
   - Added a compact solutions panel for:
     Booking systems
     Payment integration
     Email solutions
     Automation
     Client portals
     Search engine optimisation
   - Mobile version becomes a swipeable solution rail instead of a crowded stack.

3. Enquiry form
   - Replaced the demo/fake form with Netlify Forms.
   - Added spam honeypot protection.
   - Added real success/error feedback.
   - Added a fallback thanks.html page.
   - Added more service choices to the enquiry dropdown.

ONE-TIME NETLIFY SETUP
----------------------
Before/after pushing V4:

A) Enable form detection:
   Netlify project -> Forms -> Enable form detection
   Then deploy/push this V4.

B) After the deploy, Netlify should show a form called:
   project-enquiry

C) To receive every submission by email:
   Project configuration -> Notifications -> Emails and webhooks
   -> Form submission notifications -> Add notification
   Choose Email notification and send it to:
   ed@elerostudio.com

The enquiry field is named "email", so Netlify can use the client's
address as Reply-To in the notification.

NORMAL UPDATE WORKFLOW
----------------------
VS Code -> test locally -> GitHub Desktop -> Commit -> Push.
If Netlify is connected to GitHub, the push triggers the production deploy.
