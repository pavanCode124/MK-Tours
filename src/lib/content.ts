// Editorial copy the CRM does not hold: trust markers, FAQs, and traveller
// reviews. Kept in one file so the agency can edit wording without touching
// layout.

export const AGENCY = {
  name: 'MK Tours',
  tagline: 'Private & Group Tours across India & Globe',
  since: 2017,
  travellers: '10,000+',
  phonePrimary: '9309901865',
  phoneSecondary: '8308686083',
  emergencyPhone: '7057975880',
  email: 'service.mktours@gmail.com',
  whatsapp: '+919309901865',
  instagram: 'https://www.instagram.com/mk.tours_/',
  googleProfile: 'https://share.google/tcPO1Dh1I5l0kQ1uT',
  website: 'www.mktours.in',
  address: 'MK Tours, Mumbai, Maharashtra, India',
  hours: 'Available 24×7, All 365 Days',
};

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

/** The rotating word in the hero, each linking to the theme it names. */
export const HERO_WORDS: { word: string; href: string }[] = [
  { word: 'Devotion', href: '/themes/pilgrimage' },
  { word: 'Escape', href: '/packages' },
  { word: 'Serenity', href: '/themes/hill-station' },
  { word: 'Heritage', href: '/themes/heritage' },
  { word: 'Belonging', href: '/themes/family' },
  { word: 'Freedom', href: '/themes/honeymoon' },
  { word: 'Horizons', href: '/themes/international' },
];

export const HERO_SLIDES = [
  { src: '/images/hero-pahalgam.jpg', alt: 'The Lidder valley at Pahalgam, Kashmir' },
  { src: '/images/hero-varanasi.jpg', alt: 'Ghats and temples along the Ganga at Varanasi' },
  { src: '/images/hero-alleppey.jpg', alt: 'A houseboat on the Alleppey backwaters, Kerala' },
  { src: '/images/hero-taj.jpg', alt: 'The Taj Mahal at Agra' },
];

/* -------------------------------------------------------------------------- */
/* Trust bar                                                                  */
/* -------------------------------------------------------------------------- */

export const TRUST_ITEMS: { top: string; label: string; note: string }[] = [
  { top: '★★★★★', label: '4.9 / 5', note: 'Google reviews' },
  { top: '10,000+', label: 'Travellers', note: 'Since 2017' },
  { top: 'GST', label: 'Registered', note: 'Invoiced, on the books' },
  { top: 'Tour', label: 'Manager', note: 'On every departure' },
  { top: '24×7', label: 'Support', note: 'All 365 days' },
];

/* -------------------------------------------------------------------------- */
/* Why us                                                                     */
/* -------------------------------------------------------------------------- */

export const PILLARS: { icon: 'group' | 'pin' | 'shield' | 'home'; title: string; text: string }[] = [
  {
    icon: 'group',
    title: 'Private & Group',
    text: 'Join a fixed departure with a tour manager, or take the whole itinerary private — your dates, your pace.',
  },
  {
    icon: 'pin',
    title: 'Fixed Departures',
    text: 'Dated group departures by train from Mumbai, with the route, stays and sightseeing settled before you book.',
  },
  {
    icon: 'shield',
    title: 'One Clear Price',
    text: 'Train, hotels, meals, transport and sightseeing in one figure — with the exclusions written out, not buried.',
  },
  {
    icon: 'home',
    title: 'Trusted Partner',
    text: 'More than 10,000 travellers since 2017, and a team that answers the phone on the road, not just before it.',
  },
];

/* -------------------------------------------------------------------------- */
/* Reviews                                                                    */
/* -------------------------------------------------------------------------- */

export interface Review {
  name: string;
  place: string;
  quote: string;
  stars: number;
}

export const REVIEWS: Review[] = [
  {
    name: 'Sandeep Kulkarni',
    place: 'Pune · Vrindavan Group Tour',
    stars: 5,
    quote:
      'Train tickets, hotels and the temple darshan were all arranged before we left. The tour manager stayed with us the whole way, which made a big difference with elderly parents along.',
  },
  {
    name: 'Rohini Deshmukh',
    place: 'Mumbai · Kerala Group Tour',
    stars: 5,
    quote:
      'Munnar, Thekkady and the Alleppey houseboat in one week, with no gaps and no surprise costs. The pricing sheet we were given at booking was exactly what we paid.',
  },
  {
    name: 'Imran Shaikh',
    place: 'Mumbai · Kashmir with Vaishno Devi',
    stars: 5,
    quote:
      'Gulmarg, Sonmarg and Pahalgam were spaced out sensibly rather than crammed into two days. Katra was handled well — they had the yatra slips ready for the group.',
  },
  {
    name: 'Meenal Joshi',
    place: 'Thane · Royal Rajasthan',
    stars: 5,
    quote:
      'Jaisalmer and the desert camp were the highlight. Clean hotels throughout, and the coordinator answered on WhatsApp within minutes every time we asked something.',
  },
];

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

export interface FaqGroup {
  group: string;
  items: { q: string; a: string }[];
}

