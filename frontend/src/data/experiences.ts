import { u } from '../lib/lib'

export interface Experience {
  id: string
  name: string
  hotel: string
  duration: string
  price: number
  desc: string
  image: string
}

export const experiences: Experience[] = [
  {
    id: 'heritage-walks',
    name: 'Heritage Walks',
    hotel: 'JAIPUR',
    duration: '3 HOURS',
    price: 4500,
    desc: 'The old city before the shops open — havelis, stepwells, and the smell of first chai, with our resident historian.',
    image: u('photo-1598091383021-15ddea10925d', 1400),
  },
  {
    id: 'cooking-masterclass',
    name: 'Cooking Masterclass',
    hotel: 'JAIPUR',
    duration: '4 HOURS',
    price: 8500,
    desc: 'Laal maas and ker sangri from the palace kitchens — market to kadhai with our executive chef.',
    image: u('photo-1556910103-1c02745aae4d', 1400),
  },
  {
    id: 'sunset-boat',
    name: 'Sunset Boat Ride',
    hotel: 'UDAIPUR',
    duration: '2 HOURS',
    price: 6000,
    desc: 'A restored wooden launch, jasmine on the water, and the city palace turning amber ghat by ghat.',
    image: u('photo-1476514525535-07fb3b4ae5f1', 1400),
  },
  {
    id: 'royal-astrology',
    name: 'Royal Astrology',
    hotel: 'JAIPUR',
    duration: '90 MINUTES',
    price: 7500,
    desc: 'A private chart reading with the court astrologer\u2019s seventh-generation successor, under the observatory dome.',
    image: u('photo-1419242902214-272b3f66ee7a', 1400),
  },
  {
    id: 'artisan-workshop',
    name: 'Artisan Workshop',
    hotel: 'DELHI',
    duration: '3 HOURS',
    price: 5500,
    desc: 'Blue pottery, miniature painting or block print — a working morning in a master craftsman\u2019s studio.',
    image: u('photo-1493106641515-6b5631de4bb9', 1400),
  },
  {
    id: 'forest-yoga',
    name: 'Forest Yoga',
    hotel: 'SHIMLA',
    duration: '75 MINUTES',
    price: 3200,
    desc: 'Sun salutations on a cedar deck at 2,400 metres, while the valley below burns off its fog.',
    image: u('photo-1544367567-0f2fcb009e0b', 1400),
  },
  {
    id: 'royal-dining',
    name: 'Royal Dining',
    hotel: 'UDAIPUR',
    duration: 'EVENING',
    price: 18000,
    desc: 'Seven courses on the lake terrace — recipes from the Mewar court kitchens, served as the ghat lights come on.',
    image: u('photo-1414235077428-338989a2e8c0', 1400),
  },
  {
    id: 'cliff-swim',
    name: 'Cliff Swim & Coves',
    hotel: 'GOA',
    duration: 'HALF DAY',
    price: 5000,
    desc: 'A guided swim through three private coves, ending with grilled catch and cold toddy on the sand.',
    image: u('photo-1512343879784-a960bf40e7f2', 1400),
  },
]
