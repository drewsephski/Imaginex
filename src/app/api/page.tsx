import { PageLayout } from '@/components/page-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function APIPage() {
  const codeExamples = {
    curl: `curl -X POST https://api.imaginex.com/v1/generate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "flux",
    "prompt": "A futuristic city skyline at sunset",
    "width": 1024,
    "height": 1024,
    "num_images": 1
  }'`,
    javascript: `const response = await fetch('https://api.imaginex.com/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'flux',
    prompt: 'A futuristic city skyline at sunset',
    width: 1024,
    height: 1024,
    num_images: 1
  })
});

const data = await response.json();
console.log(data);`,
    python: `import requests

url = "https://api.imaginex.com/v1/generate"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "model": "flux",
    "prompt": "A futuristic city skyline at sunset",
    "width": 1024,
    "height": 1024,
    "num_images": 1
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`
  };

  return (
    <PageLayout
      title="API Documentation"
      description="Integrate our AI image generation into your applications"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        <section className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <p className="text-muted-foreground mb-6">
            Access our powerful AI image generation through a simple REST API. Get started by obtaining your API key from the dashboard.
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Base URL</h3>
              <div className="bg-muted p-4 rounded-md font-mono text-sm">
                https://api.imaginex.com/v1
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Authentication</h3>
              <p className="text-muted-foreground mb-3">
                Include your API key in the Authorization header:
              </p>
              <div className="bg-muted p-4 rounded-md font-mono text-sm">
                Authorization: Bearer YOUR_API_KEY
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold">API Endpoints</h2>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 p-4 border-b">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                  POST
                </Badge>
                <span className="font-mono">/generate</span>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-muted-foreground mb-6">
                Generate images from text prompts using our AI models.
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Request Body</h4>
                  <div className="space-y-4">
                    {[
                      { name: 'model', type: 'string', required: true, description: 'The ID of the model to use (e.g., flux, nano-banana)' },
                      { name: 'prompt', type: 'string', required: true, description: 'Text description of the image to generate' },
                      { name: 'width', type: 'integer', required: false, description: 'Width of the generated image (default: 1024)' },
                      { name: 'height', type: 'integer', required: false, description: 'Height of the generated image (default: 1024)' },
                      { name: 'num_images', type: 'integer', required: false, description: 'Number of images to generate (1-4, default: 1)' },
                      { name: 'negative_prompt', type: 'string', required: false, description: 'Text description of what to avoid in the image' },
                    ].map((param) => (
                      <div key={param.name} className="flex flex-col sm:flex-row gap-2 sm:items-center text-sm">
                        <div className="w-40 flex-shrink-0">
                          <span className="font-mono font-medium">{param.name}</span>
                          <span className="text-muted-foreground ml-2">{param.type}</span>
                          {param.required && <Badge variant="outline" className="ml-2">required</Badge>}
                        </div>
                        <p className="text-muted-foreground">{param.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Example Request</h4>
                  <Tabs defaultValue="curl" className="w-full">
                    <TabsList>
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                    </TabsList>
                    <TabsContent value="curl" className="mt-0">
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                        {codeExamples.curl}
                      </pre>
                    </TabsContent>
                    <TabsContent value="javascript" className="mt-0">
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                        {codeExamples.javascript}
                      </pre>
                    </TabsContent>
                    <TabsContent value="python" className="mt-0">
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                        {codeExamples.python}
                      </pre>
                    </TabsContent>
                  </Tabs>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Response</h4>
                  <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                    {`{
  "id": "gen_1234567890",
  "created": 1620000000,
  "status": "succeeded",
  "images": [
    {
      "url": "https://...",
      "width": 1024,
      "height": 1024
    }
  ]
}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Get Your API Key</h2>
          <p className="text-muted-foreground mb-6">
            Start integrating with our API by generating an API key in your account settings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="api-key" className="sr-only">API Key</Label>
              <Input
                id="api-key"
                readOnly
                value="sk_test_1234567890abcdef1234567890abcdef1234567890abcdef"
                className="font-mono"
              />
            </div>
            <Button variant="outline">Copy</Button>
            <Button>Generate New Key</Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