export const FAQS: FaqGroup[] = [
  {
    group: 'Booking',
    items: [
      {
        q: 'How do I book a tour?',
        a: 'Pick a package, then message us on WhatsApp or call. We confirm your dates, the sharing option and the train class you want, send a written quotation, and hold your seats on an advance. Nothing is booked until you have the quotation in writing.',
      },
      {
        q: 'How far in advance should I book?',
        a: 'For fixed departures, 45 to 60 days is comfortable — group rail bookings have to be made well ahead of travel. Peak windows such as Holi in Vrindavan, Kashmir in May and June, and Rajasthan between December and February fill earlier than that.',
      },
      {
        q: 'Can I book for a group larger than a standard departure?',
        a: 'Yes. Groups of 15 or more can take a departure privately, with the itinerary adjusted to your pace. Tell us the group size and the dates you have in mind and we will quote it separately.',
      },
      {
        q: 'Can I book on behalf of someone else?',
        a: 'Yes. We need each traveller’s name as it appears on their photo ID, their age and a contact number, because rail bookings are made against identity documents.',
      },
      {
        q: 'Do you arrange private or custom tours, or only fixed departures?',
        a: 'Both. The packages on this site are our fixed group departures. Any of them can be run privately for your family or group, and we also build itineraries from scratch — message us with what you have in mind.',
      },
    ],
  },
  {
    group: 'Payments & pricing',
    items: [
      {
        q: 'How much deposit is required to confirm a booking?',
        a: 'An advance per traveller confirms your seat; the exact figure is on each package’s payment policy, because it depends on the rail class and the lead time. The balance is due before departure on the schedule in that policy.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'UPI, bank transfer (NEFT/IMPS) and cards. Every payment is receipted, and the final invoice is issued in the name of the lead traveller.',
      },
      {
        q: 'Are there any hidden costs beyond the listed price?',
        a: 'No. Each package lists its inclusions and its exclusions in full. The usual exclusions are entry fees and monument tickets, special or VIP darshan charges, personal expenses, and anything described as optional in the itinerary.',
      },
      {
        q: 'What do the different prices on a package mean?',
        a: 'Each package is quoted four ways: sleeper or 3AC train class, each with triple or twin hotel sharing. Triple sharing on sleeper is the lowest price; twin sharing on 3AC is the highest. You choose at booking.',
      },
      {
        q: 'Do you offer discounts for larger groups?',
        a: 'Yes. Groups travelling together get a per-head reduction that depends on size and season. Ask when you enquire and we will put it in the quotation.',
      },
    ],
  },
  {
    group: 'Changes & cancellations',
    items: [
      {
        q: 'What is your cancellation policy?',
        a: 'Each package carries its own cancellation policy, shown in full on its page. Charges rise as departure approaches, and the rail component follows Indian Railways’ own cancellation rules, which we pass through at cost.',
      },
      {
        q: 'Can I transfer my booking to someone else instead of cancelling?',
        a: 'Usually yes, if you tell us far enough ahead for the rail booking to be amended. Transfers are subject to the railway’s rules on name changes.',
      },
      {
        q: 'What happens if MK Tours cancels the tour?',
        a: 'If we cancel a departure, you are offered an alternative date or a full refund of everything paid to us, including the advance.',
      },
      {
        q: 'How long does a refund take to process?',
        a: 'Refunds are processed within 7 to 10 working days of the cancellation being confirmed, to the account the payment came from.',
      },
    ],
  },
  {
    group: 'On the road',
    items: [
      {
        q: 'What is the maximum group size?',
        a: 'Fixed departures run with a tour manager accompanying the group throughout, and group sizes are kept to a level where the manager can actually look after everyone — typically 25 to 40 travellers depending on the route.',
      },
      {
        q: 'Is solo travel safe on your group tours?',
        a: 'Yes, and solo travellers join most departures. You will be matched into a shared room with a traveller of the same gender, or you can pay the single-occupancy supplement for a room of your own.',
      },
      {
        q: 'What should I pack?',
        a: 'It depends on the route. Kashmir and Nepal need layers and a warm jacket even in summer. Temple towns need modest clothing that covers shoulders and knees. Rajasthan in winter is warm by day and cold at night. We send a packing note with your confirmation.',
      },
      {
        q: 'Do I need any special fitness level?',
        a: 'Most itineraries are suitable for all ages. Two need some preparation: the climb to Vaishno Devi from Katra, where ponies and palanquins are available, and the altitude at Muktinath in Nepal.',
      },
      {
        q: 'What documents do I need to carry?',
        a: 'An original photo ID for every traveller — Aadhaar, voter card, passport or driving licence — because rail travel in India requires it. For Nepal, Indian nationals need a passport or voter card; Aadhaar is not accepted at the border.',
      },
      {
        q: 'Can you accommodate dietary restrictions?',
        a: 'Yes. Meals on our tours are vegetarian by default, and Jain food can be arranged with notice. Tell us at booking so the hotels are briefed.',
      },
      {
        q: 'What happens if there is a medical emergency during the trip?',
        a: 'The tour manager carries a first-aid kit and our emergency number is staffed around the clock. We get you to the nearest hospital and stay with you, and we keep your family informed.',
      },
    ],
  },
  {
    group: 'About us',
    items: [
      {
        q: 'Where does MK Tours operate?',
        a: 'Across India — from Kashmir and Punjab in the north to Kerala in the south, and Rajasthan in the west to Bihar and Jharkhand in the east — plus Nepal. Departures leave from Mumbai, with boarding available at Pune.',
      },
      {
        q: 'How long has MK Tours been operating?',
        a: 'We have been running private and group tours since 2017, and more than 10,000 travellers have travelled with us since.',
      },
      {
        q: 'Is MK Tours a registered company?',
        a: 'Yes. We are a GST-registered travel business, and every booking is invoiced.',
      },
      {
        q: 'How can I leave feedback or a review after my trip?',
        a: 'We send a short note after you return, and you can review us on our Google profile. We read everything, including the critical ones — it is how the itineraries get better.',
      },
    ],
  },
];

/** Flattened list, in page order — used for the home page accordion. */
export const ALL_FAQS = FAQS.flatMap((g) => g.items);
