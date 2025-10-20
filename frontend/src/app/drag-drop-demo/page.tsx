"use client";

import { useState } from "react";
import SortableList from "@/components/dnd/SortableList";
import SortableItem from "@/components/dnd/SortableItem";
import "@/components/dnd/dnd.css";

interface DemoItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface WorkExperience {
  id: string;
  position: string;
  company: string;
  duration: string;
}

interface Skill {
  id: string;
  name: string;
  level: string;
}

export default function DragDropShowcase() {
  // Demo Items
  const [demoItems, setDemoItems] = useState<DemoItem[]>([
    {
      id: "demo-1",
      title: "First Item",
      description: "Drag me around! I'm the first item.",
      icon: "🎯",
    },
    {
      id: "demo-2",
      title: "Second Item",
      description: "Try dragging me to a different position.",
      icon: "🚀",
    },
    {
      id: "demo-3",
      title: "Third Item",
      description: "I can be moved too! Reorder as you like.",
      icon: "⭐",
    },
    {
      id: "demo-4",
      title: "Fourth Item",
      description: "Smooth animations make this feel great.",
      icon: "💎",
    },
  ]);

  // Work Experience Example
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([
    {
      id: "exp-1",
      position: "Senior HVAC Technician",
      company: "ABC Heating & Cooling",
      duration: "2020 - Present",
    },
    {
      id: "exp-2",
      position: "HVAC Technician",
      company: "XYZ Climate Solutions",
      duration: "2018 - 2020",
    },
    {
      id: "exp-3",
      position: "HVAC Apprentice",
      company: "Tech Institute",
      duration: "2016 - 2018",
    },
  ]);

  // Skills Example
  const [skills, setSkills] = useState<Skill[]>([
    { id: "skill-1", name: "HVAC System Installation", level: "Expert" },
    { id: "skill-2", name: "Refrigeration Systems", level: "Advanced" },
    { id: "skill-3", name: "Troubleshooting & Repair", level: "Expert" },
    { id: "skill-4", name: "Customer Service", level: "Advanced" },
    { id: "skill-5", name: "Blueprint Reading", level: "Intermediate" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-blue-800/30 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            🎯 Drag & Drop Showcase
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Interactive demonstration of the drag-and-drop functionality powered
            by @dnd-kit. Try dragging items around using the{" "}
            <span className="text-blue-400 font-semibold">⋮⋮</span> handle!
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Features Overview */}
        <section className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/20">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            ✨ Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="🖱️"
              title="Mouse Drag"
              description="Smooth drag-and-drop with visual feedback"
            />
            <FeatureCard
              icon="📱"
              title="Touch Support"
              description="Works perfectly on mobile devices"
            />
            <FeatureCard
              icon="⌨️"
              title="Keyboard Nav"
              description="Tab, Space, Arrow keys support"
            />
            <FeatureCard
              icon="♿"
              title="Accessible"
              description="WCAG 2.1 AA compliant"
            />
            <FeatureCard
              icon="⚡"
              title="Lightweight"
              description="Only 15KB bundle size"
            />
            <FeatureCard
              icon="🎨"
              title="Smooth Animations"
              description="60fps performance"
            />
          </div>
        </section>

        {/* Demo 1: Basic Items */}
        <section className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              🎨 Basic Demo
            </h2>
            <p className="text-gray-400">
              Simple drag-and-drop list. Hover over the{" "}
              <span className="text-blue-400">⋮⋮</span> handle, then drag to
              reorder.
            </p>
          </div>

          <SortableList
            items={demoItems}
            onReorder={setDemoItems}
            getId={(item) => item.id}
          >
            {(item, index) => (
              <SortableItem key={item.id} id={item.id}>
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-white">
                        {item.title}
                      </h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                    <div className="text-sm text-gray-400 font-mono">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              </SortableItem>
            )}
          </SortableList>
        </section>

        {/* Demo 2: Work Experience */}
        <section className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              💼 Work Experience Example
            </h2>
            <p className="text-gray-400">
              Real-world example showing resume work experience. Drag positions
              to reorder chronologically.
            </p>
          </div>

          <SortableList
            items={workExperience}
            onReorder={setWorkExperience}
            getId={(item) => item.id}
          >
            {(exp, index) => (
              <SortableItem key={exp.id} id={exp.id}>
                <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 p-6 rounded-xl border border-gray-600 hover:border-blue-400/50 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {exp.position}
                      </h3>
                      <p className="text-lg text-blue-400">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-400 font-mono bg-gray-800/50 px-3 py-1 rounded-full">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    Position #{index + 1} in your work history
                  </p>
                </div>
              </SortableItem>
            )}
          </SortableList>
        </section>

        {/* Demo 3: Skills */}
        <section className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              🎯 Skills Example
            </h2>
            <p className="text-gray-400">
              Compact list showing skills. Reorder by importance or preference.
            </p>
          </div>

          <SortableList
            items={skills}
            onReorder={setSkills}
            getId={(item) => item.id}
          >
            {(skill, index) => (
              <SortableItem key={skill.id} id={skill.id}>
                <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 p-4 rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {skill.name}
                        </h4>
                        <p className="text-sm text-gray-400">{skill.level}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 font-mono">
                        #{index + 1}
                      </span>
                      <LevelBadge level={skill.level} />
                    </div>
                  </div>
                </div>
              </SortableItem>
            )}
          </SortableList>
        </section>

        {/* Instructions */}
        <section className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/20">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            📖 How to Use
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <InstructionCard
              number="1"
              title="Hover over drag handle"
              description="Move your cursor over the ⋮⋮ icon on the left. Your cursor will change to a 'grab' hand."
            />
            <InstructionCard
              number="2"
              title="Click and drag"
              description="Click and hold the drag handle, then move your mouse. The item will become semi-transparent."
            />
            <InstructionCard
              number="3"
              title="Drop in new position"
              description="Release the mouse button to drop the item. It will smoothly animate to its new position."
            />
            <InstructionCard
              number="4"
              title="Keyboard alternative"
              description="Press Tab to focus, Space to activate, Arrow keys to move, Enter to confirm."
            />
          </div>
        </section>

        {/* Technical Info */}
        <section className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6">🔧 Technical Details</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <TechDetail label="Library" value="@dnd-kit" />
            <TechDetail label="Bundle Size" value="~15KB gzipped" />
            <TechDetail label="Performance" value="60fps animations" />
            <TechDetail label="Browser Support" value="Chrome 90+, Firefox 88+, Safari 14+" />
            <TechDetail label="Mobile Support" value="Touch events supported" />
            <TechDetail label="Accessibility" value="WCAG 2.1 AA compliant" />
          </div>
        </section>

        {/* Code Example */}
        <section className="bg-gray-900/50 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6">💻 Code Example</h2>
          <div className="bg-gray-950 rounded-xl p-6 overflow-x-auto border border-gray-800">
            <pre className="text-sm text-gray-300">
              <code>{`import SortableList from "@/components/dnd/SortableList";
import SortableItem from "@/components/dnd/SortableItem";
import "@/components/dnd/dnd.css";

function MyComponent({ data, onUpdate }) {
  const items = data.map((item, idx) => ({
    ...item,
    id: item.id || \`item-\${idx}-\${Date.now()}\`
  }));

  const handleReorder = (reordered) => {
    onUpdate(reordered);
  };

  return (
    <SortableList
      items={items}
      onReorder={handleReorder}
      getId={(item) => item.id}
    >
      {(item, index) => (
        <SortableItem key={item.id} id={item.id}>
          <div>{item.name}</div>
        </SortableItem>
      )}
    </SortableList>
  );
}`}</code>
            </pre>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Use?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            This drag-and-drop system is already integrated into the resume
            builder. Check out the ExperienceForm and CertificationsForm to see
            it in action!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/builder/experience"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try in Resume Builder
            </a>
            <a
              href="https://github.com/tradehustle88/d3vtradehustle-resume-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-700"
            >
              View on GitHub
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>
            Built with ❤️ using @dnd-kit • Trade Hustle Resume Builder • 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

function InstructionCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function TechDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
      <div className="text-gray-400 text-xs mb-1">{label}</div>
      <div className="text-white font-semibold">{value}</div>
    </div>
  );
}

function LevelBadge({ level }: { level: string }) {
  const colors = {
    Expert: "bg-green-500/20 text-green-400 border-green-500/50",
    Advanced: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    Beginner: "bg-gray-500/20 text-gray-400 border-gray-500/50",
  };

  const color =
    colors[level as keyof typeof colors] || colors.Beginner;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${color}`}
    >
      {level}
    </span>
  );
}
