import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSent(true)
      setTimeout(() => setSent(false), 2500)
    }, 900)
  }

  return (
    <section className="w-full bg-transparent py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 text-center text-3xl font-semibold tracking-tight text-white md:text-4xl"
        >
          Let’s talk about your idea
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="rounded-xl border border-border/50 bg-background/30 p-6 backdrop-blur supports-[backdrop-filter]:bg-background/20"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" placeholder="you@example.com" required />
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="Tell me a little about your project..." required />
          </div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button type="submit" disabled={submitting} className="transition-transform hover:-translate-y-0.5">
              {submitting ? "Sending..." : "Send message"}
            </Button>
            <motion.span
              role="status"
              initial={false}
              animate={{ opacity: sent ? 1 : 0, y: sent ? 0 : 4, scale: sent ? 1 : 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-sm text-green-500"
            >
              Message sent!
            </motion.span>
          </div>
        </motion.form>
      </div>
    </section>
  )
}


