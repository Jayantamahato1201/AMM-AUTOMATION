import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, MapPin, Calendar } from 'lucide-react';
import { ProjectItem } from '../../types.js';
import { optimizeImageUrl } from '../../utils/imageOptimizer.js';

interface ProjectCardProps {
  project: ProjectItem;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white border border-slate-200 overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col justify-between border-l-4 border-l-[#0A192F] hover:border-l-[#F27D26]">
      <div>
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden bg-[#0A192F]">
          <img
            src={optimizeImageUrl(project.featuredImage, 520, 70)}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

          <div className="absolute top-3 right-3">
            <span
              className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 ${
                project.status === 'Completed'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#F27D26] text-white'
              }`}
            >
              {project.status}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <span className="text-[10px] font-bold text-[#F27D26] uppercase tracking-widest block">
              {project.industry}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-[#0A192F] group-hover:text-[#F27D26] transition-colors line-clamp-2 leading-snug">
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
            {project.shortDescription}
          </p>

          {/* Technologies Badges */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1">
              {project.technologies.slice(0, 3).map((tech, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 font-bold uppercase tracking-wider border border-slate-200"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="text-[10px] text-slate-400 font-bold uppercase self-center">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Link */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
          {project.completionYear || 'Recent Project'}
        </span>
        <Link
          to={`/portfolio/${project.slug}`}
          className="font-bold uppercase tracking-wider text-xs text-[#0A192F] hover:text-[#F27D26] transition-colors inline-flex items-center gap-1"
        >
          <span>Case Study</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
