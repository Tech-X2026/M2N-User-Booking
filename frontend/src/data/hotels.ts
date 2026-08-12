import { u } from '../lib/lib'

export interface Hotel {
  id: string
  name: string
  city: string
  state: string
  type: string
  rooms: number
  tagline: string
  description: string[]
  hero: string
  card: string
  gallery: string[]
  coords: { lat: number; lng: number }
  address: string
  priceFrom: number
}

export const hotels: Hotel[] = [
  {
    id: 'jaipur',
    name: 'M2N Jaipur Palace',
    city: 'JAIPUR',
    state: 'Rajasthan',
    type: 'HERITAGE',
    rooms: 48,
    tagline: 'A rose-stone palace where Rajput geometry meets quiet modernism.',
    description: [
      'Built around a 230-year-old haveli, M2N Jaipur Palace is a study in proportion — jharokha balconies cast latticed shadows across courtyards of pale sandstone, and every corridor frames a deliberate view of garden, water or sky.',
      'The restoration took six years and over four hundred artisans. Lime plaster was beaten by hand, frescoes were cleaned with neem and milk, and not one original column was moved. The result is a palace that feels less renovated than remembered.',
    ],
    hero: u('photo-1598091383021-15ddea10925d', 2200),
    card: u('photo-1564501049412-61c2a3083791', 1200),
    gallery: [
      u('photo-1564501049412-61c2a3083791', 1600),
      u('photo-1522708323590-d24dbb6b0267', 1600),
      u('photo-1542314831-068cd1dbfeeb', 1600),
    ],
    coords: { lat: 26.9124, lng: 75.7873 },
    address: '14, Kalanera Marg, Old City, Jaipur 302002, Rajasthan',
    priceFrom: 45000,
  },
  {
    id: 'goa',
    name: 'M2N Goa Coast House',
    city: 'GOA',
    state: 'Goa',
    type: 'RESORT',
    rooms: 62,
    tagline: 'Laterite walls, coconut groves, and the long mercy of the sea.',
    description: [
      'On a clifftop above a private cove, M2N Goa Coast House spreads its pavilions through a working coconut grove. Laterite stone, polished cement and teak shutters keep the architecture low, deep-shadowed and permanently half outdoors.',
      'Days here are arranged around the tide. Breakfast moves with the sun, the pool warms by noon, and the sea-facing verandah holds the last hour of light like a held breath.',
    ],
    hero: u('photo-1540541338287-41700207dee6', 2200),
    card: u('photo-1512343879784-a960bf40e7f2', 1200),
    gallery: [
      u('photo-1512343879784-a960bf40e7f2', 1600),
      u('photo-1520250497591-112f2f40a3f4', 1600),
      u('photo-1582719508461-905c673771fd', 1600),
    ],
    coords: { lat: 15.2993, lng: 74.124 },
    address: 'Cove Road 7, Assagao Cliffs, North Goa 403519',
    priceFrom: 38000,
  },
  {
    id: 'delhi',
    name: 'M2N Delhi Residency',
    city: 'DELHI',
    state: 'Delhi NCR',
    type: 'URBAN',
    rooms: 54,
    tagline: 'A Lutyens-era mansion recut for the contemporary collector.',
    description: [
      'M2N Delhi Residency occupies a 1931 Lutyens mansion on a two-acre lawn in the leafiest mile of the capital. Behind its colonnade: fifty-four rooms of museum calm, a library bar, and a dining room that has quietly become the city\u2019s hardest table.',
      'The mansion\u2019s original terrazzo staircases, Burma-teak doors and jack-arched ceilings remain untouched. What changed is the light — recut, redirected, and taught to behave.',
    ],
    hero: u('photo-1587474260584-136574528ed5', 2200),
    card: u('photo-1542314831-068cd1dbfeeb', 1200),
    gallery: [
      u('photo-1542314831-068cd1dbfeeb', 1600),
      u('photo-1414235077428-338989a2e8c0', 1600),
      u('photo-1578683010236-d716f9a3f461', 1600),
    ],
    coords: { lat: 28.6129, lng: 77.2295 },
    address: '3, Amrita Shergill Marg, Lutyens Delhi, New Delhi 110003',
    priceFrom: 42000,
  },
  {
    id: 'udaipur',
    name: 'M2N Udaipur Lake House',
    city: 'UDAIPUR',
    state: 'Rajasthan',
    type: 'PALACE',
    rooms: 38,
    tagline: 'White marble on still water. Nothing else was necessary.',
    description: [
      'M2N Udaipur Lake House stands ankle-deep in Lake Pichola — a white marble pavilion house that seems to float when the evening mist arrives. Its thirty-eight rooms all face the water, because here, the water is everything.',
      'Arrival is by boat, and deliberately slow. The city palace slides past, ghat by ghat, until the lake opens and the house appears — silent, symmetrical, and slightly impossible.',
    ],
    hero: u('photo-1566073771259-6a8506099945', 2200),
    card: u('photo-1501785888041-af3ef285b470', 1200),
    gallery: [
      u('photo-1501785888041-af3ef285b470', 1600),
      u('photo-1566073771259-6a8506099945', 1600),
      u('photo-1476514525535-07fb3b4ae5f1', 1600),
    ],
    coords: { lat: 24.5854, lng: 73.7125 },
    address: 'Pichola East Bank, Udaipur 313001, Rajasthan',
    priceFrom: 58000,
  },
  {
    id: 'shimla',
    name: 'M2N Shimla Ridge Lodge',
    city: 'SHIMLA',
    state: 'Himachal Pradesh',
    type: 'LODGE',
    rooms: 35,
    tagline: 'Deodar timber, winter light, and the long Himalayan edge.',
    description: [
      'At 2,400 metres on the Mashobra ridge, M2N Shimla Ridge Lodge is a deodar-and-stone lodge built for weather. Deep eaves, double hearths, and windows proportioned to hold whole ridgelines like paintings.',
      'When it snows, the lodge does not close — it quiets. Fires are lit at 4pm, the kitchens move to slow braises, and the cedar forest does the rest.',
    ],
    hero: u('photo-1506905925346-21bda4d32df4', 2200),
    card: u('photo-1445019980597-93fa8acb246c', 1200),
    gallery: [
      u('photo-1445019980597-93fa8acb246c', 1600),
      u('photo-1506905925346-21bda4d32df4', 1600),
      u('photo-1441974231531-c6227db76b6e', 1600),
    ],
    coords: { lat: 31.1048, lng: 77.1734 },
    address: 'Mashobra Ridge, Shimla 171007, Himachal Pradesh',
    priceFrom: 32000,
  },
]
