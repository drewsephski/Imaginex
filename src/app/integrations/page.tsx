import { PageLayout } from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const categories = [
  'All',
  'Design',
  'Development',
  'Marketing',
  'Productivity',
  'Social Media'
];

const integrations = [
  {
    id: 'figma',
    name: 'Figma',
    description: 'Generate and edit images directly in Figma with AI',
    category: 'Design',
    status: 'Live',
    features: [
      'Generate images from text prompts',
      'Edit existing designs with AI',
      'One-click export',
      'Real-time preview'
    ],
    logo: '/integrations/figma.svg'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Generate and share AI images directly in your Slack workspace',
    category: 'Productivity',
    status: 'Live',
    features: [
      '/imagine command',
      'Team collaboration',
      'Direct message support',
      'Slack notifications'
    ],
    logo: '/integrations/slack.svg'
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    description: 'Add AI-generated images to your WordPress site with a simple plugin',
    category: 'Development',
    status: 'Beta',
    features: [
      'Media library integration',
      'Custom post types support',
      'Bulk generation',
      'SEO optimization'
    ],
    logo: '/integrations/wordpress.svg'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Create product images and marketing materials for your store',
    category: 'E-commerce',
    status: 'Coming Soon',
    features: [
      'Product image generation',
      'Banner creation',
      'Social media assets',
      'Bulk processing'
    ],
    logo: '/integrations/shopify.svg',
    comingSoon: true
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect ImagineX with 5,000+ apps through Zapier',
    category: 'Productivity',
    status: 'Live',
    features: [
      'Automated workflows',
      'Multi-step Zaps',
      'Custom triggers & actions',
      'No code required'
    ],
    logo: '/integrations/zapier.svg'
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Generate AI images directly in your Discord server',
    category: 'Social',
    status: 'Live',
    features: [
      '/imagine command',
      'Server-wide settings',
      'Role-based access',
      'Custom presets'
    ],
    logo: '/integrations/discord.svg'
  }
];

export default function IntegrationsPage() {
  return (
    <PageLayout
      title="Integrations"
      description="Connect ImagineX with your favorite tools and platforms"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className={`rounded-full ${
                  category === 'All' ? 'bg-primary/10 border-primary' : ''
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                        <span className="text-lg font-medium">
                          {integration.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{integration.name}</h3>
                        <Badge
                          variant="outline"
                          className={`mt-1 ${
                            integration.status === 'Live'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : integration.status === 'Beta'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}
                        >
                          {integration.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {integration.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {integration.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {integration.category}
                    </span>
                    {integration.status === 'Coming Soon' ? (
                      <Button variant="outline" disabled>
                        Coming Soon
                      </Button>
                    ) : (
                      <Button>Connect</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-8 rounded-lg border text-center">
          <h3 className="text-2xl font-bold mb-4">Don't see your favorite tool?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're constantly adding new integrations. Let us know which one you'd like to see next!
          </p>
          <Button variant="outline">Request Integration</Button>
        </div>
      </div>
    </PageLayout>
  );
}
