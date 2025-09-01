import { PageLayout } from '@/components/page-layout';

export default function AboutPage() {
  return (
    <PageLayout
      title="About ImagineX"
      description="Empowering creators with AI-powered design tools"
    >
      <div className="prose prose-lg max-w-3xl mx-auto">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-lg text-muted-foreground mb-6">
            ImagineX was founded in 2023 with a simple mission: to make professional-quality design accessible to everyone, 
            regardless of their technical skills or design background.
          </p>
          <p className="text-lg text-muted-foreground">
            Our team of AI researchers, designers, and developers work together to create tools that empower creators 
            to bring their ideas to life with unprecedented ease and speed.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Innovation',
                description: 'We push the boundaries of what\'s possible with AI and design.'
              },
              {
                title: 'Accessibility',
                description: 'We believe great design should be available to everyone.'
              },
              {
                title: 'Quality',
                description: 'We don\'t compromise on the quality of our AI models or user experience.'
              },
              {
                title: 'Community',
                description: 'We listen to our users and build tools that solve real problems.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
