import { PageLayout } from '@/components/page-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const aiModels = [
  {
    id: 'flux',
    name: 'Flux',
    description: 'High-quality image generation with fine-tuned control',
    category: 'Image Generation',
    bestFor: 'Detailed, photorealistic images',
    credits: 5,
    features: [
      '4K resolution output',
      'Photorealistic results',
      'Fine-tuned controls',
      'Fast generation'
    ]
  },
  {
    id: 'nano-banana',
    name: 'Nano Banana',
    description: 'Fast and efficient model for quick iterations',
    category: 'Image Editing',
    bestFor: 'Quick edits and variations',
    credits: 2,
    features: [
      'Rapid generation',
      'Good for iterations',
      'Lower resolution',
      'Cost-effective'
    ]
  },
  {
    id: 'dreamshaper',
    name: 'Dreamshaper',
    description: 'Creative and artistic image generation',
    category: 'Artistic',
    bestFor: 'Concept art and illustrations',
    credits: 4,
    features: [
      'Artistic styles',
      'Creative variations',
      'High detail',
      'Supports art styles'
    ]
  },
];

export default function AIModelsPage() {
  return (
    <PageLayout
      title="AI Models"
      description="Choose the perfect AI model for your creative needs"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {aiModels.map((model) => (
          <div key={model.id} className="border rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold">{model.name}</h3>
                    <Badge variant="secondary">{model.category}</Badge>
                  </div>
                  <p className="text-muted-foreground mt-2">{model.description}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">Best for:</span> {model.bestFor}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{model.credits}</span>
                  <span className="text-muted-foreground">credits / image</span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">Features</h4>
                  <ul className="space-y-2">
                    {model.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-end justify-end">
                  <Button>Generate with {model.name}</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
