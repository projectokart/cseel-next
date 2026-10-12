'use client';

import React, { useState } from 'react';
import {
  Plus,
  Heart,
  Share2,
  Bookmark,
  Settings,
  Bell,
  Home,
  FlaskConical,
  School,
  User,
  Sparkles,
  Check,
  Search,
  Mail,
  Trash2,
  Edit3,
  Copy,
  Download,
  Calendar,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import {
  M3Surface,
  M3_ELEVATION_STYLES,
  M3ElevationLevel,
  M3StateLayer,
  M3FocusRing,
  M3Button,
  M3IconButton,
  M3FAB,
  M3BrandedFAB,
  M3ExtendedFAB,
  M3SegmentedButton,
  M3AssistChip,
  M3FilterChip,
  M3InputChip,
  M3SuggestionChip,
  M3Badge,
  M3Card,
  M3Carousel,
  M3List,
  M3ListItem,
  M3Divider,
  M3TopAppBar,
  M3BottomAppBar,
  M3NavigationBar,
  M3NavigationRail,
  M3NavigationDrawer,
  M3Tabs,
  M3TextField,
  M3Search,
  M3Checkbox,
  M3RadioGroup,
  M3Switch,
  M3Slider,
  M3RangeSlider,
  M3DatePicker,
  M3TimePicker,
  M3LinearProgress,
  M3CircularProgress,
  M3Menu,
  M3TooltipPreview,
  M3SnackbarBox,
  M3TopSheet,
  M3Sheet,
  GoogleBottomSheet,
  GoogleSideDrawer,
  GoogleDialog,
  GoogleSnackbar,
} from '@/components/google-ui';

export default function GoogleM3ShowcasePage() {
  // Interactive states for showcase
  const [segSingle, setSegSingle] = useState('experiments');
  const [segMulti, setSegMulti] = useState<string[]>(['physics', 'chemistry']);
  const [segIconOnly, setSegIconOnly] = useState('home');
  const [favToggle, setFavToggle] = useState(true);
  const [bookmarkToggle, setBookmarkToggle] = useState(false);
  const [selectedChips, setSelectedChips] = useState<string[]>(['cbse', 'hands-on']);
  const [inputChips, setInputChips] = useState(['Class 10 Physics', 'Titration Setup', 'NEP 2020']);
  const [cardSelected, setCardSelected] = useState(true);
  const [navBarActive, setNavBarActive] = useState('labs');
  const [railActive, setRailActive] = useState('home');
  const [drawerActive, setDrawerActive] = useState('experiments');
  const [modalDrawerOpen, setModalDrawerOpen] = useState(false);
  const [primaryTab, setPrimaryTab] = useState('overview');
  const [secondaryTab, setSecondaryTab] = useState('all');
  const [chk1, setChk1] = useState(true);
  const [chk2, setChk2] = useState(false);
  const [radioVal, setRadioVal] = useState('cbse');
  const [sw1, setSw1] = useState(true);
  const [sw2, setSw2] = useState(false);
  const [sliderContinuous, setSliderContinuous] = useState(65);
  const [sliderDiscrete, setSliderDiscrete] = useState(40);
  const [sliderCentered, setSliderCentered] = useState(75);
  const [sliderRange, setSliderRange] = useState<[number, number]>([25, 80]);
  const [menuSelected, setMenuSelected] = useState('physics');

  // Overlay triggers
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [detachedSheetOpen, setDetachedSheetOpen] = useState(false);
  const [topSheetOpen, setTopSheetOpen] = useState(false);
  const [dialogVariant, setDialogVariant] = useState<'basic' | 'alert' | 'full-screen' | null>(null);
  const [liveToast, setLiveToast] = useState<string | null>(null);

  const toggleChip = (id: string) => {
    setSelectedChips((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] pb-24 text-[#1f1f1f]">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0b57d0] via-[#0842a0] to-[#003c6e] text-white py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Official Google Material Design 3 (M3)
          </span>
          <h1
            className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight"
            style={{ color: '#ffffff' }}
          >
            Complete Material Design 3 Master Component Library
          </h1>
          <p className="text-white/85 text-sm sm:text-base mt-2 max-w-3xl">
            Every official Material Design 3 component, layout variation, color scheme, interactive state (hover, focus, pressed, loading, selected, error, disabled), and elevation level.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-10">
        {/* 1. BUTTONS, FAB, EXTENDED FAB, ICON BUTTONS, SEGMENTED BUTTONS */}
        <section className="rounded-[28px] bg-white p-6 sm:p-8 border border-[#dadce0] shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b57d0]">01 · Actions</span>
            <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
              Buttons, FAB, Extended FAB, Icon Buttons & Segmented Buttons (All Variations)
            </h2>
          </div>

          <div className="space-y-5">
            {/* Row 1: 5 Core Variants */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2.5">
                A. 5 Official Variants — Active State (Filled, Elevated, Tonal, Outlined, Text)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <M3Button variant="filled" leadingIcon={<Plus />}>Filled</M3Button>
                <M3Button variant="elevated" leadingIcon={<Sparkles />}>Elevated</M3Button>
                <M3Button variant="tonal" leadingIcon={<FlaskConical />}>Tonal</M3Button>
                <M3Button variant="outlined" leadingIcon={<Download />}>Outlined</M3Button>
                <M3Button variant="text">Text Button</M3Button>
              </div>
            </div>

            {/* Row 2: Layout Variations, Sizes, Loading & Semantic Colors */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2.5">
                B. Icon Layouts (Text-only, Leading, Trailing, Both), Sizes (sm, md, lg), Loading & Color Schemes
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <M3Button variant="filled">Text Only</M3Button>
                <M3Button variant="filled" trailingIcon={<ArrowRight />}>Trailing Icon</M3Button>
                <M3Button variant="tonal" leadingIcon={<FlaskConical />} trailingIcon={<ArrowRight />}>
                  Both Icons
                </M3Button>
                <M3Button variant="filled" size="sm">Small (36px)</M3Button>
                <M3Button variant="filled" size="lg">Large (48px)</M3Button>
                <M3Button variant="filled" loading>Saving...</M3Button>
                <M3Button variant="filled" color="error" leadingIcon={<Trash2 />}>Destructive</M3Button>
                <M3Button variant="tonal" color="tertiary" leadingIcon={<Check />}>Success Tonal</M3Button>
              </div>
            </div>

            {/* Row 3: All 5 Disabled Variants */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2.5">
                C. Official M3 Disabled State (12% On-Surface Container · 38% On-Surface Label · 0dp Elevation)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <M3Button variant="filled" leadingIcon={<Plus />} disabled>Filled Disabled</M3Button>
                <M3Button variant="elevated" leadingIcon={<Sparkles />} disabled>Elevated Disabled</M3Button>
                <M3Button variant="tonal" leadingIcon={<FlaskConical />} disabled>Tonal Disabled</M3Button>
                <M3Button variant="outlined" leadingIcon={<Download />} disabled>Outlined Disabled</M3Button>
                <M3Button variant="text" disabled>Text Disabled</M3Button>
              </div>
            </div>
          </div>

          <M3Divider />

          {/* FAB & Extended FAB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-3">
                D. Floating Action Button (Small 40px, Regular 56px, Large 96px · 4 Colors · Lowered & Disabled)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <M3FAB size="small" color="primary" icon={<Plus />} title="Small FAB" />
                <M3FAB size="regular" color="primary" icon={<Plus />} title="Regular Primary FAB" />
                <M3FAB size="regular" color="surface" icon={<Edit3 />} title="Surface FAB" />
                <M3FAB size="regular" color="secondary" icon={<FlaskConical />} title="Secondary FAB" />
                <M3FAB size="regular" color="tertiary" icon={<Sparkles />} title="Tertiary FAB" />
                <M3FAB size="regular" color="primary" lowered icon={<Download />} title="Lowered FAB (1dp)" />
                <M3FAB size="regular" color="primary" disabled icon={<Plus />} title="Disabled FAB" />
                <M3FAB size="large" color="primary" icon={<Plus />} title="Large 96px FAB" />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-3">
                E. Extended FAB & @material/web Branded FAB (4-Color 36px Icon · Lowered · Disabled)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <M3BrandedFAB title="Branded FAB (<md-branded-fab>)" />
                <M3BrandedFAB label="Create Lab" title="Extended Branded FAB" />
                <M3BrandedFAB lowered label="Lowered Branded" />
                <M3ExtendedFAB icon={<Plus />} label="New Experiment" color="primary" />
                <M3ExtendedFAB label="Label Only FAB" color="secondary" />
                <M3ExtendedFAB icon={<Plus />} label="Disabled Extended" disabled />
              </div>
            </div>
          </div>

          <M3Divider />

          {/* Icon Buttons & Segmented Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-3">
                F. Icon Buttons (Standard, Filled, Tonal, Outlined · Selected/Unselected Toggle · Sizes · Disabled)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <M3IconButton
                  variant="standard"
                  selected={favToggle}
                  onClick={() => setFavToggle(!favToggle)}
                  icon={<Heart />}
                  label="Standard toggle"
                />
                <M3IconButton
                  variant="filled"
                  selected={favToggle}
                  onClick={() => setFavToggle(!favToggle)}
                  icon={<Heart />}
                  label="Filled toggle"
                />
                <M3IconButton
                  variant="tonal"
                  selected={bookmarkToggle}
                  onClick={() => setBookmarkToggle(!bookmarkToggle)}
                  icon={<Bookmark />}
                  label="Tonal toggle"
                />
                <M3IconButton
                  variant="outlined"
                  selected={bookmarkToggle}
                  onClick={() => setBookmarkToggle(!bookmarkToggle)}
                  icon={<Settings />}
                  label="Outlined toggle"
                />
                <M3IconButton variant="filled" size="sm" icon={<Plus />} label="Small 32px" />
                <M3IconButton variant="filled" size="lg" icon={<Plus />} label="Large 48px" />
                <M3IconButton variant="filled" disabled icon={<Heart />} label="Disabled filled" />
                <M3IconButton variant="outlined" disabled icon={<Settings />} label="Disabled outlined" />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-3">
                G. Segmented Buttons (Single, Multi, Icon-Only, Compact & Disabled)
              </h3>
              <div className="space-y-3">
                <M3SegmentedButton
                  value={segSingle}
                  onChange={setSegSingle}
                  options={[
                    { value: 'experiments', label: 'Experiments', icon: <FlaskConical /> },
                    { value: 'schools', label: 'Schools', icon: <School /> },
                    { value: 'profile', label: 'Profile', icon: <User /> },
                  ]}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <M3SegmentedButton
                    multiSelect
                    density="compact"
                    value={segMulti}
                    onChange={setSegMulti}
                    options={[
                      { value: 'physics', label: 'Physics' },
                      { value: 'chemistry', label: 'Chemistry' },
                      { value: 'biology', label: 'Disabled Seg', disabled: true },
                    ]}
                  />
                  <M3SegmentedButton
                    density="compact"
                    showCheckmark={false}
                    value={segIconOnly}
                    onChange={setSegIconOnly}
                    options={[
                      { value: 'home', icon: <Home /> },
                      { value: 'labs', icon: <FlaskConical /> },
                      { value: 'schools', icon: <School /> },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CHIPS & BADGES */}
        <section className="rounded-[28px] bg-white p-6 sm:p-8 border border-[#dadce0] shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b57d0]">02 · Chips & Badges</span>
            <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
              Chips (Assist, Filter, Input, Suggestion + Elevated & Disabled) & Badges
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2.5">
                Assist Chips (Outlined, Elevated & Disabled)
              </h3>
              <div className="flex flex-wrap gap-2">
                <M3AssistChip leadingIcon={<Calendar />} label="Add to Lab Schedule" />
                <M3AssistChip elevated leadingIcon={<Sparkles />} label="AI Lab Assistant" />
                <M3AssistChip leadingIcon={<MapPin />} label="Disabled Outlined" disabled />
                <M3AssistChip elevated leadingIcon={<Sparkles />} label="Disabled Elevated" disabled />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2.5">
                Filter Chips (Outlined, Elevated, Selected ✓, Dropdown ▾ & Disabled)
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'cbse', label: 'CBSE Aligned' },
                  { id: 'hands-on', label: 'Hands-on Kit', elevated: true },
                  { id: 'class-10', label: 'Class 10', hasDropdown: true },
                ].map((c) => (
                  <M3FilterChip
                    key={c.id}
                    label={c.label}
                    elevated={c.elevated}
                    hasDropdown={c.hasDropdown}
                    selected={selectedChips.includes(c.id)}
                    onClick={() => toggleChip(c.id)}
                  />
                ))}
                <M3FilterChip label="Disabled Selected" selected disabled />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2.5">
                Input Chips (Avatar, Removable ×, Selected & Disabled)
              </h3>
              <div className="flex flex-wrap gap-2">
                {inputChips.map((chip) => (
                  <M3InputChip
                    key={chip}
                    avatar={chip[0]}
                    label={chip}
                    onRemove={() =>
                      setInputChips((prev) => prev.filter((item) => item !== chip))
                    }
                  />
                ))}
                <M3InputChip avatar="D" label="Disabled Input Chip" disabled />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2.5">
                Suggestion Chips & Badges (Dot, Number, 99+ Max, Status Colors)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <M3SuggestionChip label="Acid-Base Titration" />
                <M3SuggestionChip elevated label="Ohm's Law Circuit" />
                <M3SuggestionChip label="Disabled" disabled />
                <M3Badge variant="dot">
                  <span className="p-2 rounded-full bg-[#eef3fc]">
                    <Mail className="w-5 h-5 text-[#0b57d0]" />
                  </span>
                </M3Badge>
                <M3Badge variant="large" count={7} color="primary">
                  <span className="p-2 rounded-full bg-[#eef3fc]">
                    <Bell className="w-5 h-5 text-[#0b57d0]" />
                  </span>
                </M3Badge>
                <M3Badge variant="large" count={128} max={99} color="error">
                  <span className="p-2 rounded-full bg-[#eef3fc]">
                    <FlaskConical className="w-5 h-5 text-[#0b57d0]" />
                  </span>
                </M3Badge>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CARDS, CAROUSELS, LISTS & DIVIDERS */}
        <section className="rounded-[28px] bg-white p-6 sm:p-8 border border-[#dadce0] shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b57d0]">
              03 · Surfaces, Cards, Carousels, Lists & Dividers
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
              Cards (Elevated, Filled, Outlined · Horizontal · Selected · Draggable · Disabled)
            </h2>
          </div>

          {/* 3 Official Card Variants + Header Avatar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <M3Card
              variant="elevated"
              interactive
              headerAvatar="CS"
              headerTitle="Elevated Card with Header"
              headerSubtitle="Level 1 Surface + Shadow"
              title="Composite Skill Lab"
              subtitle="NEP 2020 CBSE Practical Kit"
              actions={
                <>
                  <M3Button variant="text" size="sm">Details</M3Button>
                  <M3Button variant="tonal" size="sm">Open</M3Button>
                </>
              }
            />

            <M3Card
              variant="filled"
              interactive
              selected={cardSelected}
              onClick={() => setCardSelected(!cardSelected)}
              title="Filled Selectable Card (Click)"
              subtitle="M3 Surface Highest (#e9eef6) + Selected Ring"
              actions={<M3Button variant="filled" size="sm">Selected State</M3Button>}
            >
              <p className="text-xs text-[#444746]">
                Click this card to toggle its Official M3 selected checkmark & ring.
              </p>
            </M3Card>

            <M3Card
              variant="outlined"
              interactive
              title="Outlined Card"
              subtitle="1px #c4c7c5 Outline"
              actions={<M3Button variant="outlined" size="sm">Compare</M3Button>}
            >
              <p className="text-xs text-[#444746]">
                Clean bordered surface ideal for dense grids and comparisons.
              </p>
            </M3Card>
          </div>

          {/* Horizontal Card, Draggable Card & Disabled Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <M3Card
              variant="outlined"
              orientation="horizontal"
              interactive
              headerAvatar="P"
              title="Horizontal Media Card"
              subtitle="Side-by-side M3 layout"
              mediaUrl="/images/categories/physics.jpg"
            />
            <M3Card
              variant="elevated"
              orientation="horizontal"
              draggableCard
              headerAvatar="D"
              title="Draggable Card (8dp)"
              subtitle="Level 4 Drag Elevation"
            />
            <M3Card
              variant="outlined"
              orientation="horizontal"
              disabled
              headerAvatar="X"
              title="Disabled Card State"
              subtitle="38% content opacity, non-interactive"
            />
          </div>

          {/* M3 Carousel */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-3">
              Carousels (Multi-Browse Horizontal Snap)
            </h3>
            <M3Carousel
              variant="multi-browse"
              items={[
                {
                  id: '1',
                  badge: 'Chemistry',
                  title: 'Microscale Acid-Base Titration',
                  subtitle: 'Class 11 · NEP 2020 Practical',
                  image: '/images/categories/chemistry.jpg',
                },
                {
                  id: '2',
                  badge: 'Physics',
                  title: 'Ohm’s Law & Resistance',
                  subtitle: 'Interactive Circuit Lab',
                  image: '/images/categories/physics.jpg',
                },
                {
                  id: '3',
                  badge: 'Biology',
                  title: 'Mitosis Cell Division',
                  subtitle: 'Microscope Virtual Slide',
                  image: '/images/categories/biology.jpg',
                },
                {
                  id: '4',
                  badge: 'Robotics',
                  title: 'ATL Arduino Sensor Kit',
                  subtitle: 'IoT & Tinkering',
                  image: '/images/categories/engineering.jpg',
                },
              ]}
            />
          </div>

          {/* M3 Lists & Dividers */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-3">
              Lists (1-Line, 2-Line, 3-Line, Expandable Accordion Item & Disabled Item) & Dividers
            </h3>
            <M3List>
              <M3ListItem
                lines={1}
                headline="One-Line List Item (56px height)"
                leading={<FlaskConical className="w-5 h-5 text-[#0b57d0]" />}
                trailing={<span>100%</span>}
              />
              <M3Divider variant="inset" />
              <M3ListItem
                lines={2}
                selected
                headline="Two-Line Selected List Item (72px height)"
                supportingText="Secondary supporting text with CBSE Composite Skill Lab details"
                leading={
                  <span className="h-10 w-10 rounded-full bg-[#c2e7ff] text-[#001d35] font-bold flex items-center justify-center">
                    CS
                  </span>
                }
                trailing={<Check className="w-5 h-5 text-[#0b57d0]" />}
              />
              <M3Divider variant="middle-inset" subhead="Expandable & Three-Line Items" />
              <M3ListItem
                lines={2}
                headline="Expandable List Item (Click to Expand)"
                supportingText="Includes collapsible apparatus & SOP details inside the list"
                leading={<Sparkles className="w-5 h-5 text-[#0b57d0]" />}
                expandableContent={
                  <div>
                    Expanded M3 list drawer content: 25ml Burette, Conical Flask, Phenolphthalein indicator, and safety goggles.
                  </div>
                }
              />
              <M3Divider />
              <M3ListItem
                lines={1}
                disabled
                headline="Disabled List Item (38% Opacity, Non-Interactive)"
                leading={<ShieldCheck className="w-5 h-5" />}
                trailing={<span>Locked</span>}
              />
            </M3List>
          </div>
        </section>

        {/* 4. NAVIGATION (TOP APP BAR, BOTTOM APP BAR, NAV BAR, NAV RAIL, NAV DRAWER, TABS) */}
        <section className="rounded-[28px] bg-white p-6 sm:p-8 border border-[#dadce0] shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b57d0]">
              04 · Navigation & App Bars
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
              Top App Bar (4 Sizes), Bottom App Bar, Navigation Bar, Navigation Rail, Drawer & Tabs
            </h2>
          </div>

          {/* Top App Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-[#e0e2e0]">
              <M3TopAppBar
                variant="center-aligned"
                title="Center-Aligned App Bar"
                elevated
                actions={
                  <>
                    <M3IconButton icon={<Search />} label="Search" />
                    <M3IconButton icon={<User />} label="Profile" />
                  </>
                }
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#e0e2e0]">
              <M3TopAppBar
                variant="small"
                title="Small App Bar"
                subtitle="With optional subtitle"
                actions={
                  <>
                    <M3IconButton icon={<Bell />} label="Alerts" />
                    <M3IconButton icon={<Settings />} label="Settings" />
                  </>
                }
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#e0e2e0]">
              <M3TopAppBar
                variant="medium"
                title="Medium Expanding Header (112px)"
                elevated
                actions={<M3IconButton icon={<Share2 />} label="Share" />}
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#e0e2e0]">
              <M3TopAppBar
                variant="large"
                title="Large Collapsing Header (152px)"
                actions={<M3IconButton icon={<Bookmark />} label="Save" />}
              />
            </div>
          </div>

          {/* Tabs: Primary (Stacked & Inline), Secondary & Scrollable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2">
                Primary Tabs (Stacked Icon + 3px Rounded Active Pill)
              </h3>
              <M3Tabs
                variant="primary"
                activeId={primaryTab}
                onChange={setPrimaryTab}
                tabs={[
                  { id: 'overview', label: 'Overview', icon: <Home /> },
                  { id: 'labs', label: 'Labs', icon: <FlaskConical />, badge: 4 },
                  { id: 'schools', label: 'Schools', icon: <School /> },
                  { id: 'disabled', label: 'Disabled', icon: <Settings />, disabled: true },
                ]}
              />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2">
                Secondary Scrollable Tabs (52px Start Offset + Full Underline)
              </h3>
              <M3Tabs
                variant="secondary"
                scrollable
                activeId={secondaryTab}
                onChange={setSecondaryTab}
                tabs={[
                  { id: 'all', label: 'All Experiments' },
                  { id: 'physics', label: 'Physics' },
                  { id: 'chemistry', label: 'Chemistry' },
                  { id: 'biology', label: 'Biology' },
                  { id: 'robotics', label: 'Robotics & AI' },
                ]}
              />
            </div>
          </div>

          {/* Bottom App Bar & Bottom Navigation Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2">
                Bottom App Bar (Actions + Docked FAB)
              </h3>
              <M3BottomAppBar
                actions={
                  <>
                    <M3IconButton icon={<Search />} label="Search" />
                    <M3IconButton icon={<Mail />} label="Mail" />
                    <M3IconButton icon={<Bookmark />} label="Bookmark" />
                    <M3IconButton icon={<Trash2 />} label="Delete" />
                  </>
                }
                fab={<M3FAB size="regular" color="secondary" lowered icon={<Plus />} />}
              />
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2">
                Navigation Bar (3–5 Destinations + Active Pill)
              </h3>
              <M3NavigationBar
                activeId={navBarActive}
                onSelect={setNavBarActive}
                items={[
                  { id: 'home', label: 'Home', icon: <Home /> },
                  { id: 'labs', label: 'Labs', icon: <FlaskConical />, badge: 8 },
                  { id: 'schools', label: 'Schools', icon: <School />, badge: 'dot' },
                  { id: 'profile', label: 'Profile', icon: <User /> },
                ]}
              />
            </div>
          </div>

          {/* Navigation Rail & Navigation Drawer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2">
                Navigation Rail (80px Vertical Rail + FAB)
              </h3>
              <div className="h-[360px] flex rounded-2xl overflow-hidden border border-[#e0e2e0] bg-white">
                <M3NavigationRail
                  activeId={railActive}
                  onSelect={setRailActive}
                  fab={<M3FAB size="regular" color="primary" icon={<Plus />} />}
                  items={[
                    { id: 'home', label: 'Home', icon: <Home /> },
                    { id: 'labs', label: 'Labs', icon: <FlaskConical />, badge: 3 },
                    { id: 'schools', label: 'Schools', icon: <School /> },
                    { id: 'settings', label: 'Settings', icon: <Settings /> },
                  ]}
                />
                <div className="flex-1 p-4 flex items-center justify-center text-xs text-[#444746]">
                  Active Rail Tab: <strong className="ml-1 text-[#0b57d0]">{railActive}</strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746]">
                  Navigation Drawer (Standard Coplanar & Modal Overlay)
                </h3>
                <M3Button
                  variant="tonal"
                  size="sm"
                  onClick={() => setModalDrawerOpen(true)}
                >
                  Open Modal Navigation Drawer
                </M3Button>
              </div>
              <M3NavigationDrawer
                variant="standard"
                header="CSEEL STEAM Platform"
                activeId={drawerActive}
                onSelect={setDrawerActive}
                sections={[
                  {
                    title: 'Experiential Learning',
                    items: [
                      { id: 'experiments', label: 'Hands-on Experiments', icon: <FlaskConical />, badge: '124' },
                      { id: 'simulations', label: '3D Simulations', icon: <Sparkles />, badge: '42' },
                      { id: 'schools', label: 'Schools Directory', icon: <School /> },
                    ],
                  },
                ]}
              />
            </div>
          </div>
        </section>

        {/* 5. INPUTS, SEARCH, CHECKBOXES, RADIO, SWITCHES, SLIDERS, DATE & TIME PICKERS */}
        <section className="rounded-[28px] bg-white p-6 sm:p-8 border border-[#dadce0] shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b57d0]">
              05 · Inputs, Selection & Pickers (All Variations & Disabled States)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
              Text Fields, Search, Checkboxes, Radio Buttons, Switches, Sliders (Single, Range, Centered), Date & Time Pickers
            </h2>
          </div>

          {/* Text Fields: Filled, Outlined, Prefix/Suffix, Error, Disabled, Multiline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <M3TextField
              variant="filled"
              label="Filled Text Field (Clearable)"
              defaultValue="Acid-Base Titration"
              leadingIcon={<FlaskConical />}
              clearable
              supportingText="M3 Filled container (#e9eef6)"
              maxLength={40}
              showCounter
            />
            <M3TextField
              variant="outlined"
              label="Outlined with Prefix & Suffix"
              defaultValue="2450"
              prefixText="₹"
              suffixText="/ kit"
              supportingText="Prefix & suffix text support"
            />
            <M3TextField
              variant="outlined"
              label="Error State Field"
              defaultValue="Invalid UDISE"
              error
              errorText="Please enter a valid 11-digit UDISE code"
            />
            <M3TextField
              variant="filled"
              label="Disabled Filled Field"
              defaultValue="Read-only disabled value"
              leadingIcon={<School />}
              supportingText="4% fill, 38% label/text"
              disabled
            />
            <M3TextField
              variant="outlined"
              label="Disabled Outlined Field"
              defaultValue="Disabled outlined value"
              supportingText="12% outline, 38% text"
              disabled
            />
            <M3TextField
              variant="outlined"
              multiline
              rows={2}
              label="Multiline Textarea Field"
              defaultValue="Record your titration burette readings here..."
            />
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2">
              Search Bar & Expandable Search View
            </h3>
            <M3Search avatar="DK" />
          </div>

          <M3Divider />

          {/* Checkboxes, Radio, Switches, Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2">
                Checkboxes (Checked, Unchecked, Indeterminate, Error, Disabled)
              </h3>
              <div className="flex flex-col gap-0.5">
                <M3Checkbox checked={chk1} onChange={setChk1} label="Checked M3 Checkbox" />
                <M3Checkbox checked={chk2} onChange={setChk2} label="Unchecked M3 Checkbox" />
                <M3Checkbox checked="indeterminate" label="Indeterminate (-)" />
                <M3Checkbox checked={true} error label="Error State Checkbox" />
                <M3Checkbox checked={true} disabled label="Disabled Checked (38%)" />
                <M3Checkbox checked={false} disabled label="Disabled Unchecked (38%)" />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2">
                Radio Buttons & Switches (Active, Error & Disabled)
              </h3>
              <M3RadioGroup
                value={radioVal}
                onChange={setRadioVal}
                options={[
                  { value: 'cbse', label: 'CBSE Curriculum' },
                  { value: 'icse', label: 'ICSE Board' },
                  { value: 'disabled', label: 'Disabled Option (38%)', disabled: true },
                ]}
              />
              <div className="mt-3 flex flex-col gap-2">
                <M3Switch checked={sw1} onChange={setSw1} withIcons label="Switch with Thumb Icons (✓/×)" />
                <M3Switch checked={sw2} onChange={setSw2} withIcons={false} label="Standard Switch (16px → 24px)" />
                <M3Switch checked={true} onChange={() => {}} disabled label="Disabled Selected Switch" />
                <M3Switch checked={false} onChange={() => {}} disabled label="Disabled Unselected Switch" />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-2">
                Sliders (Continuous, Discrete, Range 2-Thumb, Centered & Disabled)
              </h3>
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-[#444746]">Continuous & Discrete:</div>
                <M3Slider value={sliderContinuous} onChange={setSliderContinuous} />
                <M3Slider value={sliderDiscrete} min={0} max={100} step={20} discrete onChange={setSliderDiscrete} />
                <div className="text-[11px] font-semibold text-[#444746]">Dual-Thumb Range Slider:</div>
                <M3RangeSlider value={sliderRange} onChange={setSliderRange} />
                <div className="text-[11px] font-semibold text-[#444746]">Centered & Disabled:</div>
                <M3Slider value={sliderCentered} centered onChange={setSliderCentered} />
                <M3Slider value={50} disabled onChange={() => {}} />
              </div>
            </div>
          </div>

          <M3Divider />

          {/* Date Picker (Docked, Range, Input) & Time Picker (12H, 24H, Input) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-3">
                Date Picker (Single Date, Date Range Strip & Keyboard Input Toggle)
              </h3>
              <M3DatePicker variant="range" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-3">
                Time Picker (12H / 24H Clock Dial + Keyboard Input Mode Toggle)
              </h3>
              <M3TimePicker />
            </div>
          </div>
        </section>

        {/* 6. OVERLAYS, DIALOGS, SHEETS, MENUS, PROGRESS, SNACKBARS & TOOLTIPS */}
        <section className="rounded-[28px] bg-white p-6 sm:p-8 border border-[#dadce0] shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b57d0]">
              06 · Overlays, Sheets, Dialogs, Menus & Feedback
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
              Sheets (Left, Right, Top, Bottom · Modal, Standard Coplanar & Detached), Dialogs, Menus & Progress
            </h2>
          </div>

          {/* Interactive Overlay Triggers */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-3">
              Live Interactive Sheets, Drawers, Dialogs & Snackbars (Click to Test)
            </h3>
            <div className="flex flex-wrap gap-3">
              <M3Button variant="filled" onClick={() => setBottomSheetOpen(true)}>
                Open Bottom Sheet
              </M3Button>
              <M3Button variant="tonal" onClick={() => setSideSheetOpen(true)}>
                Open Right Side Sheet
              </M3Button>
              <M3Button variant="tonal" onClick={() => setDetachedSheetOpen(true)}>
                Open Detached Floating Sheet
              </M3Button>
              <M3Button variant="tonal" onClick={() => setModalDrawerOpen(true)}>
                Open Left Drawer
              </M3Button>
              <M3Button variant="tonal" onClick={() => setTopSheetOpen(true)}>
                Open Top Sheet
              </M3Button>
              <M3Button variant="outlined" onClick={() => setDialogVariant('basic')}>
                Open Basic Dialog
              </M3Button>
              <M3Button variant="outlined" onClick={() => setDialogVariant('alert')}>
                Open Alert Dialog (Hero Icon)
              </M3Button>
              <M3Button variant="outlined" onClick={() => setDialogVariant('full-screen')}>
                Open Full-Screen Dialog
              </M3Button>
              <M3Button
                variant="elevated"
                onClick={() => setLiveToast('Experiment saved to your lab notebook!')}
              >
                Trigger Live M3 Snackbar
              </M3Button>
            </div>
          </div>

          <M3Divider />

          {/* Menus & Progress Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-3">
                Menus (Outlined Select, Filled Select & Dropdown Action Menu)
              </h3>
              <div className="flex flex-wrap gap-4 items-start">
                <M3Menu
                  variant="exposed-dropdown"
                  fieldStyle="outlined"
                  label="Subject (Outlined)"
                  selectedId={menuSelected}
                  onSelect={setMenuSelected}
                  items={[
                    { id: 'physics', label: 'Physics Lab', leadingIcon: <Sparkles />, trailingText: '42' },
                    { id: 'chemistry', label: 'Chemistry Lab', leadingIcon: <FlaskConical />, trailingText: '38', dividerAfter: true },
                    { id: 'schools', label: 'Composite Skill Lab', leadingIcon: <School />, trailingText: 'CBSE' },
                  ]}
                />
                <M3Menu
                  variant="exposed-dropdown"
                  fieldStyle="filled"
                  label="Subject (Filled)"
                  selectedId={menuSelected}
                  onSelect={setMenuSelected}
                  items={[
                    { id: 'physics', label: 'Physics Lab', leadingIcon: <Sparkles /> },
                    { id: 'chemistry', label: 'Chemistry Lab', leadingIcon: <FlaskConical /> },
                  ]}
                />
                <M3Menu
                  variant="dropdown"
                  label="Menu + Submenu (<md-sub-menu>)"
                  items={[
                    { id: 'edit', label: 'Edit Experiment', leadingIcon: <Edit3 />, trailingText: 'Ctrl+E' },
                    {
                      id: 'export',
                      label: 'Export Lab Manual',
                      leadingIcon: <Download />,
                      subItems: [
                        { id: 'pdf', label: 'Export as CBSE PDF', trailingText: '.pdf' },
                        { id: 'json', label: 'Export JSON Schema', trailingText: '.json' },
                      ],
                    },
                    { id: 'copy', label: 'Duplicate Setup', leadingIcon: <Copy />, trailingText: 'Ctrl+D', dividerAfter: true },
                    { id: 'delete', label: 'Archive (Disabled)', leadingIcon: <Trash2 />, disabled: true },
                  ]}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-3">
                Progress Indicators (Determinate, Buffer, Indeterminate, 4-Color & Circular %)
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] text-[#444746]">Determinate (72%):</span>
                  <M3LinearProgress value={72} />
                </div>
                <div>
                  <span className="text-[11px] text-[#444746]">Buffer (55% value / 82% buffer):</span>
                  <M3LinearProgress value={55} bufferValue={82} />
                </div>
                <div>
                  <span className="text-[11px] text-[#444746]">Google 4-Color Indeterminate (&lt;md-linear-progress four-color&gt;):</span>
                  <M3LinearProgress indeterminate fourColor />
                </div>
                <div className="flex items-center gap-6 pt-1">
                  <M3CircularProgress indeterminate />
                  <M3CircularProgress indeterminate fourColor />
                  <M3CircularProgress indeterminate={false} value={75} showLabel />
                </div>
              </div>
            </div>
          </div>

          <M3Divider />

          {/* Tooltips & Snackbars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-3">
                Tooltips (Plain & Rich M3 Tooltip)
              </h3>
              <div className="space-y-3">
                <M3TooltipPreview variant="plain" text="Plain Tooltip: Save to Lab Notebook" />
                <M3TooltipPreview
                  variant="rich"
                  title="Composite Skill Lab (NEP 2020)"
                  text="All CBSE affiliated schools are mandated to establish a Composite Skill Lab with hands-on STEAM kits."
                  actionLabel="Learn more"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-3">
                Snackbars (Single-Line & Two-Line with Action & Close)
              </h3>
              <div className="space-y-3">
                <M3SnackbarBox
                  message="3 apparatus items added to kit cart."
                  actionLabel="Undo"
                  showClose
                />
                <M3SnackbarBox
                  twoLine
                  message="Your observation table readings have been synced with the school teacher portal."
                  actionLabel="View Report"
                  showClose
                />
              </div>
            </div>
          </div>
        </section>

        {/* 7. ELEVATION (SURFACES & SHADOWS) & RIPPLE / STATE LAYERS */}
        <section className="rounded-[28px] bg-white p-6 sm:p-8 border border-[#dadce0] shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b57d0]">
              07 · Foundations
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
              Elevation (Levels 0–5 Surfaces & Shadows) & Ripple / State Layers
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {([0, 1, 2, 3, 4, 5] as M3ElevationLevel[]).map((lvl) => (
              <M3Surface
                key={lvl}
                level={lvl}
                rounded="lg"
                className="p-4 h-28 flex flex-col justify-between border border-[#e0e2e0]/60"
              >
                <span className="text-xs font-bold text-[#0b57d0]">
                  {M3_ELEVATION_STYLES[lvl].dp}
                </span>
                <div>
                  <div className="text-sm font-bold text-[#1f1f1f]">Level {lvl}</div>
                  <div className="text-[11px] text-[#444746]">
                    {M3_ELEVATION_STYLES[lvl].label}
                  </div>
                </div>
              </M3Surface>
            ))}
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#444746] mb-3">
              Interactive Ripple / State Layers (Click any box to trigger M3 Ripple)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <M3StateLayer
                color="primary"
                className="rounded-2xl border border-[#c4c7c5] p-5 text-center font-semibold text-sm text-[#0b57d0]"
              >
                Primary State Layer (8% / 12%)
              </M3StateLayer>
              <M3StateLayer
                color="surface"
                className="rounded-2xl border border-[#c4c7c5] bg-[#f8fafd] p-5 text-center font-semibold text-sm text-[#1f1f1f]"
              >
                On-Surface State Layer
              </M3StateLayer>
              <M3StateLayer
                color="on-primary"
                className="rounded-2xl bg-[#0b57d0] p-5 text-center font-semibold text-sm text-white"
              >
                On-Primary State Layer
              </M3StateLayer>
              <M3StateLayer
                color="error"
                className="rounded-2xl border border-[#b3261e]/40 bg-[#fce8e6] p-5 text-center font-semibold text-sm text-[#b3261e]"
              >
                Error State Layer
              </M3StateLayer>
            </div>
          </div>
        </section>
      </div>

      {/* Live Overlays */}
      <M3NavigationDrawer
        variant="modal"
        open={modalDrawerOpen}
        onClose={() => setModalDrawerOpen(false)}
        header="CSEEL Navigation"
        activeId={drawerActive}
        onSelect={setDrawerActive}
        sections={[
          {
            title: 'Main Menu',
            items: [
              { id: 'experiments', label: 'Hands-on Experiments', icon: <FlaskConical />, badge: '124' },
              { id: 'simulations', label: '3D Simulations', icon: <Sparkles />, badge: '42' },
              { id: 'schools', label: 'Schools Directory', icon: <School /> },
            ],
          },
        ]}
      />

      <M3TopSheet
        open={topSheetOpen}
        onClose={() => setTopSheetOpen(false)}
        title="Global Search & Command (M3 Top Sheet)"
        subtitle="Slides down from top with 28px bottom border-radius"
      >
        <M3Search placeholder="Search across all 124 hands-on experiments and CBSE labs..." />
      </M3TopSheet>

      <M3Sheet
        side="right"
        mode="modal"
        detached
        open={detachedSheetOpen}
        onClose={() => setDetachedSheetOpen(false)}
        title="Detached Floating Side Sheet"
        subtitle="16px margin from viewport edges · 28px all-corner radius"
        footer={
          <M3Button variant="filled" fullWidth onClick={() => setDetachedSheetOpen(false)}>
            Done
          </M3Button>
        }
      >
        <p className="text-sm text-[#444746]">
          Material Design 3 supports both flush edge-attached side sheets and detached floating side sheets with 28px corners on all four sides.
        </p>
      </M3Sheet>

      <GoogleBottomSheet
        open={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        badgeText="M3 Bottom Sheet"
        title="Draggable Material 3 Bottom Sheet"
        footer={
          <div className="flex justify-end gap-2">
            <M3Button variant="text" onClick={() => setBottomSheetOpen(false)}>
              Cancel
            </M3Button>
            <M3Button variant="filled" onClick={() => setBottomSheetOpen(false)}>
              Confirm Action
            </M3Button>
          </div>
        }
      >
        <div className="p-6 space-y-3 text-sm text-[#444746]">
          <p>
            Yeh official <strong>Google Material Design 3 Bottom Sheet</strong> hai. Isko aap top drag pill se upar drag karke Full (`95dvh`) ya niche drag karke close kar sakte ho.
          </p>
        </div>
      </GoogleBottomSheet>

      <GoogleSideDrawer
        open={sideSheetOpen}
        onClose={() => setSideSheetOpen(false)}
        side="right"
        title="Filter & Sort (M3 Side Sheet)"
        subtitle="28px rounded corner M3 side sheet"
        footer={
          <div className="flex gap-2">
            <M3Button variant="outlined" className="flex-1" onClick={() => setSideSheetOpen(false)}>
              Reset
            </M3Button>
            <M3Button variant="filled" className="flex-1" onClick={() => setSideSheetOpen(false)}>
              Apply Filters
            </M3Button>
          </div>
        }
      >
        <div className="space-y-4">
          <M3Checkbox checked label="CBSE Aligned Labs" />
          <M3Checkbox checked label="With 3D Simulation" />
          <M3Checkbox label="Requires Kit Materials" />
        </div>
      </GoogleSideDrawer>

      <GoogleDialog
        open={dialogVariant !== null}
        onClose={() => setDialogVariant(null)}
        variant={dialogVariant || 'basic'}
        heroIcon={dialogVariant === 'alert' ? <ShieldCheck /> : undefined}
        title={
          dialogVariant === 'alert'
            ? 'Submit Lab Observation?'
            : dialogVariant === 'full-screen'
            ? 'Full-Screen M3 Dialog'
            : 'Basic Material 3 Dialog'
        }
        description="Material Design 3 dialogs use a 28px border-radius, #eef3fc tonal surface container, and pill action buttons."
        footer={
          <>
            <M3Button variant="text" onClick={() => setDialogVariant(null)}>
              Cancel
            </M3Button>
            <M3Button variant="filled" onClick={() => setDialogVariant(null)}>
              Confirm
            </M3Button>
          </>
        }
      >
        {dialogVariant === 'full-screen' && (
          <div className="max-w-xl mx-auto space-y-4">
            <M3TextField label="Experiment Title" defaultValue="Acid-Base Titration" />
            <M3TextField label="Student Name" defaultValue="Devender Kaushik" />
          </div>
        )}
      </GoogleDialog>

      <GoogleSnackbar
        message={liveToast}
        variant="default"
        actionLabel="Undo"
        onAction={() => setLiveToast(null)}
        onClose={() => setLiveToast(null)}
      />
    </div>
  );
}
