import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gear, Lightning, Buildings, Cpu, ArrowRight, Compass } from '@phosphor-icons/react';
import { useInView } from 'react-intersection-observer';
import GearAnimation from '../components/AnimatedSVG/GearAnimation';
import CircuitAnimation from '../components/AnimatedSVG/CircuitAnimation';
import WaveAnimation from '../components/AnimatedSVG/WaveAnimation';
import BlueprintAnimation from '../components/AnimatedSVG/BlueprintAnimation';

const branches = [
  {
    id: 'mechanical',
    code: 'BR-01 / ME',
    name: 'Mechanical Engineering',
    icon: Gear,
    color: '#0F5FE0',
    image: 'https://images.pexels.com/photos/19658259/pexels-photo-19658259.jpeg',
    SVGComponent: GearAnimation,
    count: '21'
  },
  {
    id: 'electrical',
    code: 'BR-02 / EE',
    name: 'Electrical Engineering',
    icon: Lightning,
    color: '#E0432C',
    image: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg',
    SVGComponent: CircuitAnimation,
    count: '21'
  },
  {
    id: 'civil',
    code: 'BR-03 / CE',
    name: 'Civil Engineering',
    icon: Buildings,
    color: '#D69200',
    image: 'https://images.pexels.com/photos/8470842/pexels-photo-8470842.jpeg',
    SVGComponent: BlueprintAnimation,
    count: '21'
  },
  {
    id: 'electronics',
    code: 'BR-04 / EC',
    name: 'Electronics Engineering',
    icon: Cpu,
    color: '#1D9A4C',
    image: 'https://images.pexels.com/photos/7286016/pexels-photo-7286016.jpeg',
    SVGComponent: WaveAnimation,
    count: '20'
  }
];

const features = [
  {
    tag: 'ORG',
    title: 'Year-wise Organization',
    desc: 'Every machine is filed by B.Tech year (1\u20134) and semester (1\u20138), so you find what your syllabus actually covers.'
  },
  {
    tag: 'DAT',
    title: 'Comprehensive Datasheets',
    desc: 'Definition, working principle, main parts, applications, and exam-focused notes for each piece of equipment.'
  },
  {
    tag: 'NAV',
    title: 'Search & Bookmark',
    desc: 'Fast search across all branches, plus one-tap bookmarking so revision material stays within reach.'
  }
];

