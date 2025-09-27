import ApiTestingDashboard from "@/components/ApiTestingDashboard";
import SignupForm from "@/components/SignupForm";

export default function ApiDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔗 API Integration Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Centralized API client for clean frontend → backend communication.
            All Firebase Functions and Next.js API routes are now abstracted 
            into reusable functions.
          </p>
        </div>

        {/* Quick Signup Example */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
            📝 Example: Signup Form
          </h2>
          <SignupForm />
        </div>

        {/* Comprehensive Testing */}
        <div>
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
            🧪 Comprehensive API Testing
          </h2>
          <ApiTestingDashboard />
        </div>
      </div>
    </div>
  );
}