import type { Metadata } from 'next';
import { CollectionPage } from '@/components/CollectionPage';
import { allDestinations, packagesForRegion } from '@/lib/catalog';
import { getPackages } from '@/lib/mktours';

export const metadata: Metadata = {
  title: 'South India Tours',
  description:
    'South India group tours with MK Tours — Kerala’s backwaters, the Munnar tea country and the Periyar reserve, on fixed departures from Mumbai.',
};

export default async function SouthIndiaPage() {
  const packages = await getPackages();
  const tours = packagesForRegion(packages, 'South India');
  const destinations = allDestinations(packages).filter((d) => d.region === 'South India');

  return (
    <CollectionPage
      image="/images/dest-munnar.jpg"
      eyebrow="Region"
      title="South India Tours"
      lede="Kochi, the Munnar tea terraces, the spice estates at Thekkady and a night on an Alleppey houseboat — the classic Kerala loop, run as a fixed departure."
      crumbLabel="South India Tour"
      tours={tours}
      destinations={destinations}
      emptyTitle="No South India departure is scheduled right now"
      emptyBody="Our Kerala circuit runs through the cooler months and in the monsoon green. Tell us your dates and we will tell you when the next one leaves, or price it privately."
      notes={[
        {
          title: 'When to go',
          body: 'September to March is the comfortable window. June to September is the monsoon — wetter, far greener, and the time the backwaters are at their fullest.',
        },
        {
          title: 'How long you need',
          body: 'Seven days covers Kochi, Munnar, Thekkady and Alleppey without rushing. Shorter than that and one of the four has to go.',
        },
        {
          title: 'Getting there',
          body: 'Departures travel by train from Mumbai with boarding at Pune. Private groups can fly into Kochi and join the itinerary there.',
        },
      ]}
    />
  );
}
