'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PageTransition from "@/components/shared/PageTransition";
import {
  ArrowLeft, Star, Eye, Heart, Clock, Cpu, Tag, User, Calendar,
  ExternalLink, Check, Share2, Sparkles, Loader2, Bookmark, FileText,
  HelpCircle, CheckCircle2, AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { slugify } from "@/lib/utils";
import { ALL_PROJECTS, getProjectBySlugOrId, ProjectItem } from "@/lib/projectsData";

const diffColor: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700 border-green-200",
  Intermediate: "bg-blue-100 text-blue-700 border-blue-200",
  Advanced: "bg-purple-100 text-purple-700 border-purple-200",
};

const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n || 0);

export default function ProjectDetailClient() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<ProjectItem | null>(() => (id ? getProjectBySlugOrId(id) || null : null));
  const [loading, setLoading] = useState(!project);
  const [creatingProject, setCreatingProject] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(project?.likes || 0);

  useEffect(() => {
    if (!id) return;
    const found = getProjectBySlugOrId(id);
    if (found) {
      setProject(found);
      setLikesCount(found.likes || 0);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <PageTransition>
        <div className="min-h-[65vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">🔧</div>
          <h1 className="text-2xl font-bold text-gray-900">Project Not Found</h1>
          <p className="text-sm text-gray-500 max-w-md">
            The project &quot;{id}&quot; could not be found. It may have been renamed or removed.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projectkart
          </Link>
        </div>
      </PageTransition>
    );
  }

  const handleStartProject = () => {
    if (!user) { router.push("/login"); return; }
    setCreatingProject(true);
    setTimeout(() => {
      setCreatingProject(false);
      alert(`Project "${project.title}" added to your Maker Dashboard!`);
      router.push("/user/projects");
    }, 400);
  };

  const handleLike = () => {
    if (!liked) {
      setLikesCount(prev => prev + 1);
      setLiked(true);
    } else {
      setLikesCount(prev => prev - 1);
      setLiked(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.desc,
          url,
        });
      } catch (e) {}
    } else {
      await navigator.clipboard.writeText(url);
      alert("Project link copied to clipboard!");
    }
  };

  const related = ALL_PROJECTS.filter(
    (p) => p.id !== project.id && (p.category === project.category || p.subcategory === project.subcategory)
  ).slice(0, 3);

  return (
    <PageTransition>
      <div className="bg-gray-50/40 min-h-screen">
        {/* Sticky top breadcrumb bar */}
        <div className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 overflow-hidden">
              <Link href="/projects" className="flex items-center gap-1 hover:text-primary font-semibold text-gray-700 whitespace-nowrap">
                <ArrowLeft className="h-4 w-4" /> Projectkart
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-600 font-medium whitespace-nowrap">{project.category}</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-bold truncate max-w-[280px]">{project.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
              >
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Main Content */}
            <div className="lg:col-span-8 space-y-6">

              {/* Cover Image Banner */}
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-sm bg-gray-100 border border-gray-100 group">
                <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                  <span className="px-3.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full">
                    {project.category}
                  </span>
                  {project.subcategory && (
                    <span className="px-3.5 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full">
                      {project.subcategory}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Metadata Header */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${diffColor[project.difficulty] || "bg-gray-100 text-gray-700"}`}>
                    {project.difficulty}
                  </span>
                  {project.featured && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" /> Featured Project
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
                  {project.title}
                </h1>

                {/* Key Metrics */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1.5 font-medium text-gray-800">
                    <User className="h-4 w-4 text-primary" /> {project.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gray-400" /> {project.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" /> {project.rating} rating
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-gray-400" /> {fmt(project.views)} views
                  </span>
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 transition-colors ${liked ? "text-red-500 font-bold" : "text-gray-500 hover:text-red-500"}`}
                  >
                    <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                    {fmt(likesCount)} likes
                  </button>
                </div>
              </div>

              {/* Project Description & Guide */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Overview &amp; Construction Guide
                </h2>
                <div className="text-sm text-gray-700 leading-relaxed space-y-4 whitespace-pre-line">
                  {project.desc}
                </div>

                {project.procedure && project.procedure.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Step-by-Step Build Instructions:</h3>
                    <ol className="space-y-2.5">
                      {project.procedure.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs text-gray-700">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" /> Technology &amp; Topic Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag: string) => (
                      <Link
                        key={tag}
                        href="/projects"
                        className="px-3 py-1.5 bg-gray-50 hover:bg-primary/10 hover:text-primary text-gray-700 text-xs font-semibold rounded-xl transition-all border border-gray-200 hover:border-primary/30"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6">

              {/* Action Card: Start Project */}
              <div className="bg-gradient-to-br from-primary to-primary-hover rounded-3xl p-6 text-white shadow-lg shadow-primary/20">
                <span className="px-2.5 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-wider mb-3 inline-block">
                  Makers Hub
                </span>
                <h3 className="text-xl font-black mb-2">Build This Project</h3>
                <p className="text-xs text-white/80 leading-relaxed mb-6">
                  Add this project to your personal dashboard to track milestones, record sensor data, and submit working models.
                </p>
                <button
                  onClick={handleStartProject}
                  disabled={creatingProject}
                  className="w-full py-3.5 bg-white text-primary hover:bg-gray-50 font-bold text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {creatingProject ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Add to My Projects
                </button>
              </div>

              {/* Bill of Materials / Components Required */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" /> Bill of Materials ({project.components.length})
                </h3>
                <ul className="space-y-2.5">
                  {project.components.map((comp: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="font-medium leading-tight">{comp}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <Link
                    href="/materials"
                    className="text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1 w-full py-2 bg-primary/5 rounded-xl"
                  >
                    Order Parts from Lab Store &rarr;
                  </Link>
                </div>
              </div>

              {/* Specifications Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Project Parameters</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400">Discipline</span>
                    <span className="font-semibold text-gray-800">{project.category}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400">Sub-category</span>
                    <span className="font-semibold text-gray-800">{project.subcategory || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400">Skill Level</span>
                    <span className="font-semibold text-gray-800">{project.difficulty}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400">Build Time</span>
                    <span className="font-semibold text-gray-800">{project.duration}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Related Projects Carousel */}
          {related.length > 0 && (
            <div className="mt-14 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">Similar Science Projects</h2>
                  <p className="text-xs text-gray-500">More DIY experiments in {project.category}</p>
                </div>
                <Link href="/projects" className="text-xs font-bold text-primary hover:underline">
                  Browse All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/project/${slugify(p.title) || p.id}`}
                    className="group bg-white border border-gray-100 hover:border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-all flex flex-col"
                  >
                    <div className="aspect-video bg-gray-100 overflow-hidden relative">
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${diffColor[p.difficulty]}`}>
                        {p.difficulty}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {p.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4">{p.desc}</p>
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50 text-[11px] text-gray-400 font-medium">
                        <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{fmt(p.views)}</span>
                        <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />{p.rating}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{p.duration}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
