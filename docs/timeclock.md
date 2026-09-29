# Time clock: how it runs

The crew clock in at `/employee` (or their personal `?u=` link). The owner signs in at `/admin`, which is not linked anywhere on the site.

## Where things live

| Piece | File |
|---|---|
| Main function, every action | `netlify/functions/timeclock.mjs` |
| Storage, login security, backups | `netlify/functions/_lib/core.mjs` |
| Email, texts, weekly payroll summary | `netlify/functions/_lib/notify.mjs` |
| Nightly backup, 3:00 AM Eastern | `netlify/functions/timeclock-backup.mjs` |
| Weekly payroll email, 7:00 AM Eastern | `netlify/functions/timeclock-payroll-email.mjs` |
| Clock-out reminder texts, every half hour from 1 PM to midnight | `netlify/functions/timeclock-reminders.mjs` |
| Crew page | `client/src/pages/TimeClock.tsx` |
| Owner screens | `client/src/pages/TimeClockAdmin.tsx` and `client/src/pages/timeclock/` |
| Operator tool | `scripts/timeclock-admin.mjs` |

## Stored records (Netlify Blobs, store `timeclock`)

| Key | Holds |
|---|---|
| `employees`, `jobs`, `settings` | One list each |
| `entry:YYYYMMDD-xxxxxxxx` | One shift. The id carries the shift date. |
| `open:<employeeId>` | A clock-in that has not been clocked out yet |
| `trash:<entryId>` | A deleted shift, kept 90 days |
| `archive:YYYY-MM` | Every shift of a finished month in one record, rebuilt nightly. Trusted only while each shift still has the etag it had when the archive was built. |
| `fail:admin`, `fail:emp:<id>` | Wrong-PIN counters for the lockout |
| `reminded:<employeeId>`, `sent:payroll:<week>` | Marks that stop a text or email going out twice |

Backups go to a second store, `timeclock-backups`: `daily/YYYY-MM-DD.json` (35 kept, plus the first of every month) and `manual/...`.

## Turning on email and texts

Both features are built and stay quiet until these variables exist on the Netlify site. The owner screen says "not connected" until then.

| Feature | Variables |
|---|---|
| Weekly payroll email | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, optional `RESEND_REPLY_TO` |
| Clock-out reminder texts | `TWILIO_ACCOUNT_SID`, `TWILIO_FROM_NUMBER`, and either `TWILIO_AUTH_TOKEN` or `TWILIO_API_KEY_SID` with `TWILIO_API_KEY_SECRET` |

The texting number needs its own toll-free verification or 10DLC campaign, or carriers drop the messages.

## Owner forgot the passcode

There is no reset link by design. From the project root, with the Netlify CLI logged in:

```bash
netlify blobs:get timeclock settings > /tmp/settings.json
```

Remove the `adminHash` field, add `"adminPin": "<four digits>"`, then:

```bash
netlify blobs:set timeclock settings --input /tmp/settings.json
```

Delete `/tmp/settings.json` afterward. The owner signs in with those four digits and sets a new passcode under Settings. If the login is locked from wrong tries, delete the `fail:admin` key.

## Restoring from a backup

Run `node scripts/timeclock-admin.mjs backup` first so the current state is saved. Then read the snapshot you want from the `timeclock-backups` store and write its `employees`, `jobs`, `settings`, and each entry back to the `timeclock` store. Restore is a manual job on purpose: it overwrites payroll records.
