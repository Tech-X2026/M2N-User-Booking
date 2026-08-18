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

      {/* HEADER */}
      <div className="pb-16 pt-32 px-6 max-w-[1280px] mx-auto text-center border-b border-border">
        <p className="text-m2n-saffron font-bold tracking-[2px] text-[11px] mb-3 uppercase flex justify-center items-center gap-2">
          <RiBookOpenLine size={16} /> Essays from the Houses
        </p>
        <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-m2n-ink font-bold leading-tight">
          JOUR<span className="italic font-medium text-m2n-saffron">nal</span>
        </h1>
      </div>

      {/* FEATURED ARTICLE */}
      <article className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="rounded-xl overflow-hidden border border-border shadow-sm mb-12 relative">
          <ImageReveal
            src={u('photo-1598091383021-15ddea10925d', 2200)}
            alt="Featured essay"
            direction="bottom"
            className="h-[50vh] md:h-[60vh] w-full"
            viewCursor
          />
        </div>

        <div className="max-w-[800px] mx-auto">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border pb-4 mb-8">
            <span className="text-[10px] font-bold text-m2n-emerald uppercase tracking-wider">Field Notes</span>
            <span className="text-[10px] font-bold text-text-3 uppercase tracking-wider">Dec 04, 2025</span>
            <span className="text-[10px] font-bold text-text-3 uppercase tracking-wider">9 min read</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-m2n-ink font-bold leading-tight mb-12">
            The City That Opens at Five — <br className="hidden md:block" /><span className="italic font-medium text-m2n-saffron">a walk before Jaipur wakes</span>
          </h2>

          <div className="prose prose-sm md:prose-base prose-p:text-text-2 prose-p:leading-relaxed max-w-none">
            <p className="first-letter:text-6xl first-letter:font-display first-letter:text-m2n-ink first-letter:float-left first-letter:mr-4 first-letter:mt-2">
              At five in the morning the old city belongs to the milk sellers and the pigeons.
              The roller shutters are still down on Johari Bazaar, the sweet shops are only just
              lighting their kadhais, and the pink of the facades is not yet pink — it is grey,
              bluish, undecided, waiting for the sun to make its mind up for it. Our heritage
              walks begin at this hour for one reason: the city you meet before six is the city
              the buildings were designed for.
            </p>
            <p className="mt-6">
              A haveli is a machine for shade. Every proportion in the old quarters — the depth
              of the jharokhas, the angle of the chhajjas, the placement of the inner chowk — was
              calculated three centuries before air-conditioning to keep the interior eight
              degrees cooler than the street. You feel this most honestly at dawn, when the
              courtyards have spent the night exhaling and the stone is at its coldest. Our
              resident historian, Devyani, insists guests walk barefoot through at least one
              chowk. It is not ceremony. It is measurement.
            </p>
            <p className="mt-6">
              The walk ends as it always ends: at the stepwell behind the temple on Kishanpole,
              with the first chai of the day poured from a height to cool it. The shops are
              opening now, the scooters have started, and the city is becoming the one the
              guidebooks know. But you were here first. You saw it undecided. That hour, more
              than any room we could sell you, is the reason to come.
            </p>
            <p className="text-[11px] font-bold text-text-3 uppercase tracking-widest mt-8">
              — Devyani S., Resident Historian, M2N Jaipur Palace
            </p>
          </div>
        </div>
      </article>

      {/* ARTICLE GRID */}
      <section className="bg-bg-soft border-t border-border py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-12">
            <p className="text-[11px] font-bold text-m2n-saffron uppercase tracking-widest mb-2">The Archive</p>
            <h2 className="font-display text-4xl text-m2n-ink font-bold">
              Earlier <span className="italic font-medium text-m2n-saffron">entries.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARTICLES.map((a) => (
              <article key={a.title} className="bg-white border border-border rounded-xl overflow-hidden group hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
                <div className="h-[240px] overflow-hidden border-b border-border" data-cursor="view">
                  <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-m2n-emerald uppercase tracking-wider bg-m2n-emerald/10 px-2 py-1 rounded">{a.tag}</span>
                    <span className="text-[10px] font-bold text-text-3 uppercase tracking-wider">{a.date}</span>
                  </div>
                  <h3 className="font-display text-2xl text-m2n-ink font-bold leading-tight mb-3 group-hover:text-m2n-saffron transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-sm text-text-2 leading-relaxed mb-6 flex-1">
                    {a.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-m2n-ink uppercase tracking-wider group-hover:text-m2n-saffron transition-colors">
                    Read Essay <RiArrowRightLine size={16} />
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
