import type { Metadata } from 'next';
import { CollectionPage } from '@/components/CollectionPage';
import { allDestinations } from '@/lib/catalog';
import { getPackages } from '@/lib/mktours';

export const metadata: Metadata = {
  title: 'Weekend Getaways',
  description:
    'Short MK Tours departures you can fit around a long weekend, plus the private trips we build to order when nothing on the calendar fits.',
};

/** A weekend trip is anything of five days or fewer. */
const MAX_DAYS = 5;

export default async function WeekendGetawaysPage() {
  const packages = await getPackages();
  const tours = packages.filter((p) => (p.days ?? 99) <= MAX_DAYS);
  const destinations = allDestinations(packages).slice(0, 10);

  return (
    <CollectionPage
      image="/images/dest-vrindavan.jpg"
      eyebrow="Short trips"
      title="Weekend Getaways"
      lede="Trips of five days or fewer — short enough for a long weekend, long enough to be worth the journey."
      crumbLabel="Weekend Getaways"
      tours={tours}
      destinations={destinations}
      emptyTitle="Our fixed departures all run longer than a weekend"
      emptyBody="MK Tours builds its group calendar around six- to ten-day journeys by train, because that is what the distances from Mumbai ask for. For a shorter trip we put together private itineraries to order — tell us your dates and we will price one."
      notes={[
        {
          title: 'Why our group tours run long',
          body: 'Departures travel by train from Mumbai, and the destinations we go to — Kashmir, Kerala, Rajasthan, the Ganga plain — are a day away. Six days is the shortest that leaves real time on the ground.',
        },
        {
          title: 'Short private trips',
          body: 'We arrange two- and three-night private trips on request, by flight or train, for families and small groups. Same hotels, same ground team, your own pace.',
        },
        {
          title: 'Tell us your dates',
          body: 'Message us the weekend you have free and the kind of place you want — hills, coast, or a temple town — and we will come back with options and a price.',
        },
      ]}
    />
  );
}
