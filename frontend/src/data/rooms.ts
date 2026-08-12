import { u } from '../lib/lib'

export interface Room {
  id: string
  name: string
  hotels: string[]
  size: number
  occupancy: number
  price: number
  desc: string
  features: string[]
  image: string
}

export const rooms: Room[] = [
  {
    id: 'heritage-chamber',
    name: 'Heritage Chamber',
    hotels: ['jaipur', 'delhi'],
    size: 52,
    occupancy: 2,
    price: 45000,
    desc: 'Hand-trowelled lime walls, a carved four-poster, and a jharokha window seat built for long mornings. The palace outside, total silence inside.',
    features: ['Jharokha window seat', 'Four-poster king bed', 'Rain shower', 'Courtyard view'],
    image: u('photo-1582719478250-c89cae4dc85b', 1800),
  },
  {
    id: 'courtyard-terrace',
    name: 'Courtyard Terrace',
    hotels: ['jaipur', 'udaipur'],
    size: 68,
    occupancy: 2,
    price: 62000,
    desc: 'A private walled terrace steps down from the bedroom — plunge pool, daybed, and an outdoor rain shower under open sky.',
    features: ['Private plunge pool', 'Outdoor rain shower', 'Teak daybed', 'Butler service'],
    image: u('photo-1590490360182-c33d57733427', 1800),
  },
  {
    id: 'lake-pavilion',
    name: 'Lake Pavilion',
    hotels: ['udaipur', 'goa'],
    size: 74,
    occupancy: 3,
    price: 78000,
    desc: 'Floor-to-ceiling water on three sides. At dawn the lake enters the room; at dusk the room becomes the lake.',
    features: ['Three-sided water view', 'Marble soak tub', 'Boat arrival', 'Private verandah'],
    image: u('photo-1618773928121-c32242e63f39', 1800),
  },
  {
    id: 'ridge-suite',
    name: 'Ridge Suite',
    hotels: ['shimla', 'goa'],
    size: 85,
    occupancy: 3,
    price: 64000,
    desc: 'Deodar panelling, a working stone hearth, and a window seat proportioned to hold an entire Himalayan ridgeline.',
    features: ['Stone fireplace', 'Ridgeline window seat', 'Cedar soaking tub', 'Reading alcove'],
    image: u('photo-1578683010236-d716f9a3f461', 1800),
  },
  {
    id: 'm2n-residence',
    name: 'The M2N Residence',
    hotels: ['delhi', 'jaipur', 'udaipur', 'goa', 'shimla'],
    size: 140,
    occupancy: 4,
    price: 145000,
    desc: 'Two bedrooms, a private dining room, a study, and staff of one\u2019s own. The house keeps only one residence per address; it is rarely the same twice.',
    features: ['Two bedrooms', 'Private dining room', 'Dedicated butler', 'In-residence chef'],
    image: u('photo-1631049307264-da0ec9d70304', 1800),
  },
]
