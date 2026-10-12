'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Menu, ArrowLeft } from 'lucide-react';
import { M3Badge } from './m3-chips-badges';

/**
 * 1. Official Material Design 3 (M3) Top App Bar:
 * - center-aligned (64px)
 * - small (64px)
 * - medium (112px)
 * - large (152px)
 */
export type M3TopAppBarVariant = 'center-aligned' | 'small' | 'medium' | 'large';

export interface M3TopAppBarProps {
  variant?: M3TopAppBarVariant;
  title: string;
  subtitle?: string;
  navigationIcon?: React.ReactNode;
  onNavigationClick?: () => void;
  actions?: React.ReactNode;
  elevated?: boolean;
  className?: string;
}

export function M3TopAppBar({
  variant = 'small',
  title,
  subtitle,
  navigationIcon,
  onNavigationClick,
  actions,
  elevated = false,
  className,
}: M3TopAppBarProps) {
  const isExpanded = variant === 'medium' || variant === 'large';

  return (
    <header
      className={cn(
        'w-full transition-colors duration-200 px-4',
        elevated
          ? 'bg-[#eef3fc] shadow-[0_1px_2px_rgba(60,64,67,0.2)]'
          : 'bg-[#f8fafd]',
        variant === 'center-aligned' && 'h-16 flex items-center justify-between',
        variant === 'small' && 'h-16 flex items-center justify-between',
        variant === 'medium' && 'h-28 flex flex-col justify-between py-3',
        variant === 'large' && 'h-36 flex flex-col justify-between py-4',
        className
      )}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <button
          type="button"
          onClick={onNavigationClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#1f1f1f] hover:bg-[#1f1f1f]/[0.08] cursor-pointer [&_svg]:w-6 [&_svg]:h-6"
          aria-label="Navigation"
        >
          {navigationIcon || (variant === 'center-aligned' ? <Menu /> : <ArrowLeft />)}
        </button>

        {!isExpanded && (
          <div
            className={cn(
              'min-w-0 flex-1',
              variant === 'center-aligned' ? 'text-center' : 'text-left ml-2'
            )}
          >
            <h2 className="text-lg sm:text-xl font-normal text-[#1f1f1f] truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-[#444746] truncate">{subtitle}</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 text-[#444746]">{actions}</div>
      </div>

      {isExpanded && (
        <div className="px-2 pb-1">
          <h2
            className={cn(
              'font-normal text-[#1f1f1f] truncate',
              variant === 'medium' ? 'text-2xl' : 'text-3xl sm:text-4xl'
            )}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[#444746] mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      )}
    </header>
  );
}

/**
 * 2. Official Material Design 3 (M3) Bottom App Bar:
 * - With docked FAB on right or icons-only
 */
export interface M3BottomAppBarProps {
  actions: React.ReactNode;
  fab?: React.ReactNode;
  className?: string;
}

export function M3BottomAppBar({ actions, fab, className }: M3BottomAppBarProps) {
  return (
    <div
      className={cn(
        'flex h-20 w-full items-center justify-between bg-[#eef3fc] px-4 rounded-t-[16px] shadow-[0_-1px_3px_rgba(60,64,67,0.12)]',
        className
      )}
    >
      <div className="flex items-center gap-1 text-[#444746]">{actions}</div>
      {fab && <div className="shrink-0">{fab}</div>}
    </div>
  );
}

/**
 * 3. Official Material Design 3 (M3) Navigation Bar (Bottom 3-5 destinations):
 * - 80px height, 64x32px pill indicator (#c2e7ff) on active icon
 * - labelVisibility: 'always' | 'selected' | 'none'
 */
export interface M3NavDestination {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string | 'dot';
  disabled?: boolean;
}

export interface M3NavigationBarProps {
  items: M3NavDestination[];
  activeId: string;
  onSelect: (id: string) => void;
  labelVisibility?: 'always' | 'selected' | 'none';
  className?: string;
}

export function M3NavigationBar({
  items,
  activeId,
  onSelect,
  labelVisibility = 'always',
  className,
}: M3NavigationBarProps) {
  return (
    <nav
      className={cn(
        'flex h-20 w-full items-center justify-around bg-[#f3f6fc] border-t border-[#e0e2e0]/60 px-2',
        className
      )}
    >
      {items.map((item) => {
        const active = item.id === activeId;
        const showLabel =
          labelVisibility === 'always' ||
          (labelVisibility === 'selected' && active);
        const iconEl = (
          <span className="[&_svg]:w-6 [&_svg]:h-6">{item.icon}</span>
        );

        return (
          <button
            key={item.id}
            type="button"
            disabled={item.disabled}
            onClick={() => onSelect(item.id)}
            className="group flex flex-1 flex-col items-center justify-center gap-1 py-2 cursor-pointer select-none disabled:opacity-38 disabled:pointer-events-none"
          >
            <span
              className={cn(
                'relative flex h-8 w-16 items-center justify-center rounded-full transition-all duration-200',
                active
                  ? 'bg-[#c2e7ff] text-[#001d35]'
                  : 'text-[#444746] group-hover:bg-[#1f1f1f]/[0.08]'
              )}
            >
              {item.badge !== undefined ? (
                <M3Badge
                  variant={item.badge === 'dot' ? 'dot' : 'large'}
                  count={item.badge === 'dot' ? undefined : item.badge}
                >
                  {iconEl}
                </M3Badge>
              ) : (
                iconEl
              )}
            </span>
            {showLabel && (
              <span
                className={cn(
                  'text-xs transition-colors',
                  active ? 'font-bold text-[#1f1f1f]' : 'font-medium text-[#444746]'
                )}
              >
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

/**
 * 4. Official Material Design 3 (M3) Navigation Rail:
 * - 80px wide vertical rail for tablet/desktop with optional menu & FAB
 * - alignment: 'top' | 'center' | 'bottom'
 */
export interface M3NavigationRailProps {
  items: M3NavDestination[];
  activeId: string;
  onSelect: (id: string) => void;
  fab?: React.ReactNode;
  headerIcon?: React.ReactNode;
  alignment?: 'top' | 'center' | 'bottom';
  className?: string;
}

export function M3NavigationRail({
  items,
  activeId,
  onSelect,
  fab,
  headerIcon,
  alignment = 'top',
  className,
}: M3NavigationRailProps) {
  return (
    <aside
      className={cn(
        'flex w-20 flex-col items-center bg-[#f8fafd] border-r border-[#e0e2e0] py-4 select-none',
        className
      )}
    >
      {headerIcon !== undefined ? (
        <div className="mb-3">{headerIcon}</div>
      ) : (
        <button
          type="button"
          className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#444746] hover:bg-[#1f1f1f]/[0.08] cursor-pointer"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {fab && <div className="mb-6">{fab}</div>}

      <div
        className={cn(
          'flex flex-1 flex-col items-center gap-3 w-full',
          alignment === 'center' && 'justify-center',
          alignment === 'bottom' && 'justify-end'
        )}
      >
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={() => onSelect(item.id)}
              className="group flex flex-col items-center gap-1 w-full cursor-pointer disabled:opacity-38 disabled:pointer-events-none"
            >
              <span
                className={cn(
                  'flex h-8 w-14 items-center justify-center rounded-full transition-all duration-200 [&_svg]:w-5 [&_svg]:h-5',
                  active
                    ? 'bg-[#c2e7ff] text-[#001d35]'
                    : 'text-[#444746] group-hover:bg-[#1f1f1f]/[0.08]'
                )}
              >
                {item.badge !== undefined ? (
                  <M3Badge
                    variant={item.badge === 'dot' ? 'dot' : 'large'}
                    count={item.badge === 'dot' ? undefined : item.badge}
                  >
                    {item.icon}
                  </M3Badge>
                ) : (
                  item.icon
                )}
              </span>
              <span
                className={cn(
                  'text-[11px] leading-tight text-center px-1',
                  active ? 'font-bold text-[#1f1f1f]' : 'font-medium text-[#444746]'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

/**
 * 5. Official Material Design 3 (M3) Navigation Drawer (Standard & Modal):
 * 360px max width, 56px tall pill items (rounded-full)
 */
export interface M3DrawerSection {
  title?: string;
  items: M3NavDestination[];
}

export interface M3NavigationDrawerProps {
  variant?: 'standard' | 'modal';
  open?: boolean;
  onClose?: () => void;
  header?: string;
  sections: M3DrawerSection[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function M3NavigationDrawer({
  variant = 'standard',
  open = true,
  onClose,
  header,
  sections,
  activeId,
  onSelect,
  className,
}: M3NavigationDrawerProps) {
  const drawerBody = (
    <aside
      className={cn(
        'w-[300px] sm:w-[336px] bg-[#f8fafd] p-3 flex flex-col rounded-r-[28px] border-r border-[#e0e2e0] select-none',
        variant === 'modal' && 'shadow-[0_8px_24px_rgba(0,0,0,0.18)]',
        className
      )}
    >
      {header && (
        <div className="px-4 py-3 text-sm font-bold text-[#444746] tracking-wide">
          {header}
        </div>
      )}
      <div className="space-y-4">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-0.5">
            {section.title && (
              <div className="px-4 py-2 text-xs font-semibold text-[#444746]">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const active = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    onSelect(item.id);
                    if (variant === 'modal') onClose?.();
                  }}
                  className={cn(
                    'flex h-14 w-full items-center justify-between rounded-full px-4 text-sm transition-colors cursor-pointer disabled:opacity-38 disabled:pointer-events-none [&_svg]:w-5 [&_svg]:h-5',
                    active
                      ? 'bg-[#c2e7ff] font-bold text-[#001d35]'
                      : 'text-[#444746] font-medium hover:bg-[#1f1f1f]/[0.08]'
                  )}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span className="text-xs font-bold">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );

  if (variant === 'standard') return drawerBody;
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[500] flex">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="relative z-10 h-full">{drawerBody}</div>
    </div>
  );
}

/**
 * 6. Official Material Design 3 (M3) Tabs:
 * - Primary tabs (stacked icon+label 64px, inline icon+label 48px, or icon-only 48px; 3px rounded active pill underline)
 * - Secondary tabs (label + optional inline icon, 2px full-width active underline)
 * - Scrollable tabs (52px start offset per M3 spec)
 */
export interface M3TabItem {
  id: string;
  label?: string;
  icon?: React.ReactNode;
  badge?: number | string | 'dot';
  disabled?: boolean;
}

export interface M3TabsProps {
  variant?: 'primary' | 'secondary';
  iconPosition?: 'top' | 'inline';
  scrollable?: boolean;
  tabs: M3TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function M3Tabs({
  variant = 'primary',
  iconPosition = 'top',
  scrollable = false,
  tabs,
  activeId,
  onChange,
  className,
}: M3TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex w-full border-b border-[#e0e2e0] bg-white overflow-x-auto no-scrollbar',
        scrollable && 'pl-[52px]',
        className
      )}
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        const isStacked =
          variant === 'primary' && iconPosition === 'top' && tab.icon && tab.label;

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            disabled={tab.disabled}
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center justify-center gap-1.5 px-4 transition-colors cursor-pointer select-none hover:bg-[#0b57d0]/[0.05] disabled:opacity-38 disabled:pointer-events-none [&_svg]:w-5 [&_svg]:h-5',
              scrollable ? 'shrink-0 min-w-[90px]' : 'flex-1 min-w-[80px]',
              isStacked ? 'h-16 flex-col' : 'h-12 flex-row',
              active ? 'text-[#0b57d0] font-semibold' : 'text-[#444746] font-medium'
            )}
          >
            {tab.icon && (
              <span className="relative">
                {tab.badge !== undefined ? (
                  <M3Badge
                    variant={tab.badge === 'dot' ? 'dot' : 'large'}
                    count={tab.badge === 'dot' ? undefined : tab.badge}
                  >
                    {tab.icon}
                  </M3Badge>
                ) : (
                  tab.icon
                )}
              </span>
            )}
            {tab.label && (
              <span className="text-xs sm:text-sm whitespace-nowrap">
                {tab.label}
              </span>
            )}
            {active && (
              <span
                className={cn(
                  'absolute bottom-0 bg-[#0b57d0] transition-all',
                  variant === 'primary'
                    ? 'h-[3px] w-12 rounded-t-full'
                    : 'h-[2px] inset-x-0'
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
