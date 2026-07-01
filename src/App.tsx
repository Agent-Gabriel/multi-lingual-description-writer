import React, { useState, useEffect } from "react";
import { 
  Copy, 
  Loader2, 
  MapPin, 
  Sparkles, 
  Building2, 
  Check, 
  ArrowRight, 
  Search, 
  Globe, 
  Eye, 
  Layers, 
  RefreshCw, 
  ChevronLeft, 
  HelpCircle,
  TrendingUp,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import rankInMapsSpinning from "./assets/icons/rank-in-maps-spinning.gif";
import speakIcon from "./assets/icons/speak.png";
import phoneScrollingIcon from "./assets/icons/Phone Scrolling.png";
import punchListIcon from "./assets/icons/Punch List.png";
import shopIcon from "./assets/icons/shop.png";
import puzzleSolvingIcon from "./assets/icons/Puzzle Solving.png";
import thailandIcon from "./assets/icons/Thailand.png";
import beachIcon from "./assets/icons/Beach.png";

type ViewState = "landing" | "loading_search" | "setup" | "loading_generate" | "output";

export default function App() {
  const [view, setView] = useState<ViewState>("landing");
  const [searchQuery, setSearchQuery] = useState("");
  
  // App core states
  const [businessName, setBusinessName] = useState("");
  const [bulletPoints, setBulletPoints] = useState("");
  const [coreKeyword, setCoreKeyword] = useState("");
  const [district, setDistrict] = useState("Thonglor, Bangkok");
  const [variations, setVariations] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Interaction states
  const [searching, setSearching] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Animated loading simulation states
  const [progress, setProgress] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState("");

  const suggestedAreas = [
    "Thonglor, Bangkok",
    "Sathorn, Bangkok",
    "Nimman, Chiang Mai",
    "Patong, Phuket",
    "Pattaya",
    "Bophut, Koh Samui"
  ];

  const suggestedFeatures = [
    "free parking",
    "outdoor terrace",
    "English-speaking staff",
    "BTS/MRT close",
    "free Wi-Fi",
    "pet friendly",
    "rooftop seating",
    "halal options",
    "vegetarian-friendly"
  ];

  const injectBulletSuggestion = (suggestion: string) => {
    const lines = bulletPoints
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    
    const formattedSuggestion = `- ${suggestion}`;
    
    const exists = lines.some((line) => {
      const cleanLine = line.replace(/^-\s*/, "").toLowerCase();
      const cleanSuggestion = suggestion.toLowerCase();
      return cleanLine === cleanSuggestion;
    });

    if (!exists) {
      const updatedLines = [...lines, formattedSuggestion];
      setBulletPoints(updatedLines.join("\n") + "\n");
    }
  };

  const presetExamples = [
    { name: "Roots Sathorn", label: "☕ Roots Sathorn (Cafe)" },
    { name: "Peppina Sukhumvit 33", label: "🍕 Peppina (Pizzeria)" },
    { name: "Health Land Pattaya", label: "💆 Health Land (Spa & Wellness)" },
    { name: "Prego Samui", label: "🌴 Prego Resort (Hospitality)" },
    { name: "Surf House Phuket", label: "🏄 Surf House Patong (Activities)" }
  ];

  // Simulated progress loader for generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (view === "loading_generate") {
      setProgress(0);
      setLoadingMsg("Initializing bilingual copywriter agent...");
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 8) + 4;
          if (next >= 100) {
            clearInterval(interval);
            return 100;
          }
          if (next < 20) {
            setLoadingMsg(`Analyzing regional local search patterns for ${district || "Thailand"}...`);
          } else if (next < 45) {
            setLoadingMsg("Crafting high-relevance Central Thai GMF copy...");
          } else if (next < 70) {
            setLoadingMsg("Developing fluent localized English description translation...");
          } else if (next < 88) {
            setLoadingMsg("Injecting vertical breaks to calibrate 'Read more' link placement...");
          } else {
            setLoadingMsg("Validating 750-character search constraints...");
          }
          return next;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [view, district]);

  // Handle maps lookup from landing page search
  const handleLandingSearch = async (queryToSearch: string) => {
    if (!queryToSearch) return;
    setBusinessName(queryToSearch);
    setView("loading_search");
    setError(null);
    try {
      const response = await fetch("/api/search-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryToSearch }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not find business details");
      }
      
      if (data.name) setBusinessName(data.name);
      if (data.district) setDistrict(data.district);
      if (data.coreKeyword) setCoreKeyword(data.coreKeyword);
      if (data.bullets) {
        setBulletPoints(data.bullets.map((b: string) => b.startsWith("-") ? b : `- ${b}`).join("\n"));
      } else {
        setBulletPoints("");
      }
      
      // Go to setup screen so user can review and edit
      setView("setup");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to retrieve details. You can enter them manually below!");
      setView("setup"); // still go to setup so they aren't blocked
    }
  };

  // Perform search from the setup panel / sidebar
  const handleInlineSearch = async () => {
    if (!businessName) return;
    setSearching(true);
    setError(null);
    try {
      const response = await fetch("/api/search-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: businessName }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not find business details");
      }
      if (data.name) setBusinessName(data.name);
      if (data.district) setDistrict(data.district);
      if (data.coreKeyword) setCoreKeyword(data.coreKeyword);
      if (data.bullets) {
        setBulletPoints(data.bullets.map((b: string) => b.startsWith("-") ? b : `- ${b}`).join("\n"));
      }
    } catch (err: any) {
      setError(err.message || "Failed to find business info.");
    } finally {
      setSearching(false);
    }
  };

  // Perform copywriting generation
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulletPoints || !coreKeyword || !district) return;

    setView("loading_generate");
    setError(null);
    setShowUpsell(false);
    setVariations([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, bulletPoints, coreKeyword, district }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate copy");
      }

      setVariations(data.variations || []);
      setActiveTab(0);
      setView("output");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setView("setup");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowUpsell(true);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleReset = () => {
    setView("landing");
    setSearchQuery("");
    setError(null);
  };

  const handleTextChange = (newText: string) => {
    const updated = [...variations];
    updated[activeTab] = newText;
    setVariations(updated);
  };

  const currentVariation = variations[activeTab] || "";
  
  // Real-time programmatic character counters
  const outputParts = currentVariation.split("\n\n");
  const thaiLength = outputParts[0] ? outputParts[0].length : 0;
  const englishLength = outputParts.length > 1 ? outputParts.slice(1).join("\n\n").length : 0;
  const totalOutputLength = currentVariation.length;
  const charPercentage = Math.min(100, (totalOutputLength / 750) * 100);

  // Highlight target core keyword in output
  const renderBoldedText = (text: string, keyword: string) => {
    if (!keyword) return text;
    const parts = text.split(new RegExp("(" + keyword + ")", "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === keyword.toLowerCase() ? (
        <strong key={i} className="font-extrabold text-forest bg-[#FFF1CE] border border-forest/20 px-1.5 py-0.5 rounded-md">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#FAE8CC] paper-grain font-sans text-charcoal flex flex-col relative">
      {/* Premium Navigation Header */}
      <header className="h-16 border-b border-forest/18 bg-[#FAE8CC] flex items-center justify-between px-6 sm:px-10 shrink-0 z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden border border-forest/20 shadow-sm">
            <img 
              src={rankInMapsSpinning} 
              alt="Bilingual GMF Builder Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-display font-semibold tracking-tight text-forest flex items-center gap-2">
              Bilingual GMF Builder <span className="text-[10px] text-forest bg-[#FFF1CE] px-2.5 py-1 rounded-lg border border-forest/12 font-mono font-semibold">THAILAND SEO</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-xs font-mono bg-[#FFF1CE] text-forest/70 px-2.5 py-1 rounded-lg border border-forest/12">
            v2.5-flash-optimized
          </span>
          {view !== "landing" && (
            <button 
              onClick={handleReset}
              className="text-xs font-semibold text-forest hover:bg-forest hover:text-cream border border-forest/30 rounded-lg px-3 py-1.5 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 inline mr-1" />
              New Search
            </button>
          )}
        </div>
      </header>

      {/* Main Content Router */}
      <main className="flex-1 flex flex-col z-10">
        
        {/* VIEW 1: LANDING PAGE */}
        {view === "landing" && (
          <div 
            className="flex-1 flex flex-col relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(185deg, rgba(250, 232, 204, 0.88) 0%, rgba(250, 232, 204, 0.65) 50%, rgba(250, 232, 204, 0.92) 100%), url('/src/assets/images/thailand_local_seo_hero_1782895916184.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Hero Split Layout */}
            <section className="max-w-7xl mx-auto px-6 sm:px-10 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Context & Input */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 bg-[#FFF1CE] border border-forest/18 rounded-lg py-1.5 px-3.5 w-fit">
                  <span className="text-xs">🇹🇭</span>
                  <span className="text-xs font-semibold text-forest uppercase tracking-wider font-display">Thailand Google Maps Optimizer</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-forest leading-tight tracking-tight">
                  Master Thailand's <span className="text-timber">Bilingual Search</span> Indexes
                </h2>
                
                <p className="text-sm sm:text-base text-charcoal/90 leading-relaxed max-w-2xl">
                  Google maintains distinct local databases for English and Thai queries in Thailand. We generate optimized local SEO strings that place critical Thai keywords in front, with calculated line spacing that forces a beautiful, clickable <strong className="text-forest font-semibold">"Read more"</strong> tag exactly before your English content.
                </p>

                {/* Instant Search Box */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-[#FFF1CE] p-2 rounded-xl border border-forest/20 shadow-sm max-w-xl"
                >
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2.5 px-3">
                      <Search className="w-5 h-5 text-forest/50 shrink-0" />
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && searchQuery && handleLandingSearch(searchQuery)}
                        placeholder="Search your business name (e.g. Starbucks Thonglor)..."
                        className="w-full text-sm sm:text-base outline-none bg-transparent placeholder-forest/40 text-forest font-medium"
                      />
                    </div>
                    <button
                      onClick={() => searchQuery && handleLandingSearch(searchQuery)}
                      disabled={!searchQuery}
                      className="bg-forest hover:bg-forest/90 disabled:opacity-50 text-[#FAE8CC] font-bold text-xs sm:text-sm px-5 py-3 rounded-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer animate-in"
                    >
                      Search & Start
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>

                {/* Quick Selection Suggestions */}
                <div className="flex flex-col gap-2.5">
                  <p className="text-xs font-semibold text-forest/70 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-forest" />
                    Or test with popular Thailand venues:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {presetExamples.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleLandingSearch(item.name)}
                        className="text-xs bg-[#F1CFAE]/30 hover:bg-[#F1CFAE]/60 text-forest border border-forest/15 rounded-lg px-3.5 py-2 font-medium transition-all cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setView("setup")}
                      className="text-xs bg-[#CD966B]/20 hover:bg-[#CD966B]/45 text-forest rounded-lg px-3.5 py-2 font-bold transition-all border border-forest/15 cursor-pointer"
                    >
                      ⚡ Custom Start
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Illustration (Premium Mockup) */}
              <div className="lg:col-span-5 flex justify-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative max-w-md w-full aspect-[4/3] rounded-2xl overflow-hidden border border-forest/18 bg-[#FFF1CE] p-3 shadow-sm"
                >
                  <div className="w-full h-full rounded-xl overflow-hidden relative group">
                    <img 
                      src="/src/assets/images/thailand_local_seo_hero_1782895916184.jpg" 
                      alt="Thailand Local SEO Illustration" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent flex flex-col justify-end p-5">
                      <div className="bg-[#FAE8CC]/95 backdrop-blur-sm rounded-xl p-3 border border-forest/15">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-forest animate-pulse"></span>
                          <p className="text-[10px] font-bold text-forest uppercase tracking-wider">Live Local SEO Grounding</p>
                        </div>
                        <p className="text-xs text-charcoal leading-tight font-medium">
                          Bilingual optimization helps Thai storefronts score higher on Google Business Profile rankings by covering all user search query profiles.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Why & Strategy Breakdown Section */}
            <section className="bg-[#FAE8CC] border-t border-forest/15 py-16">
              <div className="max-w-7xl mx-auto px-6 sm:px-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h3 className="text-2xl sm:text-3xl font-display font-semibold text-forest tracking-tight">
                    The Science Behind Our Thailand Local Optimization
                  </h3>
                  <p className="text-sm sm:text-base text-forest/70 mt-2">
                    Unlike standard generative writeups, our local algorithm formats and balances metadata specifically for Thailand GMF standards.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4">
                  {/* Card 1 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-[#F1CFAE]/15 rounded-xl p-6 border border-forest/12 flex flex-col gap-4 items-start relative group hover:shadow-md pt-10"
                  >
                    <div className="absolute -top-7 -left-3 z-20">
                      <img 
                        src={speakIcon} 
                        alt="Bilingual Search Icon" 
                        referrerPolicy="no-referrer" 
                        className="w-16 h-16 object-contain transform group-hover:scale-120 group-hover:rotate-6 transition-transform duration-300 drop-shadow-md" 
                      />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-base font-bold text-forest font-display">Bilingual Search Capture</h4>
                      <p className="text-xs sm:text-sm text-charcoal/80 mt-2 leading-relaxed">
                        Local searchers in Bangkok, Chiang Mai, and Phuket utilize English and Central Thai interchangeably. Dual-language structures ensure your listing indices index comprehensively across both populations.
                      </p>
                    </div>
                  </motion.div>

                  {/* Card 2 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-[#F1CFAE]/15 rounded-xl p-6 border border-forest/12 flex flex-col gap-4 items-start relative group hover:shadow-md pt-10"
                  >
                    <div className="absolute -top-7 -left-3 z-20">
                      <img 
                        src={phoneScrollingIcon} 
                        alt="Read More UX Icon" 
                        referrerPolicy="no-referrer" 
                        className="w-16 h-16 object-contain transform group-hover:scale-120 group-hover:-rotate-6 transition-transform duration-300 drop-shadow-md" 
                      />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-base font-bold text-forest font-display font-medium">The "Read More" UX Alignment</h4>
                      <p className="text-xs sm:text-sm text-charcoal/80 mt-2 leading-relaxed">
                        By placing exactly 2 vertical carriage breaks after character-bracketed Thai text, we trick Google into formatting the English translation directly behind a clean "Read More" click option.
                      </p>
                    </div>
                  </motion.div>

                  {/* Card 3 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-[#F1CFAE]/15 rounded-xl p-6 border border-forest/12 flex flex-col gap-4 items-start relative group hover:shadow-md pt-10"
                  >
                    <div className="absolute -top-7 -left-3 z-20">
                      <img 
                        src={punchListIcon} 
                        alt="Length Check Icon" 
                        referrerPolicy="no-referrer" 
                        className="w-16 h-16 object-contain transform group-hover:scale-120 group-hover:rotate-6 transition-transform duration-300 drop-shadow-md" 
                      />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-base font-bold text-forest font-display">Mathematical Length Check</h4>
                      <p className="text-xs sm:text-sm text-charcoal/80 mt-2 leading-relaxed">
                        Google enforces a rigid 750-character ceiling on business bios. We verify and clamp character volumes dynamically so your descriptions publish seamlessly without truncation.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* How it Works Step Section */}
            <section className="bg-[#F1CFAE]/10 py-16 border-t border-forest/15">
              <div className="max-w-7xl mx-auto px-6 sm:px-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <h3 className="text-xl sm:text-2xl font-display font-semibold text-forest uppercase tracking-wider">
                    How it works
                  </h3>
                  <div className="w-12 h-1 bg-terracotta mx-auto mt-3 rounded"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
                  {[
                    { num: "01", title: "Search Store", desc: "Type your business name. Live grounding pulls map records.", icon: shopIcon },
                    { num: "02", title: "Verify SEO Core", desc: "Select target district and primary local SEO keyword.", icon: puzzleSolvingIcon },
                    { num: "03", title: "Bilingual Draft", desc: "Our Gemini agent writes localized, character-balanced content.", icon: thailandIcon },
                    { num: "04", title: "Deploy Copy", desc: "Click copy with visual validation and instantly paste on GMF.", icon: beachIcon }
                  ].map((step, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="bg-[#FAE8CC] rounded-xl p-6 border border-forest/15 flex flex-col relative group hover:shadow-md pt-10"
                    >
                      <div className="absolute -top-7 -left-3 z-20">
                        <img 
                          src={step.icon} 
                          alt={step.title} 
                          referrerPolicy="no-referrer" 
                          className="w-16 h-16 object-contain transform group-hover:scale-120 group-hover:rotate-12 transition-transform duration-300 drop-shadow-md" 
                        />
                      </div>
                      <div className="flex justify-end items-start mb-2 z-10">
                        <span className="text-3xl font-display font-extrabold text-[#CD966B]/30 group-hover:text-timber/35 transition-colors">
                          {step.num}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-forest z-10 mt-2">{step.title}</h4>
                      <p className="text-xs text-forest/70 mt-2 leading-relaxed z-10">{step.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: LOADING SEARCH VIEW */}
        {view === "loading_search" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[400px]">
            <div className="flex flex-col items-center max-w-md text-center gap-6">
              {/* Radar pulse */}
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-forest/10 rounded-full animate-ping"></div>
                <div className="absolute inset-2 bg-timber/15 rounded-full animate-pulse"></div>
                <div className="absolute inset-6 bg-forest rounded-full flex items-center justify-center border border-forest/10">
                  <Building2 className="text-[#FAE8CC] w-8 h-8 animate-bounce" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold font-display text-forest">
                  Scanning Thailand Local Map Records...
                </h3>
                <p className="text-xs text-forest/70 mt-2 font-mono">
                  Searching Google Maps for: <span className="text-timber font-bold">"{businessName}"</span>
                </p>
              </div>

              <div className="w-full bg-[#F1CFAE] h-1.5 rounded-lg overflow-hidden border border-forest/10">
                <div className="bg-forest h-full w-2/3 rounded-lg animate-pulse"></div>
              </div>

              <div className="flex flex-col gap-2 w-full pt-4">
                <p className="text-[10px] text-forest/60 font-mono italic">
                  Grounded Search scans maps databases to extract precise address categories, target subdistricts, and primary customer profiles.
                </p>
                <button 
                  onClick={() => setView("setup")}
                  className="text-xs text-timber hover:text-forest font-bold underline mt-2"
                >
                  Skip and enter details manually
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: SETUP DASHBOARD */}
        {view === "setup" && (
          <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 sm:py-12 flex flex-col gap-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-forest/15 pb-6">
              <div>
                <h2 className="text-2xl font-display font-semibold text-forest">
                  Review & Refine Business Attributes
                </h2>
                <p className="text-xs text-forest/70 mt-1">
                  Adjust target local SEO parameters before executing the bilingual copywriter.
                </p>
              </div>
              <button 
                onClick={handleReset}
                type="button"
                className="text-xs font-semibold text-forest hover:bg-forest/10 border border-forest/20 rounded-lg px-3 py-1.5 transition-all self-start cursor-pointer"
              >
                Back to Home
              </button>
            </div>

            {error && (
              <div className="p-4 bg-terracotta/15 text-forest rounded-xl border border-terracotta/30 text-xs sm:text-sm flex flex-col gap-1 shadow-sm">
                <span className="font-bold">Notice regarding lookup:</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column Form */}
              <motion.div 
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="md:col-span-7 bg-[#FFF1CE] border border-forest/18 rounded-2xl p-6 flex flex-col gap-6"
              >
                
                {/* Business Name */}
                <div>
                  <label className="block text-xs font-bold text-forest/70 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-display">
                    <Building2 className="w-3.5 h-3.5 text-forest" />
                    Business Name (or Category)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Starbucks Thonglor"
                      className="flex-1 p-3 text-sm bg-[#FAE8CC] border border-forest/18 rounded-xl focus:border-forest outline-none font-medium text-forest"
                    />
                    <button
                      type="button"
                      onClick={handleInlineSearch}
                      disabled={searching || !businessName}
                      className="bg-forest hover:bg-forest/90 text-[#FAE8CC] text-xs font-bold px-4 rounded-xl disabled:opacity-50 shrink-0 transition-colors cursor-pointer"
                    >
                      {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Re-Search Maps"}
                    </button>
                  </div>
                </div>

                {/* Target Core Keyword */}
                <div>
                  <label className="block text-xs font-bold text-forest/70 uppercase tracking-wider mb-1.5 flex items-center justify-between font-display">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-forest" />
                      Target Core Keyword
                    </span>
                    <span className="text-[10px] text-forest/50 font-mono normal-case font-medium">Crucial for ranking</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={coreKeyword}
                    onChange={(e) => setCoreKeyword(e.target.value)}
                    placeholder="e.g. Italian Restaurant Thonglor"
                    className="w-full p-3 text-sm bg-[#FAE8CC] border border-forest/18 rounded-xl focus:border-forest outline-none font-medium text-forest"
                  />
                  <p className="text-[10px] text-forest/50 mt-1.5">
                    The core keyword is injected in front of the Thai string to establish high relevance in Google Local Packs.
                  </p>
                </div>

                {/* Target Area */}
                <div>
                  <label className="block text-xs font-bold text-forest/70 uppercase tracking-wider mb-2 flex items-center justify-between font-display">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-forest" />
                      Target Area & Province
                    </span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Nimman, Chiang Mai"
                    className="w-full p-3 text-sm bg-[#FAE8CC] border border-forest/18 rounded-xl focus:border-forest outline-none font-medium text-forest"
                  />
                  
                  {/* Suggestions block */}
                  <div className="mt-4">
                    <p className="text-[10px] text-forest/60 font-bold uppercase tracking-wider mb-1.5">Quick Location presets:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedAreas.map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => setDistrict(area)}
                          className={`text-[10px] px-2.5 py-1 rounded-lg transition-all border cursor-pointer ${
                            district.toLowerCase() === area.toLowerCase()
                              ? "bg-forest text-[#FAE8CC] border-forest font-semibold"
                              : "bg-[#FAE8CC] text-forest border-forest/15 hover:bg-[#F1CFAE]/40"
                          }`}
                        >
                          {area.split(", ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </motion.div>

              {/* Right Column Form */}
              <motion.div 
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="md:col-span-5 flex flex-col gap-6"
              >
                
                {/* Core Services / Bullets */}
                <div className="bg-[#FFF1CE] border border-forest/18 rounded-2xl p-6 flex-1 flex flex-col">
                  <label className="block text-xs font-bold text-forest/70 uppercase tracking-wider mb-2 flex items-center justify-between shrink-0 font-display">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-forest" />
                      Core Services & Bullets
                    </span>
                    <span className="text-[10px] text-forest bg-[#FAE8CC] px-2 py-0.5 rounded border border-forest/12 font-mono font-bold">1 per line</span>
                  </label>
                  <textarea
                    required
                    value={bulletPoints}
                    onChange={(e) => setBulletPoints(e.target.value)}
                    placeholder="- authentic neapolitan pizza&#10;- imported ingredients&#10;- cozy atmospheric seating&#10;- rooftop cocktails"
                    className="flex-1 w-full min-h-[180px] p-4 text-sm bg-[#FAE8CC] border border-forest/18 rounded-xl focus:border-forest outline-none resize-none text-forest font-medium leading-relaxed"
                  />
                  <div className="mt-4 border-t border-forest/12 pt-3 flex flex-col gap-2">
                    <div className="text-[11px] text-forest flex items-center gap-1.5 font-semibold">
                      <HelpCircle className="w-3.5 h-3.5 text-timber shrink-0" />
                      <span>Click to inject recommended local features:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedFeatures.map((feat) => {
                        const lines = bulletPoints
                          .split("\n")
                          .map((l) => l.replace(/^-\s*/, "").trim().toLowerCase());
                        const isSelected = lines.includes(feat.toLowerCase());
                        
                        return (
                          <button
                            key={feat}
                            type="button"
                            onClick={() => injectBulletSuggestion(feat)}
                            className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                              isSelected
                                ? "bg-[#CD966B]/20 text-forest border-timber font-bold"
                                : "bg-[#FAE8CC] hover:bg-[#F1CFAE]/50 text-forest border-forest/15"
                            }`}
                          >
                            <span>{isSelected ? "✓" : "+"}</span>
                            <span>{feat}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Big Generation Action Button */}
                <button
                  type="submit"
                  disabled={!bulletPoints || !coreKeyword}
                  className="w-full bg-forest hover:bg-forest/90 text-[#FAE8CC] py-4 px-6 rounded-xl font-bold text-sm tracking-wide uppercase transition-all shadow-sm hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Generate Bilingual Copy
                </button>
              </motion.div>
            </form>
          </div>
        )}

        {/* VIEW 4: LOADING GENERATE VIEW */}
        {view === "loading_generate" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-forest text-[#FAE8CC] min-h-[400px]">
            <div className="flex flex-col items-center max-w-md text-center gap-6">
              
              {/* Spinner & Holographic radar */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-timber/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#FFF1CE] rounded-full border-t-transparent animate-spin"></div>
                <Sparkles className="text-terracotta w-8 h-8 animate-pulse" />
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-mono font-bold tracking-widest text-terracotta animate-pulse">
                  AI Optimizing Local Copy
                </p>
                <h3 className="text-xl font-bold font-display tracking-tight text-cream">
                  Generating Bilingual SEO Variants
                </h3>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-forest/45 h-2 rounded-lg overflow-hidden mt-2 border border-timber/30">
                <div 
                  className="bg-terracotta h-full rounded-lg transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="min-h-[40px] flex items-center justify-center">
                <p className="text-xs text-cream/80 font-mono italic animate-pulse">
                  {loadingMsg}
                </p>
              </div>

              <p className="text-[10px] text-cream/60 max-w-xs font-mono leading-relaxed mt-4">
                Our Gemini engine structures Polite Central Thai (using Ka/Krap), inserts the double break, translates to fluent English, and clamps characters under 750 total limit.
              </p>
            </div>
          </div>
        )}

        {/* VIEW 5: OUTPUT & PLAYGROUND SCREEN */}
        {view === "output" && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden animate-in fade-in duration-300">
            
            {/* Sidebar Input Editor (allows tuning on-the-fly!) */}
            <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-forest/15 bg-[#FFF1CE]/90 p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
              
              <div className="bg-[#FAE8CC] -mx-6 -mt-6 p-5 border-b border-forest/15 mb-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-forest uppercase tracking-wider flex items-center gap-1.5 font-display">
                    <Building2 className="w-3.5 h-3.5" />
                    SEO Parameters Editor
                  </label>
                  <button 
                    onClick={handleReset}
                    type="button"
                    className="text-[10px] bg-forest text-[#FAE8CC] font-bold px-2 py-1 rounded border border-transparent hover:bg-forest/90 cursor-pointer"
                  >
                    Start Over
                  </button>
                </div>
              </div>

              <form onSubmit={handleGenerate} className="flex flex-col gap-5 h-full">
                {/* Business Name */}
                <div>
                  <label className="block text-[10px] font-bold text-forest/70 uppercase tracking-wider mb-1 font-display">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FAE8CC] border border-forest/15 rounded-lg focus:border-forest font-medium text-forest"
                  />
                </div>

                {/* Core Services Bullet Points */}
                <div>
                  <label className="block text-[10px] font-bold text-forest/70 uppercase tracking-wider mb-1 font-display">
                    Services / Bullets
                  </label>
                  <textarea
                    required
                    value={bulletPoints}
                    onChange={(e) => setBulletPoints(e.target.value)}
                    className="w-full h-32 p-3 text-xs bg-[#FAE8CC] border border-forest/15 rounded-lg focus:border-forest resize-none font-medium text-forest"
                  />
                  <div className="mt-2 flex flex-col gap-1.5">
                    <span className="text-[9px] text-forest/50 font-bold uppercase tracking-wider font-display">Quick Suggestions:</span>
                    <div className="flex flex-wrap gap-1">
                      {suggestedFeatures.slice(0, 6).map((feat) => {
                        const lines = bulletPoints
                          .split("\n")
                          .map((l) => l.replace(/^-\s*/, "").trim().toLowerCase());
                        const isSelected = lines.includes(feat.toLowerCase());
                        return (
                          <button
                            key={feat}
                            type="button"
                            onClick={() => injectBulletSuggestion(feat)}
                            className={`text-[9px] px-1.5 py-0.5 rounded border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#CD966B]/20 text-forest border-timber font-bold"
                                : "bg-[#FAE8CC] hover:bg-[#F1CFAE]/45 text-forest/70 border-forest/12"
                            }`}
                          >
                            {isSelected ? "✓" : "+"} {feat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Target Core Keyword */}
                <div>
                  <label className="block text-[10px] font-bold text-forest/70 uppercase tracking-wider mb-1 font-display">
                    Core Keyword
                  </label>
                  <input
                    required
                    type="text"
                    value={coreKeyword}
                    onChange={(e) => setCoreKeyword(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FAE8CC] border border-forest/15 rounded-lg focus:border-forest font-medium text-forest"
                  />
                </div>

                {/* Target District */}
                <div>
                  <label className="block text-[10px] font-bold text-forest/70 uppercase tracking-wider mb-1 font-display">
                    District / Region
                  </label>
                  <input
                    required
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FAE8CC] border border-forest/15 rounded-lg focus:border-forest font-medium text-forest"
                  />
                </div>

                {/* Regenerate Trigger */}
                <button
                  type="submit"
                  disabled={!bulletPoints || !coreKeyword}
                  className="mt-auto w-full bg-forest hover:bg-forest/90 text-[#FAE8CC] text-xs py-3 rounded-lg font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Re-Optimize Copy
                </button>
              </form>
            </aside>

            {/* Canvas Results Panel */}
            <section className="flex-1 p-6 sm:p-8 flex flex-col gap-6 overflow-y-auto">
              
              {/* Output Tab Selection Header */}
              <div className="flex items-center justify-between border-b border-forest/15 pb-2">
                <div className="flex items-center gap-1.5">
                  {variations.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(idx)}
                      className={`px-4 py-2.5 text-xs sm:text-sm font-display tracking-tight font-bold border-b-2 transition-all cursor-pointer ${
                        activeTab === idx
                          ? "border-forest text-forest font-extrabold"
                          : "border-transparent text-forest/40 hover:text-forest/70"
                      }`}
                    >
                      Variation 0{idx + 1}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-[11px] font-mono text-forest/60">Target Area:</span>
                  <span className="text-[11px] font-mono bg-[#FFF1CE] text-forest px-2 py-0.5 rounded-lg border border-forest/12 font-bold">{district}</span>
                </div>
              </div>

              {/* Main Copy Canvas Card */}
              <div className="flex-1 bg-[#FAE8CC] border border-forest/18 rounded-2xl flex flex-col min-h-0 shadow-sm relative group overflow-hidden">
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-forest/18 bg-[#FAE8CC] hover:bg-[#F1CFAE]/30 text-forest transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {isEditing ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-forest" />
                        Preview Draft
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-timber" />
                        Direct Edit
                      </>
                    )}
                  </button>
                  <span className="text-[10px] font-mono bg-[#FFF1CE] text-forest/80 px-2 py-1.5 rounded-lg border border-forest/15">
                    {isEditing ? "Editable Mode" : "Ready"}
                  </span>
                </div>
                
                {/* Result / Edit Block */}
                {isEditing ? (
                  <textarea
                    value={currentVariation}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="flex-1 w-full p-6 sm:p-8 pt-16 font-mono text-xs sm:text-sm leading-relaxed text-forest bg-[#FAE8CC] outline-none resize-none border-0 min-h-[250px] focus:bg-[#FFF1CE]/30"
                    placeholder="Refine or customize your copy here directly to fit the character limits..."
                  />
                ) : (
                  <div className="flex-1 p-6 sm:p-8 pt-16 font-sans text-sm sm:text-base leading-relaxed text-charcoal overflow-y-auto whitespace-pre-wrap selection:bg-[#F1CFAE]/60">
                    {renderBoldedText(currentVariation, coreKeyword)}
                  </div>
                )}

                {/* Visual Progress Bar & Length Warning Indicator */}
                <div className="w-full shrink-0 border-t border-forest/12 bg-[#F1CFAE]/20">
                  {/* The bar */}
                  <div className="w-full h-2 bg-[#FAE8CC] overflow-hidden relative">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        totalOutputLength > 750 
                          ? "bg-gradient-to-r from-terracotta to-rose-600 animate-pulse" 
                          : totalOutputLength >= 700 
                            ? "bg-[#CD966B]" 
                            : "bg-forest"
                      }`}
                      style={{ width: `${charPercentage}%` }}
                    ></div>
                  </div>
                  
                  {/* Dynamic Alert Banner when limit is reached/approached */}
                  <AnimatePresence>
                    {totalOutputLength > 750 && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-[#F1CFAE]/60 border-b border-forest/15 px-4 py-2 flex items-center justify-between text-forest"
                      >
                        <p className="text-[11px] font-semibold flex items-center gap-1.5 leading-none">
                          <span className="text-sm">⚠️</span>
                          <span>Character limit exceeded ({totalOutputLength} / 750). Google Business Profile may reject this bio. Please shorten it in Direct Edit mode.</span>
                        </p>
                        <span className="text-[9px] font-bold uppercase bg-[#CD966B]/20 text-forest px-2 py-0.5 rounded font-mono">
                          Too Long
                        </span>
                      </motion.div>
                    )}
                    {totalOutputLength >= 700 && totalOutputLength <= 750 && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-[#FFF1CE]/80 border-b border-forest/15 px-4 py-2 flex items-center justify-between text-forest"
                      >
                        <p className="text-[11px] font-semibold flex items-center gap-1.5 leading-none">
                          <span className="text-sm">⚡</span>
                          <span>Approaching limit ({totalOutputLength} / 750). Tap 'Direct Edit' to prune text for absolute safety.</span>
                        </p>
                        <span className="text-[9px] font-bold uppercase bg-[#FFF1CE] text-forest px-2 py-0.5 rounded font-mono border border-forest/12 animate-pulse">
                          Approaching Limit
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Character Counting Segment and Copy Button bar */}
                <div className="p-4 bg-[#FAE8CC] border-t border-forest/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                  
                  {/* Segmentation counters */}
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-forest"></span>
                      <span className="text-[11px] font-mono text-forest/70">Thai Segment: <strong className="text-forest font-semibold">{thaiLength}</strong> chars</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-timber"></span>
                      <span className="text-[11px] font-mono text-forest/70">English Segment: <strong className="text-forest font-semibold">{englishLength}</strong> chars</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        totalOutputLength > 750 
                          ? "bg-terracotta animate-ping" 
                          : totalOutputLength >= 700 
                            ? "bg-timber animate-pulse" 
                            : "bg-forest"
                      }`}></span>
                      <span className={`text-[11px] font-mono font-bold uppercase tracking-tight ${
                        totalOutputLength > 750 
                          ? "text-terracotta font-extrabold animate-pulse" 
                          : totalOutputLength >= 700 
                            ? "text-timber font-semibold" 
                            : "text-forest"
                      }`}>
                        Total: <strong>{totalOutputLength}</strong> / 750 chars
                      </span>
                    </div>
                  </div>

                  {/* Copy CTA */}
                  <button
                    onClick={() => handleCopy(currentVariation)}
                    className={`transition-all duration-300 text-[#FAE8CC] text-[11px] px-4 py-2.5 rounded-lg font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border cursor-pointer ${
                      copied 
                        ? "bg-forest hover:bg-forest/90 border-transparent shadow-sm" 
                        : totalOutputLength > 750
                          ? "bg-[#CD966B] hover:bg-[#CD966B]/90 border-transparent shadow-sm"
                          : "bg-forest hover:bg-forest/90 border-transparent shadow-sm"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#FAE8CC]" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#FAE8CC]/80" />
                        {totalOutputLength > 750 ? "Copy anyway (Over limit)" : "Copy Optimization String"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Thailand Local SEO Explanation Card */}
              {showUpsell && (
                <div className="bg-[#FFF1CE] border border-forest/15 rounded-xl p-5 relative overflow-hidden shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="max-w-2xl">
                      <h4 className="text-sm font-bold text-forest flex items-center gap-1.5 font-display">
                        <span className="text-base">🇹🇭</span> GMF / GBP Search Strategy Note
                      </h4>
                      <p className="text-xs text-charcoal/90 mt-1.5 leading-relaxed">
                        Google operates separate indexes for Thai and English queries. This custom hybrid layout prioritizes Local Thai SEO first, followed by exactly <span className="font-bold font-mono">two vertical breaks</span> to trigger Google's clean <span className="underline font-semibold text-forest font-display">"Read more"</span> expansion button precisely above your English translation.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <button className="text-[10px] bg-forest hover:bg-forest/90 text-[#FAE8CC] font-bold py-2.5 px-4 rounded-lg uppercase tracking-wider shadow-sm transition-colors whitespace-nowrap">
                        Join SEO Masterclass
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </section>
          </div>
        )}

      </main>

      {/* Elegant Toast Alert */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 bg-forest text-[#FAE8CC] px-5 py-4 rounded-xl shadow-md flex items-center gap-3.5 border border-[#FFF1CE]/30"
          >
            <div className="w-8 h-8 bg-[#FAE8CC] rounded-lg flex items-center justify-center shrink-0 border border-forest/12">
              <Check className="w-4 h-4 text-forest" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#FAE8CC] font-display">Copied String!</p>
              <p className="text-[11px] text-[#FAE8CC]/80 mt-0.5">Ready to paste directly into Google Business Profile.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
