import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BookmarkSimple } from '@phosphor-icons/react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const UserDashboard = () => {
  const [bookmarkedEquipment, setBookmarkedEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/bookmarks`, { withCredentials: true });
      setBookmarkedEquipment(data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <p className="dim-line text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] font-bold text-primary mb-3">
            Saved Specifications
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl tracking-tighter font-medium text-foreground mb-3 sm:mb-4 font-display" data-testid="dashboard-title">
            Your Bookmarks
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-secondary">
            Quick access to your saved equipment
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12" data-testid="loading-state">
            <p className="text-base sm:text-lg font-medium text-foreground">Loading bookmarks...</p>
          </div>
        ) : bookmarkedEquipment.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-none p-8 sm:p-12 text-center blueprint-dot-grid" data-testid="no-bookmarks">
            <BookmarkSimple size={48} weight="regular" className="mx-auto text-primary/40 mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-foreground mb-2 font-display">No bookmarks yet</h3>
            <p className="text-sm sm:text-base text-secondary mb-6 font-mono">
              Start exploring equipment and bookmark your favorites
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-none font-mono text-xs uppercase tracking-wider font-medium border-2 border-primary"
              data-testid="explore-button"
            >
              Explore Equipment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {bookmarkedEquipment.map((item) => (
              <div
                key={item.id}
                className="reg-corners bg-card border-2 border-border rounded-none overflow-hidden hover:border-primary cursor-pointer transition-colors relative"
                onClick={() => navigate(`/equipment/${item.branch}/${item.id}`)}
                data-testid={`bookmark-card-${item.id}`}
              >
                <span className="reg-tr" /><span className="reg-bl" />
                {item.image_url && (
                  <div className="h-36 sm:h-48 overflow-hidden border-b border-border">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                )}
                <div className="p-4 sm:p-6">
                  <div className="mb-2">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] font-bold text-primary">
                      {item.branch}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl tracking-tight font-medium text-foreground mb-2 sm:mb-3 font-display">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-secondary line-clamp-2">
                    {item.definition}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
