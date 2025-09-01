import { PageLayout } from '@/components/page-layout';
import { Card, CardContent } from '@/components/ui/card';

const templates = [
  {
    id: 'social-media',
    name: 'Social Media Posts',
    description: 'Eye-catching designs for all your social media platforms',
    category: 'Marketing',
    preview: '/templates/social-preview.jpg',
  },
  {
    id: 'presentation',
    name: 'Presentation Decks',
    description: 'Professional slides for business and educational use',
    category: 'Business',
    preview: '/templates/presentation-preview.jpg',
  },
  {
    id: 'print',
    name: 'Print Materials',
    description: 'Flyers, brochures, and other printable designs',
    category: 'Marketing',
    preview: '/templates/print-preview.jpg',
  },
  {
    id: 'web',
    name: 'Web Banners',
    description: 'Responsive designs for websites and online ads',
    category: 'Web',
    preview: '/templates/web-preview.jpg',
  },
];

export default function TemplatesPage() {
  return (
    <PageLayout
      title="Design Templates"
      description="Choose from our collection of professionally designed templates"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden group">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted-foreground/50 text-sm">
                    {template.name} Preview
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{template.name}</h3>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{template.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-primary font-medium">
                    View Templates →
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
