import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, Bookmark, BookmarkSimple, Funnel, X } from '@phosphor-icons/react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { useInView } from 'react-intersection-observer';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const branchNames = {
  mechanical: 'Mechanical Engineering',
  electrical: 'Electrical Engineering',
  civil: 'Civil Engineering',
  electronics: 'Electronics Engineering'
};

const branchColors = {
  mechanical: '#002FA7',
  electrical: '#FF3B30',
  civil: '#FFD60A',
  electronics: '#28A745'
};

const EquipmentListPage = () => {
  const { branch } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEquipment();
    if (user) {
      setBookmarks(user.bookmarks || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch, user, selectedYear, selectedSemester]);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const params = { branch };
      if (selectedYear !== 'all') params.year = parseInt(selectedYear);
      if (selectedSemester !== 'all') params.semester = parseInt(selectedSemester);
      const { data } = await axios.get(`${API_URL}/api/equipment`, { params, withCredentials: true });
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!search.trim()) { fetchEquipment(); return; }
    setLoading(true);
    try {
      const params = { branch, search };
      if (selectedYear !== 'all') params.year = parseInt(selectedYear);
      if (selectedSemester !== 'all') params.semester = parseInt(selectedSemester);
      const { data } = await axios.get(`${API_URL}/api/equipment`, { params, withCredentials: true });
      setEquipment(data);
    } catch (error) {
      console.error('Error searching equipment:', error);
    }
    setLoading(false);
  };

  const toggleBookmark = async (equipmentId) => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await axios.post(`${API_URL}/api/bookmarks/${equipmentId}`, {}, { withCredentials: true });
      setBookmarks(data.bookmarks);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const clearFilters = () => {
    setSelectedYear('all');
    setSelectedSemester('all');
    setSearch('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const groupedByYear = equipment.reduce((acc, item) => {
    const year = item.year || 'Unknown';
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b-2 border-border relative overflow-hidden blueprint-grid">
        <motion.div
          className="absolute bottom-0 left-0 h-1"
          style={{ backgroundColor: branchColors[branch] }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate('/')}
            className="text-xs sm:text-sm font-mono uppercase tracking-wider text-primary hover:underline mb-4 sm:mb-6 flex items-center gap-2"
            data-testid="back-button"
          >
            &larr; Back to Branches
          </motion.button>

          <span
            className="inline-block text-[10px] font-mono font-bold uppercase tracking-[0.25em] px-2 py-1 border mb-3"
            style={{ color: branchColors[branch], borderColor: branchColors[branch] }}
          >
            {branch}
          </span>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter font-medium text-foreground mb-3 sm:mb-6 font-display"
            data-testid="branch-title"
          >
            {branchNames[branch]}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-lg text-secondary mb-4 sm:mb-6 font-mono"
          >
            {equipment.length} equipment available
          </motion.p>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex-1 flex gap-2 sm:gap-3">
                <Input
                  type="text"
                  placeholder="Search equipment..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="rounded-none border-2 border-border focus:border-primary"
                  data-testid="search-input"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 sm:px-6 py-2 border-2 border-primary rounded-none font-medium shrink-0"
                  data-testid="search-button"
                >
                  <MagnifyingGlass size={20} weight="bold" />
                </motion.button>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="bg-card border-2 border-border px-4 sm:px-6 py-2 rounded-none font-mono text-xs uppercase tracking-wider font-medium hover:bg-muted transition-colors flex items-center gap-2 justify-center text-foreground"
                data-testid="filter-button"
              >
                <Funnel size={18} weight="bold" />
                Filters
              </motion.button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-2 border-border rounded-none p-4 sm:p-6 bg-card">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-medium text-foreground">Filter Equipment</h3>
                      {(selectedYear !== 'all' || selectedSemester !== 'all') && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={clearFilters}
                          className="text-sm text-destructive hover:underline flex items-center gap-2"
                        >
                          <X size={16} /> Clear All
                        </motion.button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-sm font-medium text-primary mb-2 block">YEAR</label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                          <SelectTrigger className="rounded-none border-2" data-testid="year-filter">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-2 border-border">
                            <SelectItem value="all">All Years</SelectItem>
                            <SelectItem value="1">1st Year</SelectItem>
                            <SelectItem value="2">2nd Year</SelectItem>
                            <SelectItem value="3">3rd Year</SelectItem>
                            <SelectItem value="4">4th Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-primary mb-2 block">SEMESTER</label>
                        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                          <SelectTrigger className="rounded-none border-2" data-testid="semester-filter">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-2 border-border">
                            <SelectItem value="all">All Semesters</SelectItem>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                              <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {loading ? (
          <div className="text-center py-12" data-testid="loading-state">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-primary border-t-transparent rounded-none" />
            </motion.div>
            <p className="text-base sm:text-lg font-medium mt-4 text-foreground">Loading equipment...</p>
          </div>
        ) : equipment.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 border-2 border-border rounded-none p-6 sm:p-8"
            data-testid="no-equipment"
          >
            <p className="text-base sm:text-lg font-medium mb-2 text-foreground">No equipment found</p>
            <p className="text-sm sm:text-base text-secondary mb-4">Try adjusting your search or filters</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={clearFilters}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-none border-2 border-border"
            >
              Clear Filters
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-8 sm:space-y-12">
            {Object.entries(groupedByYear).sort(([a], [b]) => a - b).map(([year, items]) => (
              <motion.div
                key={year}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  initial={{ x: -20 }}
                  whileInView={{ x: 0 }}
                  viewport={{ once: true }}
                  className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4"
                >
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-medium shrink-0 font-display" style={{ color: branchColors[branch] }}>
                    Year {year}
                  </h2>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 h-px border-t border-dashed"
                    style={{ borderColor: branchColors[branch] }}
                  />
                  <span className="text-xs sm:text-sm font-mono text-secondary shrink-0">{items.length} items</span>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                  {items.map((item) => (
                    <EquipmentCard
                      key={item.id}
                      item={item}
                      branch={branch}
                      branchColor={branchColors[branch]}
                      bookmarks={bookmarks}
                      toggleBookmark={toggleBookmark}
                      user={user}
                      navigate={navigate}
                      variants={itemVariants}
                    />
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EquipmentCard = ({ item, branch, branchColor, bookmarks, toggleBookmark, user, navigate, variants }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      whileHover={{ y: -8, boxShadow: '6px 6px 0px hsl(var(--foreground))' }}
      onClick={() => navigate(`/equipment/${branch}/${item.id}`)}
      className="reg-corners bg-card border-2 border-border rounded-none overflow-hidden cursor-pointer group relative"
      data-testid={`equipment-card-${item.id}`}
    >
      <span className="reg-tr" />
      <span className="reg-bl" />
      {item.image_url && (
        <motion.div
          className="h-36 sm:h-48 overflow-hidden border-b-2 border-border relative"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <div className="bg-card border-2 border-border px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-mono font-bold" style={{ color: branchColor }}>
              SEM {item.semester}
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex-1 min-w-0">
            <motion.h3
              className="text-base sm:text-xl tracking-tight font-medium text-foreground group-hover:text-primary transition-colors mb-1 sm:mb-2 truncate font-display"
              whileHover={{ x: 5 }}
            >
              {item.name}
            </motion.h3>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-secondary">
              Year {item.year} &bull; Semester {item.semester}
            </div>
          </div>
          {user && (
            <motion.button
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}
              className="ml-2 shrink-0"
              style={{ color: branchColor }}
              data-testid={`bookmark-button-${item.id}`}
            >
              {bookmarks.includes(item.id) ? (
                <Bookmark size={22} weight="fill" />
              ) : (
                <BookmarkSimple size={22} weight="regular" />
              )}
            </motion.button>
          )}
        </div>
        
        <p className="text-xs sm:text-sm leading-relaxed text-secondary line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4">
          {item.definition}
        </p>
        
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: '100%' } : { width: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1"
          style={{ backgroundColor: branchColor }}
        />
      </div>
    </motion.div>
  );
};

export default EquipmentListPage;
