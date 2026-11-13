// client/src/pages/public/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ScanLine,
  Sparkles,
  FlaskConical,
  Droplets,
  CloudSun,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Crop Recommendation',
      desc: 'Matches your specific soil pH, NPK chemistry, and seasonal monsoon patterns with optimal high-yielding crop varieties.',
    },
    {
      icon: ScanLine,
      title: 'Multimodal Disease Lab',
      desc: 'Instant visual pathology from leaf and fruit photos, providing severity ratings and organic IPM remedies.',
    },
    {
      icon: FlaskConical,
      title: 'Soil Health Analytics',
      desc: 'Decodes laboratory Soil Health Cards into practical fertilization and organic soil-building protocols.',
    },
    {
      icon: Droplets,
      title: '4R Fertilizer Scheduling',
      desc: 'Precision split application timing for Nitrogen, Phosphorus, and Potassium across key crop growth stages.',
    },
    {
      icon: CloudSun,
      title: 'Agro-Weather Contingency',
      desc: 'Converts severe weather alerts (frost, excessive heat, torrential rain) into immediate on-field protective checklists.',
    },
    {
      icon: Sprout,
      title: 'Interactive Cultivation Plans',
      desc: 'Generates day-by-day operational calendars from pre-sowing Rauni to post-harvest grain storage.',
    },
  ];

  const faqs = [
    {
      q: 'How does AgriAssist AI recommend crops?',
      a: 'AgriAssist evaluates your soil taxonomy (pH, available Nitrogen, Phosphorus, Potassium), regional Indian climate zones, target season (Kharif, Rabi, Zaid), and water availability using Google Gemini models grounded in ICAR agricultural package of practices.',
    },
    {
      q: 'Does it replace certified laboratory soil testing?',
      a: 'No. AgriAssist is an educational decision-support tool. It interprets your laboratory soil test data to make it actionable, but strongly encourages routine certified soil testing under the Soil Health Card scheme.',
    },
    {
      q: 'What languages are supported?',
      a: 'AgriAssist is built with India-first localization, supporting Hindi, Marathi, Telugu, and English, with additional regional languages expanding.',
    },
  ];

  return (
    <div className="min-h-screen bg-agri-bg flex flex-col">
      {/* Public Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-900 text-agri-leaf flex items-center justify-center shadow-sm">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-forest-900 tracking-tight">AgriAssist AI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-forest-900 transition"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-950 text-white text-sm font-semibold transition shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/70 border border-forest-200 text-forest-900 text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-agri-green" />
          Next-Generation Agricultural AI for Indian Farmers
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Precision Agronomic Intelligence for Every Acre.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Eliminate agricultural guesswork. Transform soil data, leaf photos, and live weather alerts into verified crop recommendations, instant disease remedies, and 4R nutrient schedules.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-bold text-base transition shadow-md flex items-center justify-center gap-2"
          >
            <span>Launch Advisory Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-semibold text-base transition shadow-sm"
          >
            Explore Live Dashboard
          </Link>
        </div>

        {/* Value Proposition Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto text-left">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-2xl font-black text-forest-900">20+</span>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Indian Crops Supported</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-2xl font-black text-emerald-600">&lt; 3 Sec</span>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Leaf Pathology Diagnosis</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-2xl font-black text-blue-600">4R</span>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Nutrient Stewardship</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-2xl font-black text-amber-600">100%</span>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Farmer Data Privacy (RLS)</p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              End-to-End Digital Agricultural Toolkit
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Combining cutting-edge computer vision with time-tested agronomic science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-agri-green transition shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-forest-900 text-agri-leaf flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{feat.title}</h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How AgriAssist Works</h2>
          <p className="text-sm text-gray-500 mt-2">Four simple steps to data-backed harvest decisions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center">
            <div className="w-8 h-8 rounded-full bg-forest-900 text-white font-bold text-sm mx-auto flex items-center justify-center mb-3">1</div>
            <h4 className="font-bold text-gray-900 text-sm">Add Farm Plot</h4>
            <p className="text-xs text-gray-500 mt-1">Specify district, soil type, and available irrigation.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center">
            <div className="w-8 h-8 rounded-full bg-forest-900 text-white font-bold text-sm mx-auto flex items-center justify-center mb-3">2</div>
            <h4 className="font-bold text-gray-900 text-sm">Input Field Data</h4>
            <p className="text-xs text-gray-500 mt-1">Enter soil test values or snap a photo of diseased leaves.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center">
            <div className="w-8 h-8 rounded-full bg-forest-900 text-white font-bold text-sm mx-auto flex items-center justify-center mb-3">3</div>
            <h4 className="font-bold text-gray-900 text-sm">AI Synthesis</h4>
            <p className="text-xs text-gray-500 mt-1">Gemini models cross-reference verified agricultural packages.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center">
            <div className="w-8 h-8 rounded-full bg-forest-900 text-white font-bold text-sm mx-auto flex items-center justify-center mb-3">4</div>
            <h4 className="font-bold text-gray-900 text-sm">Execute Protocol</h4>
            <p className="text-xs text-gray-500 mt-1">Follow customized timelines, IPM sprays, and fertigation schedules.</p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((f, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-gray-200 bg-gray-50/50">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-agri-green flex-shrink-0" />
                  {f.q}
                </h4>
                <p className="text-xs text-gray-600 mt-2 pl-6 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-950 text-gray-400 py-12 border-t border-forest-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-agri-leaf text-forest-950 flex items-center justify-center font-bold">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">AgriAssist AI</span>
            <span className="text-gray-500 ml-2">© 2026. Scientific crop advisory for sustainable agriculture.</span>
          </div>

          <div className="flex gap-4">
            <Link to="/about" className="hover:text-white transition">About</Link>
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
