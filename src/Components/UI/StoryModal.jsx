import React, { useEffect } from 'react';
import { X, Calendar, Tag, Link as LinkIcon, ArrowLeft } from 'lucide-react';

const StoryModal = ({ story, onClose }) => {

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    if (!story) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">

            {/* Navbar for Modal */}
            <div className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none">
                <button
                    onClick={onClose}
                    className="pointer-events-auto flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800 hover:border-zinc-600 backdrop-blur"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-cyber tracking-widest uppercase">Return to Base</span>
                </button>
            </div>

            {/* Content Container */}
            <div className="max-w-3xl mx-auto pt-32 pb-20 px-6">

                {/* Header */}
                <header className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6 text-[10px] font-cyber text-green-500 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Calendar size={12} /> {story.date}</span>
                        <span className="text-zinc-700">|</span>
                        <span className="flex items-center gap-2"><Tag size={12} /> {story.category}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{story.title}</h1>
                    <p className="text-lg text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto font-sans italic">
                        {story.subtitle}
                    </p>
                </header>

                {/* Hero Image */}
                <div className="mb-16 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl aspect-video relative group">
                    <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-20 transition-opacity duration-700 mix-blend-overlay"></div>
                    <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
                </div>

                {/* Article Content */}
                <article className="prose prose-invert prose-lg max-w-none text-zinc-300 font-sans leading-loose">
                    {/* DangerouslySetInnerHTML is used to render the HTML strings from data */}
                    <div dangerouslySetInnerHTML={{ __html: story.content }} />
                </article>

                {/* Gallery */}
                {story.media && story.media.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16 pt-16 border-t border-zinc-900">
                        <h3 className="col-span-full text-xs font-cyber text-zinc-500 uppercase tracking-widest mb-4">Visual Logs</h3>
                        {story.media.map((item, idx) => (
                            <div key={idx} className="rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors aspect-video bg-zinc-900">
                                <img src={item.url} alt="Gallery" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Links */}
                {story.links && story.links.length > 0 && (
                    <div className="mt-12 flex flex-wrap gap-4">
                        {story.links.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-4 bg-zinc-900 border border-zinc-800 rounded hover:border-green-500/50 hover:bg-zinc-800 text-white transition-all group"
                            >
                                <LinkIcon size={18} className="text-green-500" />
                                <span className="text-sm font-bold">{link.label}</span>
                                <ArrowUpRight size={16} className="text-zinc-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryModal;