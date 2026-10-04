import type { Metadata } from 'next';
import { CollectionPage } from '@/components/CollectionPage';
import { allDestinations, packagesForRegion } from '@/lib/catalog';
import { getPackages } from '@/lib/mktours';

export const metadata: Metadata = {
  title: 'North India Tours',
  description:
    'North India group tours with MK Tours — Vrindavan and Mathura, Varanasi and Ayodhya, Amritsar, Kashmir and Royal Rajasthan, on fixed departures from Mumbai.',
};

export default async function NorthIndiaPage() {
  const packages = await getPackages();
  const regional = [
    ...packagesForRegion(packages, 'North India'),
    ...packagesForRegion(packages, 'Himalayas'),
    ...packagesForRegion(packages, 'East India'),
  ];
  const tours = regional.filter((p, i) => regional.findIndex((q) => q.id === p.id) === i);
  const destinations = allDestinations(packages).filter(
    (d) => d.region === 'North India' || d.region === 'Himalayas' || d.region === 'East India',
  );

  return (
    <CollectionPage
      image="/images/hero-taj.jpg"
      eyebrow="Region"
      title="North India Tours"
      lede="The temple towns of the Ganga plain, the forts of Rajasthan, the Golden Temple at Amritsar and the three valleys of Kashmir — all on group departures by train from Mumbai."
      crumbLabel="North India Tour"
      tours={tours}
      destinations={destinations}
      emptyTitle="No North India departure is listed right now"
      emptyBody="Our northern circuits run through most of the year. Tell us where you want to go and when, and we will send you the next departure date or a private quotation."
      notes={[
        {
          title: 'When to go',
          body: 'October to March suits Rajasthan, Varanasi and the temple circuits. Kashmir is at its best from April to October, and Vaishno Devi is walkable year-round.',
        },
        {
          title: 'Pilgrimage routes',
          body: 'Vrindavan and Mathura, Ayodhya–Kashi–Gaya–Baidyanath, and Amritsar with Vaishno Devi and Shivkhori all run as dedicated fixed departures.',
        },
        {
          title: 'What is covered',
          body: 'Train both ways, hotels on twin or triple sharing, meals during the stay, local transport and the sightseeing in the itinerary — in one price.',
        },
      ]}
    />
  );
}