const FloatingElement = ({ delay = 0, children }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
  >
    {children}
  </motion.div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [heroRef, heroInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 }
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="border-b border-border relative z-10 blueprint-grid overflow-hidden"
      >
        {/* Ambient floating drafting glyphs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingElement delay={0}>
            <div className="absolute top-16 right-6 sm:right-16 opacity-[0.07]">
              <GearAnimation size={180} color="currentColor" />
            </div>
          </FloatingElement>
          <FloatingElement delay={1.2}>
            <div className="absolute bottom-10 left-4 sm:left-10 opacity-[0.06]">
              <CircuitAnimation size={140} color="currentColor" />
            </div>
          </FloatingElement>
        </div>

        {/* Corner registration crosshairs */}
        <svg className="absolute top-6 left-6 hidden sm:block opacity-40 crosshair-pulse" width="28" height="28" viewBox="0 0 28 28">
          <line x1="14" y1="0" x2="14" y2="28" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="0" y1="14" x2="28" y2="14" stroke="hsl(var(--primary))" strokeWidth="1" />
          <circle cx="14" cy="14" r="6" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28 relative">
          <div className="max-w-4xl">
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5 sm:mb-7"
            >
              <p className="dim-line text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] font-bold text-primary" data-testid="hero-label">
                Engineering Reference Platform
              </p>
              <span className="text-xs text-secondary hidden sm:inline">&#8226;</span>
              <p className="text-[10px] sm:text-xs font-mono text-secondary">
                Dwg. by <span className="font-bold text-foreground">Anuj Kumar</span>
              </p>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter font-medium text-foreground mb-5 sm:mb-7 font-display"
              data-testid="hero-title"
            >
              Master{' '}
              <motion.span
                className="inline-block text-primary relative"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                Core
              </motion.span>{' '}
              Engineering Equipment &amp; Machines
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base sm:leading-relaxed text-secondary max-w-2xl mb-8 sm:mb-10"
              data-testid="hero-description"
            >
              Complete 4-year B.Tech reference guide for Mechanical, Electrical, Civil, and Electronics engineering students.
              83+ equipment with year-wise categorization, working principles, and exam-focused notes.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ x: 4, y: -4, boxShadow: '8px 8px 0px hsl(var(--foreground))' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/login')}
                className="bg-primary text-primary-foreground px-7 sm:px-9 py-3.5 sm:py-4 border-2 border-foreground font-medium text-base sm:text-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                data-testid="get-started-button"
              >
                Get Started
                <ArrowRight size={18} weight="bold" />
              </motion.button>
              <div className="flex items-center gap-2 text-xs font-mono text-secondary uppercase tracking-wider">
                <Compass size={16} weight="bold" className="text-primary" />
                No cost &middot; Built for students
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Readout Strip */}
      <motion.div
        ref={statsRef}
        initial="hidden"
        animate={statsInView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="border-b border-border bg-surface"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 divide-border md:divide-x border-2 border-border bg-card">
            {[
              { label: 'Equipment', value: '83+', icon: <Gear size={22} weight="bold" /> },
              { label: 'Branches', value: '04', icon: <Lightning size={22} weight="bold" /> },
              { label: 'Years Covered', value: '1\u20134', icon: <Buildings size={22} weight="bold" /> },
              { label: 'Semesters', value: '08', icon: <Cpu size={22} weight="bold" /> }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ backgroundColor: 'hsl(var(--muted))' }}
                className={`p-5 sm:p-6 relative ${idx % 2 === 1 ? 'border-l sm:border-l-0 border-border' : ''}`}
                data-testid={`stat-${stat.label}`}
              >
                <div className="text-primary mb-2 sm:mb-3">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-medium text-foreground mb-1 sm:mb-2 font-mono">{stat.value}</div>
                <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Branch Selection Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <p className="dim-line text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] font-bold text-primary mb-3">
            Select a Discipline
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl tracking-tight font-medium text-foreground mb-3 sm:mb-4 font-display" data-testid="branches-title">
            Select Your Branch
          </h2>
          <p className="text-sm sm:text-base text-secondary max-w-xl">Explore equipment organized by year and semester &mdash; each branch is its own datasheet library.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8"
        >
          {branches.map((branch, idx) => {
            const Icon = branch.icon;
            const SVGComp = branch.SVGComponent;
            return (
              <motion.div
                key={branch.id}
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  boxShadow: '8px 8px 0px hsl(var(--foreground))',
                  transition: { duration: 0.25 }
                }}
                onClick={() => navigate(`/equipment/${branch.id}`)}
                className="reg-corners bg-card border-2 border-border overflow-hidden cursor-pointer group relative"
                data-testid={`branch-${branch.id}-card`}
              >
                <span className="reg-tr" />
                <span className="reg-bl" />

                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <SVGComp size={56} color={branch.color} />
                </div>

                <motion.div
                  className="h-40 sm:h-56 overflow-hidden border-b-2 border-border relative"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 left-3">
                    <span
                      className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 bg-background/90 border"
                      style={{ color: branch.color, borderColor: branch.color }}
                    >
                      {branch.code}
                    </span>
                  </div>
                </motion.div>

                <div className="p-5 sm:p-8">
                  <div className="flex items-start justify-between mb-4 sm:mb-5">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl md:text-2xl tracking-tight font-medium text-foreground mb-1.5 group-hover:text-primary transition-colors font-display">
                        {branch.name}
                      </h3>
                      <div className="text-[11px] sm:text-xs font-mono text-secondary">
                        {branch.count} machines catalogued
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 90, scale: 1.15 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="ml-2 shrink-0"
                    >
                      <Icon size={32} weight="bold" style={{ color: branch.color }} className="sm:w-9 sm:h-9" />
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-dashed border-border">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '55%' }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-[3px]"
                      style={{ backgroundColor: branch.color }}
                    />
                    <span
                      className="text-xs font-mono font-medium flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                      style={{ color: branch.color }}
                    >
                      View Spec <ArrowRight size={14} weight="bold" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Features Section — spec-sheet table */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="border-t-2 border-border bg-surface py-14 sm:py-24 blueprint-dot-grid"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
            <p className="dim-line text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] font-bold text-primary mb-3">
              Platform Specification
            </p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl tracking-tight font-medium text-foreground font-display">
              Everything You Need
            </h3>
          </motion.div>

          <div className="border-2 border-border bg-card divide-y divide-border">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ backgroundColor: 'hsl(var(--muted))' }}
                className="grid grid-cols-1 sm:grid-cols-[auto_auto_1fr] gap-3 sm:gap-6 p-5 sm:p-8 items-start sm:items-center transition-colors"
              >
                <div className="text-[10px] font-mono font-bold text-primary bg-primary/10 border border-primary/30 px-2 py-1 w-fit">
                  {feature.tag}
                </div>
                <h4 className="text-base sm:text-lg font-medium text-foreground sm:w-64 font-display">{feature.title}</h4>
                <p className="text-sm sm:text-base text-secondary leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
