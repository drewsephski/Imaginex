import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface ProjectItem {
  title: string
  description: string
  tags: string[]
  link: string
  rank: number
  image: string
  stack: string[]
}

const PROJECTS: ProjectItem[] = [
  {
    title: "Hyper AI",
    description:
      "An AI‑powered web app delivering quick, intuitive flows and a seamless UX for everyday tasks and workflows.",
    tags: ["UI", "Components", "Library"],
    link: "https://hyper-ai.netlify.app",
    rank: 8,
    image: "/hyper.png",
    stack: ["React", "TypeScript", "Tailwind CSS", "Shadcn"],
  },
  {
    title: "Easy UI",
    description:
      "A refined UI component system with polished patterns and ready-to-ship elements for crafting premium interfaces, fast.",
    tags: ["AI", "Web App", "Automation"],
    link: "https://ez-ui.netlify.app",
    rank: 9,
    image: "/ez-ui.png",
    stack: ["React", "TypeScript", "Tailwind CSS", "Motion"],
  },
  {
    title: "UFC Predict",
    description:
      "An ML‑assisted predictor for UFC matchups using curated features and lightweight modeling for smart insights.",
    tags: ["AI", "Predictive", "Sports"],
    link: "https://ufc-predict.netlify.app",
    rank: 8,
    image: "/ufc.png",
    stack: ["React", "TypeScript", "Tailwind CSS", "Zustand"],
  },
  {
    title: "Linkify",
    description:
      "An agentic blog generator that researches, drafts, and styles long‑form posts—then publishes with a single click.",
    tags: ["AI", "Agents", "Content"],
    link: "https://linkify.wiki",
    rank: 7,
    image: "/linkify.png",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
  },
  {
    title: "Physician AI",
    description:
      "Analytics for clinicians powered by AI—surface trends, augment decisions, and present insights with clarity.",
    tags: ["AI", "Healthcare", "Analytics"],
    link: "https://physicianai.netlify.app",
    rank: 8,
    image: "/physician.png",
    stack: ["React", "TypeScript", "Clerk", "Supabase"],
  },
  {
    title: "Open UI",
    description:
      "A boilerplate showcasing Shadcn-driven UI, patterns, and clean, production-ready components.",
    tags: ["Boilerplate", "UI", "Design"],
    link: "https://ez-ai.netlify.app",
    rank: 7,
    image: "/open.png",
    stack: ["React", "TypeScript", "Tailwind CSS", "Radix UI"],
  },
]

export function Projects() {
  return (
    <section className="w-full bg-transparent py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 text-center text-3xl font-semibold tracking-tight text-white md:text-4xl"
        >
          Featured Projects
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, idx) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Card className="group relative h-full overflow-hidden border-border/50 bg-background/30 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] backdrop-blur supports-[backdrop-filter]:bg-background/20">
                <CardContent className="flex h-full flex-col p-0">
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="aspect-[16/9] w-full overflow-hidden"
                    >
                      <img
                        src={p.image}
                        alt={`${p.title} hero screenshot`}
                        className="size-full object-cover"
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </motion.div>
                    <motion.div
                      aria-hidden
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="pointer-events-none absolute -inset-1 rounded-xl bg-[radial-gradient(200px_120px_at_var(--x,50%)_0%,hsl(var(--primary)/0.25),transparent_70%)] opacity-0 transition-opacity duration-300"
                    />
                  </div>
                  <div className="flex grow flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white/95">
                      {p.title}
                    </h3>
                      <motion.span
                        whileHover={{ y: -2 }}
                        className="rounded-full border border-border/60 bg-background/50 px-2 py-0.5 text-xs text-muted-foreground"
                      >
                      {p.rank}/10
                      </motion.span>
                  </div>
                    <p className="mt-2 min-h-16 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {p.stack.map((s, i) => (
                        <motion.span
                          key={s}
                          initial={{ opacity: 0, y: 6 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 * i }}
                          whileHover={{ scale: 1.04 }}
                          className="rounded-md border border-border/60 bg-background/50 px-2 py-0.5 text-[11px] text-muted-foreground transition-colors group-hover:border-border group-hover:text-foreground"
                        >
                          {s}
                        </motion.span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.map((t, i) => (
                        <motion.span
                          key={t}
                          initial={{ opacity: 0, y: 6 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, ease: "easeOut", delay: 0.06 * i }}
                          whileHover={{ scale: 1.04 }}
                          className="rounded-full border border-border/60 bg-background/50 px-2 py-1 text-xs text-muted-foreground transition-colors group-hover:border-border group-hover:text-foreground"
                        >
                          {t}
                        </motion.span>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between pt-1">
                      <Button asChild variant="outline" size="sm" className="transition-transform group-hover:-translate-y-0.5">
                        <motion.a href={p.link} target="_blank" rel="noreferrer" whileHover={{ x: 1 }}>
                          Open app
                          <motion.span aria-hidden className="inline-flex" initial={{ x: 0 }} whileHover={{ x: 2 }}>
                            <ExternalLink className="size-4" />
                          </motion.span>
                        </motion.a>
                      </Button>
                    <motion.div
                      aria-hidden
                      initial={{ opacity: 0, x: 8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                      className="hidden h-2 w-2 rounded-full bg-primary group-hover:scale-125 md:block"
                    />
                  </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


