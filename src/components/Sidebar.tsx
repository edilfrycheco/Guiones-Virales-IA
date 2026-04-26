'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Wand2,
  Zap,
  BarChart3,
  BookTemplate,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  Layers,
  BookOpen,
  UserCircle,
  CalendarDays,
} from 'lucide-react';

const MAIN_NAV = [
  { href: '/', label: 'Dashboard', icon: Flame, description: 'Vista general' },
  { href: '/crear', label: 'Crear Guión', icon: Layers, description: 'Flujo guiado IA', primary: true },
  { href: '/plan', label: 'Plan de Contenido', icon: CalendarDays, description: 'Banco de temas' },
  { href: '/analyzer', label: 'Analizador', icon: BarChart3, description: 'Evaluar guiones' },
  { href: '/referentes', label: 'Referentes', icon: BookOpen, description: 'Guiones ganadores' },
  { href: '/perfil', label: 'Mi Perfil', icon: UserCircle, description: 'Audiencia & defaults' },
];

const TOOLS_NAV = [
  { href: '/hooks', label: 'Ganchos', icon: Zap, description: 'Generar hooks' },
  { href: '/generator', label: 'Generador', icon: Wand2, description: 'Crear guiones' },
  { href: '/templates', label: 'Plantillas', icon: BookTemplate, description: 'Frameworks' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[var(--bg-secondary)] border-r border-[var(--border-color)] transition-all duration-300 z-50 flex flex-col ${
        collapsed ? 'w-[68px]' : 'w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[var(--border-color)]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-[15px] text-white leading-tight">ViralScript</h1>
            <p className="text-[11px] text-[var(--text-muted)]">AI Engine</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <div className="space-y-1 mb-2">
          {MAIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  item.primary && !isActive
                    ? 'bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-white'
                    : isActive
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-r-full" />
                )}
                <Icon
                  size={20}
                  className={`flex-shrink-0 ${
                    isActive || item.primary ? 'text-indigo-400' : 'group-hover:text-white'
                  }`}
                />
                {!collapsed && (
                  <div className="overflow-hidden">
                    <span className="text-[14px] font-medium block">{item.label}</span>
                    {!isActive && (
                      <span className="text-[11px] text-[var(--text-muted)] block">
                        {item.description}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <div className={`mt-4 mb-2 ${collapsed ? 'border-t border-[var(--border-color)] pt-3' : ''}`}>
          {!collapsed && (
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">
              Herramientas Rápidas
            </p>
          )}
          <div className="space-y-1">
            {TOOLS_NAV.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-r-full" />
                  )}
                  <Icon
                    size={20}
                    className={`flex-shrink-0 ${isActive ? 'text-indigo-400' : 'group-hover:text-white'}`}
                  />
                  {!collapsed && (
                    <div className="overflow-hidden">
                      <span className="text-[14px] font-medium block">{item.label}</span>
                      {!isActive && (
                        <span className="text-[11px] text-[var(--text-muted)] block">
                          {item.description}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border-color)] p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-white transition-all w-full"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-[13px]">Colapsar</span>}
        </button>
      </div>
    </aside>
  );
}
