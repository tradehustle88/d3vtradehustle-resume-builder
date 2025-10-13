'use client';

import SimpleAIAssistant from '@/components/SimpleAIAssistant';

/**
 * Simple AI Demo Page - Drop this in app/ai-demo/page.tsx
 * Shows the standalone AI assistant component in action
 */
export default function AIDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001a33] via-[#002a43] to-[#001a33] p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center mb-4">
            <div className="w-4 h-4 bg-[#8b0000] rotate-45 mr-4"></div>
            <h1 className="text-5xl font-bold text-[#ffd700] font-anton">
              AI RESUME ASSISTANT
            </h1>
            <div className="w-4 h-4 bg-[#8b0000] rotate-45 ml-4"></div>
          </div>
          
          <p className="text-xl text-white mb-2">
            Powered by Google's Advanced AI Technology
          </p>
          <p className="text-gray-300">
            Get professional resume content tailored for skilled trades
          </p>
        </div>

        {/* Main AI Assistant */}
        <div className="mb-8">
          <SimpleAIAssistant />
        </div>

        {/* Example Prompts */}
        <div className="bg-white rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-[#001a33] mb-6 text-center">
            🎯 Try These Example Prompts
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold text-[#001a33] flex items-center">
                <span className="w-3 h-3 bg-[#8b0000] rotate-45 mr-2"></span>
                Professional Summaries
              </h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                  "Master electrician with 15 years experience in commercial and residential projects, OSHA certified"
                </div>
                <div className="p-3 bg-gray-50 rounded border-l-4 border-green-500">
                  "Experienced plumber specializing in new construction and emergency repairs, licensed in 3 states"
                </div>
                <div className="p-3 bg-gray-50 rounded border-l-4 border-purple-500">
                  "Certified welder with expertise in structural steel, pipeline, and underwater welding"
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-[#001a33] flex items-center">
                <span className="w-3 h-3 bg-[#8b0000] rotate-45 mr-2"></span>
                Specific Sections
              </h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-gray-50 rounded border-l-4 border-orange-500">
                  "Write work experience for a construction foreman who managed crews of 15+ workers"
                </div>
                <div className="p-3 bg-gray-50 rounded border-l-4 border-red-500">
                  "List key skills for an HVAC technician with commercial and residential experience"
                </div>
                <div className="p-3 bg-gray-50 rounded border-l-4 border-indigo-500">
                  "Create achievements section for a safety coordinator with zero-incident record"
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="mt-8 bg-[#001a33] text-white rounded-xl p-6 border-2 border-[#ffd700]">
          <h2 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center">
            <span className="mr-2">🚀</span>
            Ready to Integrate?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-bold text-[#ffd700] mb-2">Drop into any page:</h3>
              <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
{`import SimpleAIAssistant from '@/components/SimpleAIAssistant';

export default function MyPage() {
  return (
    <div>
      <SimpleAIAssistant />
    </div>
  );
}`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-bold text-[#ffd700] mb-2">Or use inline helper:</h3>
              <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
{`import { CompactAIAssistant } from '@/components/SimpleAIAssistant';

<CompactAIAssistant 
  onResult={(text) => setMyField(text)}
  placeholder="Describe your experience..."
/>`}
              </pre>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-[#8b0000] bg-opacity-20 rounded border border-[#8b0000]">
            <p className="text-sm text-red-200">
              <strong>Note:</strong> For production use, make sure to add Firebase Authentication to the API calls.
              The AI assistant requires users to be signed in to prevent abuse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}