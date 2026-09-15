# TA Hours

A private, device-local teaching assistant hours tracker. Built for McMaster PHYSICS 1D03 tutorials and labs, with editable assignments for any course. Independent project, not affiliated with McMaster University.

## Features

- Manual entry of actual hours/minutes or start/end times with non-work breaks.
- Task timer that survives tab closure and phone locking; **Stop & save** automatically records a session and updates totals.
- Timer durations round to the nearest minute, with a minimum of one minute. Entries can be edited or deleted afterward. Timers crossing midnight split automatically into daily entries. Timers longer than 24 hours require confirmation; discard a forgotten timer and enter actual work manually.
- All-time and Monday–Sunday weekly totals, automatic academic term dates, category budgets, remaining hours and over-allocation indicators.
- Tutorial TA1/TA2 and Lab TA1–TA4 presets from the supplied orientation slides; additional courses and terms.
- JSON backup/restore, term-based CSV reports and print-to-PDF using the browser's print dialog.
- Responsive interface, installable app manifest and offline shell after first successful load.
- No dependencies, accounts, analytics, backend or work-data uploads.

## Use

Select **Log work**, choose your assignment and category, and enter an activity such as “Midterm 1 marking”. Choose Duration, Start and end times, or Live timer. With a live timer, press **Stop & save** in the recording banner when finished. Stop and restart for breaks.

On first use, choose your TA role and update the term/budgets to match your signed Hours of Work form. The tracker starts with no role selected, so it does not assume an appointment. Shared duties must be recorded only once. For Lab role templates, midterm marking/invigilation belongs to the combined Other budget; retain the task name in Activity.

## Privacy and backups

Work data is stored as JSON under `ta-hours.v1` in browser localStorage. It is local to the browser profile, device and website origin; it is not automatically synchronized between devices. A public website has separate records for each visitor. Anyone using the same device/browser profile can access its records. Do not enter student personal information.

Regularly export a JSON backup and keep it in a safe location. Clearing site data, private browsing, device loss or moving to another domain can remove access. Import validates a backup before replacing all local records; it does not merge. Export each device before importing. Imported live timers are discarded. Requesting persistent storage may reduce browser eviction, but does not replace backups.

The host still serves static assets and may keep ordinary access logs; the application never transmits the work records. No external fonts, scripts or analytics are loaded.

## Publish to GitHub Pages

1. Create a new public repository named `ta-hours` on your GitHub account, preferably without initializing a README.
2. Upload the complete project contents, including `.github/workflows/pages.yml`, to its `main` branch. Do not upload the original orientation PDFs or personal work backups.
3. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions** as Source.
4. Run **Publish TA Hours** from the Actions tab (or push a commit). The workflow tests the calculations and publishes only `dist`.
5. Open the website URL shown in the completed deployment. Share that URL with other users. Each starts with an empty tracker.

If using Git locally:

```sh
git init -b main
git add .
git commit -m "Add TA hours tracker"
git remote add origin https://github.com/YOUR-USERNAME/ta-hours.git
git push -u origin main
```

The app uses relative paths so GitHub Pages project subdirectories work. Any static HTTPS host can serve `dist` unchanged. Never host personal backup JSON files in the public repository.

## Run locally

Python 3 is sufficient:

```sh
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. Do not double-click index.html: modules and service workers need an HTTP(S) origin. Localhost supports service workers; installation on other devices requires an HTTPS deployment.

## Install on a device

After opening the deployed site, use Safari's Share → Add to Home Screen on iPhone/iPad, or the browser's install option where available on Android/desktop. The app must load online successfully once before its cached shell is available offline. Platform installation behavior varies; use the same installed app/browser consistently for your records.

## Budget source notes

The supplied 1D03 Tutorial TA Orientation and 1D03 Lab TA Orientation tables give the following allocations in hours. The PDFs, personal contact information and room access codes are deliberately excluded from this public project.

| Role | Teaching | Consultation / lectures | Grading | Preparation | Invigilation | Other | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| Tutorial TA1 | 12 | 25 | 17 | 5 | 6 | 0 | 65 |
| Tutorial TA2 (L35) | 6 | 31 | 17 | 5 | 6 | 0 | 65 |
| Lab TA1 | 30 | 0 | 15 | 15 | 0 | 5 | 65 |
| Lab TA2 | 30 | 0 | 5 | 15 | 0 | 15 | 65 |
| Lab TA3 (double) | 60 | 0 | 25 | 15 | 0 | 30 | 130 |
| Lab TA4 (L35) | 45 | 20 | 20 | 15 | 0 | 30 | 130 |

These are allocation estimates, not worked hours or a payroll entitlement calculation. Tutorial teaching is budgeted as 2-hour sessions; lab teaching as 3-hour sessions, while the schedule lists 8:30–11:20 / 14:30–17:20. Enter real time including actual setup/wrap-up. The tutorial table budgets one hour per lecture attendance; confirm your schedule instead of inferring a weekly count. The lecture C1 time in the source appears inconsistent with other lecture lengths, so no recurring attendance is prefilled.

## Accuracy and implementation

Integer-minute storage avoids cumulative decimal-hour rounding. Decimal hours are display/export values; exact minutes remain authoritative. Manual timed records use local wall-clock arithmetic and explicit dates, so an overnight session works. Split midnight-crossing work for daily reports. For daylight-saving clock changes or travel time-zone changes, enter actual elapsed duration manually. The live timer uses timestamp elapsed time but depends on the device clock; check its result if the clock changes.

Time-based overlaps are rejected across assignments. Duration-only records cannot prove whether time overlaps: review them yourself. A duplicate-description/date/duration check prompts before a possible duplicate manual entry is saved. Web Locks serialize updates where supported; revision checks reject stale edit forms. Older browsers without Web Locks have a narrow concurrent-write risk, so keep one editing tab open.

Backups are size-limited and schema-validated. Stored text is escaped before display, and CSV formula prefixes are neutralized. Successful localStorage writes are required before reporting a save. Invalid saved data is not silently overwritten; export it for recovery or restore a valid backup.

## Development and tests

Requires Node.js 22 for the test suite, with no package installation:

```sh
npm test
```

Core tests cover the orientation budgets, lab duration, overnight/break calculations, invalid dates, overlap boundaries, backup integrity and CSV safety. Browser/device installation and visual testing have not been performed in this environment.

Source files live in `dist` (there is no build step). Bump the cache version in `dist/sw.js` whenever releasing changed application assets; the new offline cache activates after old tabs close. App data is stored independently from the asset cache.

## License

MIT. Contributions welcome through issues and pull requests. Never attach personal work backups or student information to public issues.

## Terms and device layouts

Select a season and year in Manage. Fall runs September 1–December 31, Winter January 1–April 30, and Summer May 1–August 31. The dashboard shows these dates automatically. The work log and CSV default to the selected term. If an assignment has entries outside its term, use the include checkbox to review/export them. Allocation totals always count all work assigned to the appointment. Existing custom term names remain supported with all dates visible.

The layout adapts from small phones to tablets and desktops with touch-sized controls, readable form fields, scrollable dialogs and keyboard focus indicators. Records remain local to each browser; use JSON backup/import to move records between devices.

## Physics 1C03

The 1C03 Lab TA template follows the supplied Fall 2026 Hours of Work form: 30h teaching, 4h consultation, 10h grading, 18h preparation and 3h invigilation, totaling 65h of duties. The form adds 3h for a total of 68h; the app places this additional allowance under Other for tracking (the source leaves the Other duties row blank). The appointment starts September 8, 2026; the academic term remains September 1–December 31. The separate once-only 5h mandatory TA training is not included in this course template. The original form contains personal details and is kept outside the public repository.
