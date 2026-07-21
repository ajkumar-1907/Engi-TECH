import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkSimple, ArrowLeft, CheckCircle } from '@phosphor-icons/react';
import { useAuth } from '../contexts/AuthContext';
import { useInView } from 'react-intersection-observer';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const branchColors = {
  mechanical: '#002FA7',
  electrical: '#FF3B30',
  civil: '#FFD60A',
  electronics: '#28A745'
};

const EquipmentDetailPage = () => {
  const { branch, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeSection, setActiveSection] = useState('definition');

  useEffect(() => {
    fetchEquipment();
    if (user) {
      setBookmarks(user.bookmarks || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/equipment/${id}`, { withCredentials: true });
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
    setLoading(false);
  };

  const toggleBookmark = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await axios.post(`${API_URL}/api/bookmarks/${id}`, {}, { withCredentials: true });
      setBookmarks(data.bookmarks);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-primary border-t-transparent"
        />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="border-2 border-border p-6 sm:p-8 rounded-none">
          <p className="text-base sm:text-lg font-medium mb-4 text-foreground">Equipment not found</p>
          <button
            onClick={() => navigate(`/equipment/${branch}`)}
            className="text-sm text-primary hover:underline"
          >
            &larr; Back to list
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'definition', label: 'Definition', content: equipment.definition },
    { id: 'principle', label: 'Principle', content: equipment.working_principle },
    { id: 'parts', label: 'Parts', content: equipment.main_parts },
    { id: 'applications', label: 'Uses', content: equipment.applications },
    { id: 'notes', label: 'Exam Notes', content: equipment.exam_notes }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b-2 border-border bg-card sticky top-[49px] sm:top-[57px] z-40 blueprint-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate(`/equipment/${branch}`)}
            className="text-xs sm:text-sm font-mono uppercase tracking-wider text-primary hover:underline mb-3 sm:mb-4 flex items-center gap-2"
            data-testid="back-to-list-button"
          >
            <ArrowLeft size={14} weight="bold" />
            Back to {branch} equipment
          </motion.button>
          
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3"
              >
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] font-bold border px-2 py-1" style={{ color: branchColors[branch], borderColor: branchColors[branch] }}>
                  Year {equipment.year} &bull; Semester {equipment.semester}
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tighter font-medium text-foreground font-display"
                data-testid="equipment-title"
              >
                {equipment.name}
              </motion.h1>
            </div>
            
            {user && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleBookmark}
                className="p-2 sm:p-3 border-2 border-border rounded-none hover:bg-muted transition-colors shrink-0"
                style={{ color: branchColors[branch] }}
                data-testid="equipment-bookmark-button"
              >
                {bookmarks.includes(id) ? (
                  <Bookmark size={24} weight="fill" />
                ) : (
                  <BookmarkSimple size={24} weight="regular" />
                )}
              </motion.button>
            )}
          </div>

          {/* Section Navigation - scrollable on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 sm:mt-6 flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
          >
            {sections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(section.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-medium rounded-none border-2 transition-colors whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                {section.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Equipment Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Image Section */}
          {equipment.image_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-1"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="reg-corners border-2 border-border rounded-none overflow-hidden lg:sticky lg:top-48 relative"
              >
                <span className="reg-tr" />
                <span className="reg-bl" />
                <div className="relative">
                  <img
                    src={equipment.image_url}
                    alt={equipment.name}
                    className="w-full h-auto object-cover grayscale"
                  />
                </div>
                <div className="p-3 sm:p-4 bg-surface border-t-2 border-border">
                  <p className="text-xs font-mono uppercase tracking-wider text-secondary">Fig. 01 &mdash; Equipment Image</p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Content Sections */}
          <div className={`${equipment.image_url ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4 sm:space-y-6`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeSection === 'definition' && (
                  <SectionCard title="Definition" color={branchColors[branch]} dataTestId="definition-section">
                    <p className="text-sm sm:text-base leading-relaxed text-foreground">{equipment.definition}</p>
                  </SectionCard>
                )}

                {activeSection === 'principle' && (
                  <SectionCard title="Working Principle" color={branchColors[branch]} dataTestId="working-principle-section">
                    <p className="text-sm sm:text-base leading-relaxed text-foreground">{equipment.working_principle}</p>
                  </SectionCard>
                )}

                {activeSection === 'parts' && (
                  <SectionCard title="Main Parts" color={branchColors[branch]} dataTestId="main-parts-section">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {equipment.main_parts.map((part, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-border rounded-none hover:border-primary transition-colors"
                        >
                          <CheckCircle size={18} weight="fill" style={{ color: branchColors[branch] }} className="shrink-0" />
                          <span className="text-sm sm:text-base text-foreground">{part}</span>
                        </motion.div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {activeSection === 'applications' && (
                  <SectionCard title="Applications" color={branchColors[branch]} dataTestId="applications-section">
                    <div className="space-y-2 sm:space-y-3">
                      {equipment.applications.map((app, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 5 }}
                          className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 border border-border rounded-none hover:border-primary hover:bg-muted transition-all"
                        >
                          <div className="mt-1.5 shrink-0">
                            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: branchColors[branch] }} />
                          </div>
                          <span className="text-sm sm:text-base text-foreground flex-1">{app}</span>
                        </motion.div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {activeSection === 'notes' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border-2 border-border rounded-none p-4 sm:p-8 bg-accent"
                    data-testid="exam-notes-section"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <h3 className="text-lg sm:text-xl font-medium text-accent-foreground">Exam Notes</h3>
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-accent-foreground font-medium">
                      {equipment.exam_notes}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ title, color, children, dataTestId }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      className="border-2 border-border rounded-none p-4 sm:p-8 bg-card"
      data-testid={dataTestId}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <motion.div
          className="h-1 w-8 sm:w-12"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: 48 } : {}}
          transition={{ duration: 0.8 }}
        />
        <h3 className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] font-bold" style={{ color }}>
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  );
};

export default EquipmentDetailPage;
