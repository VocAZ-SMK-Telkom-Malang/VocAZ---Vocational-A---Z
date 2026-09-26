import Image from 'next/image'

const partners = [
  {
    name: 'JHIC 2.0',
    logo: '/partners/jhic.png',
    url: 'https://jhic.id',
  },
  {
    name: 'Jagoan Hosting',
    logo: '/partners/jagoan-hosting.png',
    url: 'https://jagoanhosting.com',
  },
  {
    name: 'KOMDIGI',
    logo: '/partners/komdigi.png',
    url: 'https://komdigi.go.id',
  },
  {
    name: 'Garuda Spark',
    logo: '/partners/garuda-spark.png',
    url: '#',
  },
  {
    name: 'Ngalup.co',
    logo: '/partners/ngalup.png',
    url: 'https://ngalup.co',
  },
]

export function PartnersSection() {
  return (
    <section className="w-full bg-[#F7F5F2] py-12">
      <div className="max-w-[1240px] mx-auto px-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-[#78716C] font-bold mb-8">
          DIDUKUNG OLEH
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 items-center justify-items-center">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center p-3 group"
              title={partner.name}
            >
              <div className="relative h-12 w-full max-w-[160px] grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  fill
                  className="object-contain"
                  sizes="160px"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}