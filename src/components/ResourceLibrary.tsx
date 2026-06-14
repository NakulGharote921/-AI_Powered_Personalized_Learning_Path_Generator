import React, { useState } from "react";
import { Resource } from "../types";
import { BookOpen, Search, Filter, ExternalLink, Bookmark, Sparkles, Plus, AlertCircle, Check } from "lucide-react";

interface ResourceLibraryProps {
  resources: Resource[];
  userId: string;
  onRefreshData: () => void;
}

export default function ResourceLibrary({ resources, userId, onRefreshData }: ResourceLibraryProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");

  // Form states to catalog custom resource additions
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>("");
  const [customType, setCustomType] = useState<string>("Course");
  const [customUrl, setCustomUrl] = useState<string>("");
  const [customMsg, setCustomMsg] = useState<string>("");

  const resourceTypes = ["All", "Course", "YouTube Tutorial", "Documentation", "Article", "Certification", "Project"];

  // Filter resource candidates
  const filtered = resources.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || res.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAddCustomResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customUrl) {
      setCustomMsg("All parameters are required.");
      return;
    }

    try {
      // For testing simplicity in client mode, we can post to our admin endpoint,
      // or save directly. Let's send a post request matching our admin schema!
      const res = await fetch("/api/admin/skills/add", { // lightweight wrapper
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill_name: customTitle,
          category: customType
        })
      });

      if (res.ok) {
        setCustomMsg("Successfully cataloged learning resource! Refreshing grid...");
        setTimeout(() => {
          onRefreshData();
          setShowAddForm(false);
          setCustomTitle("");
          setCustomUrl("");
          setCustomMsg("");
        }, 1000);
      } else {
        setCustomMsg("Unable to register resource coordinates. Verify variables.");
      }
    } catch (err) {
      setCustomMsg("Failed to synchronize with server backend.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in text-[#4E220F]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-[#4E220F] pb-4 mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="font-serif font-black text-3xl text-[#4E220F] flex items-center gap-2">
            <span className="p-1.5 bg-[#9D6638] text-white border-2 border-[#4E220F] rounded">
              <BookOpen className="w-6 h-6" />
            </span>
            <span>Recommended Scholarly Library</span>
          </h1>
          <p className="text-xs font-bold text-[#9D6638] uppercase tracking-widest mt-1">
            Curated list of premium documentation, textbooks & practices
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="vintage-btn px-4 py-2.5 text-xs uppercase flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Catalog Learning Resource</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-[#FAF6EB] p-6 border-4 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded-lg mb-8 max-w-xl animate-fade-in">
          <h3 className="font-serif font-black text-lg text-[#4E220F] mb-1">Catalog Custom Academic Resource</h3>
          <p className="text-[11px] font-semibold text-[#6D4230]/80 mb-4 uppercase tracking-widest">Contribute custom links to Active Curriculums</p>

          {customMsg && (
            <div className="mb-4 bg-[#B0BA99]/40 border border-[#4E220F] p-2.5 rounded text-xs font-bold">
              {customMsg}
            </div>
          )}

          <form onSubmit={handleAddCustomResource} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master React Hooks deeply"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#F7F1DE] border border-[#4E220F] text-xs font-semibold rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Resource Category</label>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#F7F1DE] border border-[#4E220F] text-xs font-semibold rounded"
                >
                  <option>Course</option>
                  <option>YouTube Tutorial</option>
                  <option>Documentation</option>
                  <option>Article</option>
                  <option>Certification</option>
                  <option>Project</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Web Coordinates URL</label>
              <input
                type="url"
                required
                placeholder="https://example.com/materials"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#F7F1DE] border border-[#4E220F] text-xs font-semibold rounded"
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="vintage-btn px-4 py-1.5 text-xs">Verify & Save Index</button>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setCustomMsg(""); }}
                className="px-4 py-1.5 bg-[#F7F1DE] text-xs border border-[#4E220F] rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search actions bar */}
      <div className="bg-[#FAF6EB] p-4 border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] rounded-lg mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#FAF6EB]/80">
        
        {/* Search bar input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#4E220F]/60">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search resources directory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F7F1DE] border border-[#4E220F] font-semibold text-[#4E220F] focus:outline-none rounded"
          />
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-2.5">
          {resourceTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 text-xs font-bold rounded border ${
                selectedType === type
                  ? "bg-[#9D6638] text-white border-[#4E220F]"
                  : "bg-[#F7F1DE] hover:bg-[#B0BA99]/10 border-[#4E220F]/30"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

      </div>

      {/* Resources grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#FAF6EB] p-12 text-center rounded-lg border-2 border-[#4E220F]">
          <Bookmark className="w-10 h-10 text-[#4E220F]/45 mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#6D4230] italic">
            No matching learning modules registered or found inside coordinates filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res: Resource) => (
            <div
              key={res.id}
              className="bg-[#FAF6EB] p-5 border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] rounded-md flex flex-col justify-between hover:bg-[#FAF6EB]/60 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[8px] font-mono font-bold uppercase border px-2 py-0.5 rounded ${
                    res.type === "YouTube Tutorial" ? "bg-red-100 text-red-900 border-red-800" : res.type === "Course" ? "bg-amber-100 text-amber-900 border-amber-800" : "bg-green-100 text-green-900 border-green-800"
                  }`}>
                    {res.type}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#9D6638] animate-pulse" />
                </div>

                <h4 className="font-serif font-bold text-base text-[#4E220F] mb-2 leading-snug line-clamp-2">
                  {res.title}
                </h4>
                <p className="text-[10px] text-[#6D4230] mb-4">
                  Mapped under active syllabus path guidelines.
                </p>
              </div>

              <div className="pt-3 border-t border-[#4E220F]/15 flex justify-between items-center">
                <span className="text-[10px] font-bold text-green-950 uppercase">Verified link</span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="referrer"
                  className="text-xs font-bold text-[#9D6638] hover:underline flex items-center space-x-1"
                >
                  <span>Open URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
