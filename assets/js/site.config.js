/*
 * Bluefox Cleaning Solutions — site settings
 * ---------------------------------------------------------------------------
 * This is the one file to edit when company details change. Fill in a value
 * and it appears everywhere it is used (header, contact section, capability
 * statement, footer). Anything left empty ("" or []) shows on the page as a
 * clearly marked "To add" placeholder, so nothing unverified is ever published
 * as fact.
 *
 * Rules: keep the quotes, keep the commas, and only enter details the company
 * has verified. Save the file and refresh the page to see the change.
 */
window.BLUEFOX_SITE = {

  /*
   * Missing details
   * true  — every detail that is still empty shows as a marked "To add"
   *         placeholder. Use this while the site is being prepared.
   * false — empty details are hidden, together with any block or section they
   *         would leave empty, so nothing unfinished is public. Use this to
   *         launch before every detail is in.
   */
  showPlaceholders: true,

  company: {
    name: "Bluefox Cleaning Solutions",   // brand name, as written in the logo
    // Registered name as it appears on the certificates of insurance (October 2026).
    legalName: "Bluefox Property Solution LLC, DBA Bluefox Cleaning Solutions",
    address: "",                          // mailing or office address (optional; left out on purpose)
    identifiers: [
      // Business identifiers a contractor or procurement team may ask for.
      // Example: { label: "EIN", value: "00-0000000" },
      // Example: { label: "State business license", value: "000000" },
    ],
  },

  contact: {
    name: "Karolina Solovyova",   // the person estimators reach (optional)
    role: "Office contact",       // how that person is introduced on the page (optional)
    phone: "(941) 786-2032",      // shown as typed
    phoneHref: "",                // optional dial string, e.g. "+19417862032" (worked out from `phone` if left empty)
    email: "karolina@bluefoxcleaningsolutions.com",
    hours: "",                    // optional, e.g. "Monday to Friday, 7 a.m. to 5 p.m."
  },

  serviceArea: {
    primary: "Charlotte, NC",     // home market
    areas: [
      // Where projects are taken on as a matter of course, one per line.
      "North Carolina",
      "South Carolina",
    ],
    note: "Projects in Georgia, Tennessee and Virginia are taken on case by case.",
  },

  insurance: {
    // The site states "Fully insured". Add verified specifics here.
    // From the certificates of insurance dated October 9, 2026 (general
    // liability and umbrella to September 10, 2027; workers' compensation to
    // April 16, 2027). Update when the policies renew.
    details: [
      "General liability: $1,000,000 per occurrence, $2,000,000 aggregate",
      "Umbrella liability: $5,000,000 per occurrence and aggregate",
      "Workers' compensation: statutory; employers' liability $1,000,000",
      "Carrier: The Hartford. Certificate of insurance on request.",
    ],
  },

  capability: {
    // Optional headline numbers for page 1 of the PDF (up to four), e.g.
    // { value: "85+", label: "Projects completed" }. Left empty on purpose
    // (October 19, 2026): the owner prefers the statement without running
    // totals. Each entry needs a value and a label.
    stats: [],
    // The four projects shown with photographs on page 2 of the PDF, by their
    // title in trust.projects below. Left empty, the first four with photos show.
    featuredProjects: [
      "Urban Air Adventure Park",
      "SC Department of Administration, Wade Hampton Building",
      "Fogo de Chão",
      "Walgreens",
    ],
    // Six projects chosen for range, one line each. Not shown at present:
    // page 1 of the PDF carries the company summary instead (October 22, 2026),
    // and page 2 shows the projects. Kept for a future use.
    pastPerformance: [
      { type: "Entertainment", title: "Urban Air Adventure Park", size: "31,730 sq ft", location: "Columbia, SC" },
      { type: "Government", title: "SC Department of Administration, Wade Hampton Building", size: "16,238 sq ft", location: "Columbia, SC" },
      { type: "Healthcare", title: "FirstHealth Tramway", size: "8,000 sq ft", location: "Sanford, NC" },
      { type: "Retail", title: "Walgreens", size: "14,594 sq ft", scope: "Final clean and pressure washing", location: "Asheville, NC" },
      { type: "Restaurant", title: "Fogo de Chão", size: "8,200 sq ft", location: "Charlotte, NC" },
      { type: "Office", title: "1401 Main Street, 8th and 9th floors", size: "30,700 sq ft", location: "Columbia, SC" },
    ],
    // Page 2 of the PDF: a short list of further projects by type, each named
    // by its title in trust.projects (its location comes from there). These
    // do not need to change with every new job.
    selectedProjects: [
      { heading: "Healthcare", titles: ["FirstHealth Tramway", "Prisma Health Urgent Care, Red Bank", "MUSC Health Orangeburg"] },
      { heading: "Government and institutional", titles: ["York County Sheriff's Office, District 3", "Wake County Fire Training Center", "NC State D. H. Hill Jr. Library, atrium retail"] },
      { heading: "Retail, office and residential", titles: ["Bojangles, 14 locations", "Main Street office floors", "Townhomes at Cone Vista Circle"] },
    ],
    capacity: [
      "Standard crew of 5, up to 8 or 9 on larger projects",
      "Night and weekend shifts, scheduled around the project",
      "Lifts, floor machines, pressure washers, carpet extractors, air scrubbers",
      "Professional window-washing and high-dusting equipment",
    ],
    // One-page PDF behind the "Download PDF" button. Rebuild it after changing
    // details (README, "Capability statement PDF"). Set to "" to hide the button.
    pdf: "assets/docs/Bluefox-Capability-Statement.pdf",
  },

  // Client trust section. Add real, approved material only.
  trust: {
    // The general contractors Bluefox has worked for. Each shows its logo
    // above its name; "logo" points at a file in site/assets/img/clients/.
    // Twelve entries fill the wall as four across by three down.
    clients: [
      { name: "Rhetson Companies",      logo: "assets/img/clients/rhetson.png" },
      { name: "RayWest DesignBuild",    logo: "assets/img/clients/raywest.svg" },
      { name: "Springhill Construction", logo: "assets/img/clients/springhill.png" },
      { name: "VPC Builders",           logo: "assets/img/clients/vpc.png" },
      { name: "WIMCO",                  logo: "assets/img/clients/wimco.png" },
      { name: "Planet Construction",    logo: "assets/img/clients/planet.png" },
      { name: "Tri-North Builders",     logo: "assets/img/clients/trinorth.svg" },
      { name: "W.C. Construction",      logo: "assets/img/clients/wcconstruction.png" },
      { name: "Capitol Construction",   logo: "assets/img/clients/capitol.svg" },
      { name: "Triad Builders",         logo: "assets/img/clients/triad.svg" },
      { name: "Cooke Contracting",      logo: "assets/img/clients/cooke.png" },
      { name: "Trisect Commercial",     logo: "assets/img/clients/trisect.png" },
      // Everything after the first twelve sits behind a "Show more" control.
      { name: "Sela Building Corporation", logo: "assets/img/clients/sela.png" },
      { name: "Summit Construction",    logo: "assets/img/clients/summit.png" },
      { name: "First Class Construction", logo: "assets/img/clients/firstclass.png" },
      { name: "Independence Construction", logo: "assets/img/clients/independence.png" },
      { name: "BEI General Contractors", logo: "assets/img/clients/bei.png" },
      { name: "Gunter Mead Construction", logo: "assets/img/clients/guntermead.svg" },
      { name: "David E. Looper & Company", logo: "assets/img/clients/looper.svg" },
      { name: "Envision Construction Group", logo: "assets/img/clients/envision.png" },
      { name: "JNB Services",           logo: "assets/img/clients/jnb.png" },
      { name: "David A. Nice Builders", logo: "assets/img/clients/davidnice.png" },
      { name: "Kirkland, Inc.",         logo: "assets/img/clients/kirkland.png" },
      { name: "Cox & Company",          logo: "assets/img/clients/cox.png" },
      { name: "Blue Frog",              logo: "assets/img/clients/bluefrog.svg" },
      { name: "Berry Building Group",   logo: "assets/img/clients/berry.png" },
    ],
    // How many clients show before the "Show more" control (0 shows all).
    clientsShown: 12,
    // Completed projects, shown as a row that scrolls sideways. Photographs
    // sit in site/assets/img/projects/ at a 3:2 shape.
    projects: [
      { title: "Townhomes at Cone Vista Circle", scope: "Post-construction final clean", location: "Blowing Rock, NC",
        image: "assets/img/projects/project-cone-vista-blowing-rock.jpg", alt: "Townhome building on Cone Vista Circle with the Blue Ridge mountains behind" },
      { title: "Fogo de Chão", scope: "Restaurant remodel: final clean and carpet cleaning, 8,200 sq ft", location: "Charlotte, NC",
        image: "assets/img/projects/project-fogo-de-chao-charlotte.jpg", alt: "Fogo de Chão storefront and patio on South Tryon Street, Charlotte" },
      { title: "Urban Air Adventure Park", scope: "Post-construction final clean, 31,730 sq ft", location: "Columbia, SC",
        image: "assets/img/projects/project-urban-air-columbia.jpg", alt: "Lit tube slides inside the Urban Air park in Columbia" },
      { title: "Pandora, Magnolia Mall", scope: "Final clean, touch-up clean and VCT floor wax, 1,500 sq ft", location: "Florence, SC",
        image: "assets/img/projects/project-pandora-florence.jpg", alt: "A Pandora jewelry storefront inside a shopping mall" },
      { title: "Walgreens", scope: "Post-construction final clean and pressure washing, 14,594 sq ft", location: "Asheville, NC",
        image: "assets/img/projects/project-walgreens-asheville.jpg", alt: "New Walgreens store on Tunnel Road, Asheville" },
      { title: "SC Department of Administration, Wade Hampton Building", scope: "Third-floor renovation: final clean, 16,238 sq ft", location: "Columbia, SC",
        image: "assets/img/projects/project-wade-hampton-columbia.jpg", alt: "The Wade Hampton state office building in Columbia" },
      { title: "Main Street office floors", scope: "1221 Main, 16th floor (6,156 sq ft); 1401 Main, 8th and 9th floors (30,700 sq ft); 1230 Main, 4th floor: renovation final cleans", location: "Columbia, SC",
        image: "assets/img/projects/project-1221-main-columbia.jpg", alt: "The 1221 Main Street office tower in downtown Columbia" },
      { title: "FirstHealth Tramway", scope: "Final clean and touch-up clean, 8,000 sq ft", location: "Sanford, NC",
        image: "assets/img/projects/project-firsthealth-tramway-sanford.jpg", alt: "FirstHealth medical office building in Sanford" },
      { title: "Lowe's YMCA", scope: "Post-construction final clean", location: "Mooresville, NC",
        image: "assets/img/projects/project-lowes-ymca-mooresville.jpg", alt: "Entrance of the Lowe's YMCA in Mooresville" },
      { title: "Prisma Health Urgent Care, Red Bank", scope: "Post-construction final clean", location: "Lexington, SC",
        image: "assets/img/projects/project-prisma-urgent-care-lexington.jpg", alt: "Prisma Health Urgent Care building at Red Bank, Lexington" },
      { title: "NC State D. H. Hill Jr. Library, atrium retail", scope: "Retail renovation: final clean, 2,852 sq ft", location: "Raleigh, NC",
        image: "assets/img/projects/project-dh-hill-library-raleigh.jpg", alt: "The D. H. Hill Jr. Library entrance at NC State University" },
      { title: "Sweetgreen", scope: "Post-construction final clean, 2,821 sq ft", location: "Chapel Hill, NC",
        image: "assets/img/projects/project-sweetgreen-chapel-hill.jpg", alt: "Sweetgreen storefront on East Franklin Street, Chapel Hill" },
      { title: "CityVet, Village Plaza", scope: "Post-construction final clean, 2,769 sq ft", location: "Chapel Hill, NC",
        image: "assets/img/projects/project-cityvet-chapel-hill.jpg", alt: "Reception area inside CityVet in Chapel Hill" },
      { title: "Wake County Fire Training Center", scope: "Multipurpose building: carpet, VCT strip and wax", location: "New Hill, NC",
        image: "assets/img/projects/project-wake-fire-training-new-hill.jpg", alt: "Training exercise at the Wake County Fire Training Center" },
      { title: "Pleasantburg Veterinary Clinic", scope: "Post-construction final clean, 800 sq ft", location: "Greenville, SC",
        image: "assets/img/projects/project-pleasantburg-vet-greenville.jpg", alt: "Pleasantburg Veterinary Clinic building in Greenville" },
      { title: "Bojangles, 14 locations", scope: "Post-construction final cleans: Denton, Salisbury, Winston-Salem (2), Greensboro (2), Statesville, Charlotte, Spencer, Hickory, Asheboro, Cornelius, Welcome and Fort Mill", location: "NC and SC",
        image: "assets/img/projects/project-bojangles.jpg", alt: "A newly built Bojangles restaurant on opening day" },
      { title: "Taco Bell, 6 locations", scope: "Final cleans and pressure washing: Asheville, Hillsborough, Sylva, Hendersonville (2) and Greensboro", location: "North Carolina",
        image: "assets/img/projects/project-taco-bell.jpg", alt: "A newly built Taco Bell restaurant" },
      { title: "Verizon, 4 stores", scope: "Post-construction final cleans: Sherrills Ford, Durham, Florence and Greenville", location: "NC and SC",
        image: "assets/img/projects/project-verizon.jpg", alt: "A new Verizon storefront" },
      { title: "Moore County ABC Store", scope: "Post-construction final clean, 17,635 sq ft", location: "Carthage, NC",
        image: "assets/img/projects/project-abc-store-carthage.jpg", alt: "The new ABC Spirits store in Carthage" },
      { title: "Colonial Materials storage building", scope: "Post-construction final clean, 12,000 sq ft", location: "Hickory, NC",
        image: "assets/img/projects/project-colonial-materials-hickory.jpg", alt: "A Colonial Materials warehouse building" },
      { title: "York County Sheriff's Office, District 3", scope: "Post-construction final clean, 9,000 sq ft", location: "Rock Hill, SC",
        image: "assets/img/projects/project-york-county-sheriff-rock-hill.jpg", alt: "Lobby of a York County Sheriff's Office with the state flag on the wall" },
      { title: "Copart", scope: "Post-construction final clean, 7,500 sq ft", location: "Fletcher, NC",
        image: "assets/img/projects/project-copart-fletcher.jpg", alt: "Aerial view of the Copart site in Fletcher" },
      { title: "MUSC Health Orangeburg", scope: "Post-construction final clean, 4,685 sq ft", location: "Orangeburg, SC",
        image: "assets/img/projects/project-musc-orangeburg.jpg", alt: "MUSC Health medical campus in Orangeburg" },
    ],
  },

  /*
   * Quote request form
   * -------------------------------------------------------------------------
   * endpoint  — URL that accepts a POST of the form (multipart/form-data):
   *             a form service such as Web3Forms, Netlify Forms, or your own
   *             server. Steps for each are in README.md, "Connect the quote form".
   * If endpoint is empty but contact.email is set, the form prepares an email
   * draft instead. If both are empty the form explains that it is not
   * connected. The page never reports success unless the endpoint confirms it.
   */
  form: {
    endpoint: "",
    confirmWith: "json",        // "json": the service must answer { "ok": true } or { "success": true }
                                // "status": any 2xx answer counts (use this for Netlify Forms)
    extraFields: {
      // Sent with every request. Examples:
      // "access_key": "YOUR-WEB3FORMS-KEY",
      // "form-name": "quote",              // Netlify Forms
    },
    subjectField: "_subject",   // field name the service reads the email subject from ("subject" for Web3Forms)
    subjectPrefix: "Website quote request",   // start of the email subject, so the inbox shows where it came from
    emailFallback: true,        // allow the email-draft fallback when no endpoint is set
    sourceNote: "Sent from the quote form on bluefoxcleaningsolutions.com",   // first line of every request
    timeoutSeconds: 30,
    uploads: {
      enabled: true,            // set false if your form service does not accept files
      fieldName: "attachments", // field name the files are sent under
      maxFiles: 5,
      maxFileMB: 10,
    },
  },

  links: {
    privacyUrl: "",   // link to the company's privacy policy once it exists
  },
};
