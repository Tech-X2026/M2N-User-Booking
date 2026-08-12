import { Helmet } from 'react-helmet-async'
import { RiArrowRightLine, RiBookOpenLine } from 'react-icons/ri'
import ImageReveal from '../components/ImageReveal'
import { u } from '../lib/lib'

const ARTICLES = [
  {
    tag: 'ARCHITECTURE',
    title: 'Why We Never Plaster Twice',
    excerpt: 'Lime takes three winters to speak. On patience, porosity, and the walls of the first haveli.',
    date: 'NOV 12, 2025',
    image: u('photo-1564501049412-61c2a3083791', 1000),
  },
  {
    tag: 'KITCHEN',
    title: 'The Six-Hour Laal Maas',
    excerpt: 'A recipe found folded inside a 1926 liquor ledger — and the argument it started in our kitchens.',
    date: 'OCT 28, 2025',
    image: u('photo-1585937421612-70a008356fbe', 1000),
  },
  {
    tag: 'FIELD NOTES',
    title: 'Surveying the Dak Bungalow',
    excerpt: 'Our newest rescue has not received a guest since 1948. Its visitors\u2019 book disagrees with the silence.',
    date: 'OCT 03, 2025',
    image: u('photo-1441974231531-c6227db76b6e', 1000),
  },
  {
    tag: 'CRAFT',
    title: 'The Guild Moves to Udaipur',
    excerpt: 'Sixty-two masons, one lake, and a marble terrace that must learn to float by March.',
    date: 'SEP 17, 2025',
    image: u('photo-1493106641515-6b5631de4bb9', 1000),
  },
  {
    tag: 'WELLNESS',
    title: 'An Hour With Nothing In It',
    excerpt: 'What the Shirodhara room teaches about darkness, temperature, and the price of quiet.',
    date: 'SEP 01, 2025',
    image: u('photo-1544161515-4ab6ce6db874', 1000),
  },
  {
    tag: 'SEASONS',
    title: 'First Snow at the Lodge',
    excerpt: 'Fires at four, slow braises at six — the Ridge\u2019s winter charter, annotated by its keeper.',
    date: 'AUG 22, 2025',
    image: u('photo-1445019980597-93fa8acb246c', 1000),
  },
]

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Journal — M2N Group of Hotels</title>
        <meta name="description" content="Essays from the houses — architecture, kitchen, craft, wellness and seasons at M2N." />
      </Helmet>

      {/* HERO */}
      <section className="overflow-hidden pb-16 pt-40 md:pt-48">
        <div className="editorial-grid">
          <p className="u-label col-span-12 flex items-center gap-3 text-terracotta">
            <RiBookOpenLine size={16} /> Essays from the Houses
          </p>
          <h1 className="t-hero col-span-12 mt-6 whitespace-nowrap text-[clamp(4rem,15vw,13rem)] leading-[0.85]">
            JOUR<em className="font-normal italic">nal</em>
          </h1>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      <article className="pb-16 pt-8 md:pb-24">
        <div className="editorial-grid">
          <div className="col-span-12">
            <ImageReveal
              src={u('photo-1598091383021-15ddea10925d', 2200)}
              alt="Featured essay"
              direction="bottom"
              className="h-[60svh]"
              viewCursor
            />
          </div>

          <div className="col-span-12 mt-14 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-line pb-6">
              <span className="u-label text-sage">Field Notes</span>
              <span className="u-label-sm text-warm">Dec 04, 2025</span>
              <span className="u-label-sm text-warm">9 min read</span>
            </div>
            <h2 className="t-section mt-12 text-[clamp(2.2rem,4.5vw,4.2rem)] leading-[1.05]">
              The City That Opens at Five — <em className="font-normal italic text-terracotta">a walk before Jaipur wakes</em>
            </h2>
          </div>

          <div className="col-span-12 mt-12 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3">
            <div className="gap-10 text-[0.95rem] font-light leading-[1.85] text-muted md:columns-2">
              <p className="drop-cap mb-6">
                At five in the morning the old city belongs to the milk sellers and the pigeons.
                The roller shutters are still down on Johari Bazaar, the sweet shops are only just
                lighting their kadhais, and the pink of the facades is not yet pink — it is grey,
                bluish, undecided, waiting for the sun to make its mind up for it. Our heritage
                walks begin at this hour for one reason: the city you meet before six is the city
                the buildings were designed for.
              </p>
              <p className="mb-6">
                A haveli is a machine for shade. Every proportion in the old quarters — the depth
                of the jharokhas, the angle of the chhajjas, the placement of the inner chowk — was
                calculated three centuries before air-conditioning to keep the interior eight
                degrees cooler than the street. You feel this most honestly at dawn, when the
                courtyards have spent the night exhaling and the stone is at its coldest. Our
                resident historian, Devyani, insists guests walk barefoot through at least one
                chowk. It is not ceremony. It is measurement.
              </p>
              <p className="mb-6">
                The walk ends as it always ends: at the stepwell behind the temple on Kishanpole,
                with the first chai of the day poured from a height to cool it. The shops are
                opening now, the scooters have started, and the city is becoming the one the
                guidebooks know. But you were here first. You saw it undecided. That hour, more
                than any room we could sell you, is the reason to come.
              </p>
              <p className="u-label-sm mt-2 text-warm">— Devyani S., Resident Historian, M2N Jaipur Palace</p>
            </div>
          </div>
        </div>
      </article>

      {/* ARTICLE GRID */}
      <section className="border-t border-line py-16 md:py-24">
        <div className="editorial-grid">
          <p className="u-label col-span-12 text-terracotta md:col-span-3">The Archive</p>
          <h2 className="t-section col-span-12 mt-2 text-[clamp(2.2rem,4.5vw,4rem)] md:col-span-6">
            Earlier <em className="font-normal italic">entries.</em>
          </h2>

          <div className="col-span-12 mt-16 grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-3">
            {ARTICLES.map((a) => (
              <article key={a.title} className="group border border-line">
                <div className="img-frame aspect-[3/4]" data-cursor="view">
                  <img src={a.image} alt={a.title} loading="lazy" />
                </div>
                <div className="p-7">
                  <div className="flex items-center justify-between">
                    <span className="u-label-sm text-sage">{a.tag}</span>
                    <span className="u-label-sm text-warm">{a.date}</span>
                  </div>
                  <h3 className="t-section mt-5 text-2xl leading-snug transition-colors duration-400 group-hover:text-terracotta">
                    {a.title}
                  </h3>
                  <p className="mt-4 text-[0.88rem] font-light leading-[1.75] text-muted">{a.excerpt}</p>
                  <span className="u-label link-line mt-6 inline-flex text-ink">
                    Read Essay <RiArrowRightLine size={14} className="text-terracotta" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
