import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { useSearchStore } from '../../store/searchStore.js';
import { useLibraryStore } from '../../store/libraryStore.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { useUiStore } from '../../store/uiStore.js';
import { getSearchSuggestions } from '../../services/gameService.js';

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState(''); // Typing buffer state
  const [addingIds, setAddingIds] = useState({}); // tracking which IDs are adding
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem('gamez_recent_searches');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [terminalLogs, setTerminalLogs] = useState([]);
  
  // Local smart filter state
  const [filterGenre, setFilterGenre] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [filterDev, setFilterDev] = useState('');
  const [filterPub, setFilterPub] = useState('');
  const [filterInstalled, setFilterInstalled] = useState('');
  const [filterPlayStatus, setFilterPlayStatus] = useState('');

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Retrieve Zustand Search store parameters
  const {
    storeQuery,
    results,
    loading,
    storeError,
    ordering,
    search,
    setOrdering
  } = useSearchStore(
    useShallow((state) => ({
      storeQuery: state.query,
      results: state.results,
      loading: state.loading,
      storeError: state.error,
      ordering: state.ordering,
      search: state.search,
      setOrdering: state.setOrdering
    }))
  );

  const { libraryEntries, addGameToLibrary, fetchLibrary } = useLibraryStore(
    useShallow((state) => ({
      libraryEntries: state.entries,
      addGameToLibrary: state.addGame,
      fetchLibrary: state.fetchLibrary
    }))
  );

  // Load library on mount to resolve favorites & installed check
  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  // Save query to recent searches
  const saveRecentSearch = (searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) return;
    const clean = searchQuery.trim();
    const updated = [clean, ...recentSearches.filter(s => s.toLowerCase() !== clean.toLowerCase())].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('gamez_recent_searches', JSON.stringify(updated));
  };

  const handleClearRecent = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setRecentSearches([]);
    localStorage.removeItem('gamez_recent_searches');
    inputRef.current?.focus();
  };

  // Debounced search suggestions effect
  useEffect(() => {
    if (query.trim().length < 2) {
      const clearTimer = setTimeout(() => setSuggestions([]), 0);
      return () => clearTimeout(clearTimer);
    }

    const timer = setTimeout(async () => {
      try {
        const response = await getSearchSuggestions(query.trim());
        setSuggestions(response.data || []);
      } catch (err) {
        console.error('Failed to load suggestions:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Terminal scanning progress simulation
  useEffect(() => {
    if (loading) {
      let i = 0;
      const logs = [
        "[00:01] SCRAPING GAMEZ NODE MATRIX...",
        "[00:02] SYNCHRONIZING RAWG CHANNELS...",
        "[00:04] CALCULATING WEIGHTED RANKING SCORES...",
        "[00:06] ALIGNING GAMER SLANG AND EXPANSIONS...",
        "[00:07] EXCLUDING IRRELEVANT DESIGNATIONS (THRESHOLD < 25)...",
        "[00:08] DONE. CARTRIDGES LINKED."
      ];
      const initialTimer = setTimeout(() => {
        setTerminalLogs([logs[0]]);
        i = 1;
      }, 0);

      const interval = setInterval(() => {
        if (i < logs.length) {
          setTerminalLogs(prev => [...prev, logs[i]]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 250);

      return () => {
        clearTimeout(initialTimer);
        clearInterval(interval);
      };
    } else {
      const clearTimer = setTimeout(() => setTerminalLogs([]), 0);
      return () => clearTimeout(clearTimer);
    }
  }, [loading]);

  // Derived status states
  const searchingState = (() => {
    if (loading) return 'SCANNING';
    if (storeError) return 'ERROR';
    if (results.length > 0) return 'FOUND';
    if (storeQuery.trim() !== '') return 'EMPTY';
    return 'STANDBY';
  })();

  const isNetworkFailure =
    storeError &&
    (storeError.toLowerCase().includes('network') ||
     storeError.toLowerCase().includes('connect') ||
     storeError.toLowerCase().includes('offline') ||
     storeError.toLowerCase().includes('status code 5'));

  const executeSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    saveRecentSearch(searchQuery);
    setShowDropdown(false);
    
    // Assemble filters
    const currentFilters = {
      genre: filterGenre || undefined,
      platform: filterPlatform || undefined,
      year: filterYear ? parseInt(filterYear, 10) : undefined,
      rating: filterRating ? parseFloat(filterRating) : undefined,
      developer: filterDev || undefined,
      publisher: filterPub || undefined,
      playStatus: filterPlayStatus || undefined,
      installed: filterInstalled || undefined
    };

    search(searchQuery, 1, 24, ordering, currentFilters);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleAddToArmory = async (rawgId) => {
    if (!rawgId) return;
    setAddingIds((prev) => ({ ...prev, [rawgId]: true }));
    try {
      const res = await addGameToLibrary(rawgId, 'TO_PLAY');
      if (res.success) {
        useUiStore.getState().addToast('CARTRIDGE CORE ADDED TO ARMORY.', 'success');
        // Refresh search results to update playStatus & installed flags
        executeSearch(query);
      } else {
        useUiStore.getState().addToast(res.error || 'FAILED TO ACQUIRE CORE.', 'error');
      }
    } finally {
      setAddingIds((prev) => ({ ...prev, [rawgId]: false }));
    }
  };

  // Keyboard navigation inside Suggestions/History list
  const handleKeyDown = (e) => {
    const list = getActiveDropdownList();
    if (list.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % list.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + list.length) % list.length);
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < list.length) {
        e.preventDefault();
        const selected = list[highlightedIndex];
        const val = typeof selected === 'string' ? selected : selected.title;
        setQuery(val);
        executeSearch(val);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && inputRef.current !== e.target) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine items in suggestion dropdown
  const getActiveDropdownList = () => {
    if (query.trim().length >= 2) {
      return suggestions;
    }
    return [
      ...recentSearches.map(term => ({ type: 'recent', title: term })),
      ...getTrendingSearches().map(term => ({ type: 'trending', title: term })),
      ...getArmoryFavorites().map(game => ({ type: 'favorite', title: game.title, rawgId: game.rawgId }))
    ];
  };

  const getTrendingSearches = () => {
    return ["Elden Ring", "Grand Theft Auto V", "The Witcher 3", "Cyberpunk 2077", "Resident Evil 4"];
  };

  const getArmoryFavorites = () => {
    // Show up to 5 completed or playing games
    return libraryEntries
      .filter(e => e.status === 'COMPLETED' || e.status === 'PLAYING')
      .slice(0, 5)
      .map(e => e.game);
  };

  const renderLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-90 animate-pulse relative flex flex-col justify-between rounded-none overflow-hidden border-[3px] border-neo-border/20">
          {/* Scanning Sweep Line */}
          <div className="animate-scanner" />
          <div className="absolute top-0 left-0 right-0 h-4 bg-neo-border/5 border-b-[3px] border-neo-border/20" />
          <div className="h-35 bg-[#2a2a2a] border-[3px] border-black mt-sm" />
          <div className="flex flex-col gap-sm mt-sm grow">
            <div className="h-6 bg-[#2a2a2a] w-3/4" />
            <div className="h-4 bg-[#2a2a2a] w-1/2" />
            <div className="h-5 bg-[#2a2a2a] w-full mt-sm" />
          </div>
          <div className="h-10 bg-[#2a2a2a] w-full mt-sm" />
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-xl page-transition-wipe relative">
      {/* Styles Injection for scanner sweep line animation */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-10px); }
          50% { transform: translateY(355px); }
          100% { transform: translateY(-10px); }
        }
        .animate-scanner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: linear-gradient(to bottom, transparent, #d72638, transparent);
          box-shadow: 0 0 10px #d72638;
          animation: scanline 2.2s linear infinite;
          pointer-events: none;
          z-index: 10;
        }
      `}</style>

      {/* Intro */}
      <div className="border-b border-neo-border/10 pb-md">
        <h1 className="text-4xl md:text-5xl font-title tracking-[0.06em] font-normal text-primary leading-none uppercase">SCANNING TERMINAL</h1>
        <p className="text-xs md:text-sm font-sans text-muted-text mt-xs uppercase tracking-widest">
          Discover new software cartridges and allocate them to your armory modules.
        </p>
      </div>

      {/* Database Scrape Deck Card */}
      <Card title="DATABASE SCRAPE DECK" className="relative z-50">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-md relative">
          <div className={`flex-1 flex items-center bg-surface border-[3px] transition-colors duration-150 px-md h-10 ${
            focused ? 'border-accent text-accent' : 'border-neo-border text-muted-text'
          }`}>
            <span className={`font-mono font-black pr-sm select-none transition-colors duration-150 ${
              focused ? 'text-accent' : 'text-muted-text'
            }`}>&gt;&gt;</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter game designation..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
                setHighlightedIndex(-1);
              }}
              onFocus={() => {
                setFocused(true);
                setShowDropdown(true);
              }}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKeyDown}
              aria-autocomplete="list"
              aria-controls="suggestions-listbox"
              className="flex-1 bg-transparent border-none text-primary placeholder-muted-text/50 text-sm rounded-none focus:outline-none w-full"
            />
          </div>
          <Button variant="primary" type="submit" className="sm:w-40 font-title h-10 flex items-center justify-center">
            START SCAN
          </Button>

          {/* Suggestions & Search History Dropdown overlay */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              id="suggestions-listbox"
              role="listbox"
              aria-label="Search suggestions"
              className="absolute top-11 left-0 right-0 bg-[#0e0e0e] border-[3px] border-black shadow-neo z-50 font-mono text-xs max-h-80 overflow-y-auto divide-y divide-neo-border/10"
            >
              {query.trim().length >= 2 ? (
                /* 1. suggestions list */
                suggestions.length > 0 ? (
                  suggestions.map((game, index) => (
                    <div
                      key={game.rawgId}
                      role="option"
                      aria-selected={index === highlightedIndex}
                      onMouseDown={() => {
                        setQuery(game.title);
                        executeSearch(game.title);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`p-md cursor-pointer flex justify-between items-center transition-colors ${
                        index === highlightedIndex ? 'bg-accent/20 text-accent font-bold' : 'text-primary hover:bg-surface'
                      }`}
                    >
                      <span className="uppercase">{game.title}</span>
                      <span className="text-[10px] text-muted-text select-none uppercase tracking-wider">
                        ★ {game.rating?.toFixed(1) || '-'} // {game.releaseDate?.substring(0, 4) || '-'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-md text-muted-text text-center uppercase tracking-widest">
                    No suggestions found...
                  </div>
                )
              ) : (
                /* 2. recent + trending + favorites */
                <div className="p-md grid grid-cols-1 md:grid-cols-3 gap-md">
                  {/* Recent Queries */}
                  <div>
                    <div className="text-[10px] text-accent font-bold uppercase tracking-wider mb-sm flex justify-between items-center">
                      <span>RECENT LOG DATA</span>
                      {recentSearches.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearRecent}
                          className="hover:text-primary underline cursor-pointer text-[9px]"
                        >
                          CLEAR LOGS
                        </button>
                      )}
                    </div>
                    {recentSearches.length > 0 ? (
                      <div className="flex flex-col gap-xs">
                        {recentSearches.map((term) => (
                          <div
                            key={term}
                            onMouseDown={() => {
                              setQuery(term);
                              executeSearch(term);
                            }}
                            className="text-muted-text hover:text-primary cursor-pointer p-xs hover:bg-surface truncate uppercase"
                          >
                            🕒 {term}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-text/50 uppercase italic text-[9px] p-xs">No recent log data.</div>
                    )}
                  </div>

                  {/* Trending Queries */}
                  <div>
                    <div className="text-[10px] text-accent font-bold uppercase tracking-wider mb-sm">TRENDING NODE CORES</div>
                    <div className="flex flex-col gap-xs">
                      {getTrendingSearches().map((term) => (
                        <div
                          key={term}
                          onMouseDown={() => {
                            setQuery(term);
                            executeSearch(term);
                          }}
                          className="text-muted-text hover:text-primary cursor-pointer p-xs hover:bg-surface truncate uppercase"
                        >
                          ⚡ {term}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Favorites Queries */}
                  <div>
                    <div className="text-[10px] text-accent font-bold uppercase tracking-wider mb-sm">ARMORY DESIGNATIONS</div>
                    {getArmoryFavorites().length > 0 ? (
                      <div className="flex flex-col gap-xs">
                        {getArmoryFavorites().map((game) => (
                          <div
                            key={game.rawgId}
                            onMouseDown={() => {
                              setQuery(game.title);
                              executeSearch(game.title);
                            }}
                            className="text-muted-text hover:text-primary cursor-pointer p-xs hover:bg-surface truncate uppercase"
                          >
                            🕹️ {game.title}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-text/50 uppercase italic text-[9px] p-xs">Armory queue offline.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </form>

        <div className="text-[10px] font-mono text-muted-text mt-md flex justify-between uppercase tracking-widest select-none">
          <span>CODENAME: SCRAPE_DECK_V2</span>
          <span>STATUS: {searchingState}</span>
        </div>
      </Card>

      {/* Smart Filters & Sorting Panel Card */}
      <Card title="SCAN CONFIGURATION PANEL" className="relative z-40">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-md font-mono text-xs">
          {/* Sorting */}
          <div className="flex flex-col gap-xs">
            <span className="text-muted-text uppercase font-bold tracking-wider">SORT CORES</span>
            <select
              value={ordering}
              onChange={(e) => {
                setOrdering(e.target.value);
                if (query.trim()) executeSearch(query);
              }}
              className="bg-surface border-[3px] border-neo-border p-xs text-primary focus:outline-none focus:border-accent cursor-pointer uppercase h-8"
            >
              <option value="relevance">RELEVANCE</option>
              <option value="rating">★ RATING</option>
              <option value="popularity">POPULARITY</option>
              <option value="newest">RELEASE: NEWEST</option>
              <option value="oldest">RELEASE: OLDEST</option>
              <option value="alphabetical">ALPHABETICAL</option>
            </select>
          </div>

          {/* Installed check */}
          <div className="flex flex-col gap-xs">
            <span className="text-muted-text uppercase font-bold tracking-wider">ARMORY MATRIX</span>
            <select
              value={filterInstalled}
              onChange={(e) => {
                setFilterInstalled(e.target.value);
                if (query.trim()) {
                  // We trigger search immediately to refresh filters on the backend
                  setTimeout(() => executeSearch(query), 10);
                }
              }}
              className="bg-surface border-[3px] border-neo-border p-xs text-primary focus:outline-none focus:border-accent cursor-pointer uppercase h-8"
            >
              <option value="">ALL MATRIX CARTRIDGES</option>
              <option value="installed">INSTALLED (IN ARMORY)</option>
              <option value="not_installed">NOT INSTALLED (RAWG ONLY)</option>
            </select>
          </div>

          {/* Genre filter */}
          <div className="flex flex-col gap-xs">
            <span className="text-muted-text uppercase font-bold tracking-wider">GENRE CLASS</span>
            <select
              value={filterGenre}
              onChange={(e) => {
                setFilterGenre(e.target.value);
                if (query.trim()) setTimeout(() => executeSearch(query), 10);
              }}
              className="bg-surface border-[3px] border-neo-border p-xs text-primary focus:outline-none focus:border-accent cursor-pointer uppercase h-8"
            >
              <option value="">ALL GENRE DESIGNATIONS</option>
              <option value="action">ACTION</option>
              <option value="role-playing-games-rpg">RPG</option>
              <option value="shooter">SHOOTER</option>
              <option value="adventure">ADVENTURE</option>
              <option value="indie">INDIE</option>
              <option value="strategy">STRATEGY</option>
              <option value="puzzle">PUZZLE</option>
            </select>
          </div>

          {/* Platform filter */}
          <div className="flex flex-col gap-xs">
            <span className="text-muted-text uppercase font-bold tracking-wider">PLATFORM MODULE</span>
            <select
              value={filterPlatform}
              onChange={(e) => {
                setFilterPlatform(e.target.value);
                if (query.trim()) setTimeout(() => executeSearch(query), 10);
              }}
              className="bg-surface border-[3px] border-neo-border p-xs text-primary focus:outline-none focus:border-accent cursor-pointer uppercase h-8"
            >
              <option value="">ALL HARDWARE CONFIGS</option>
              <option value="PC">PC</option>
              <option value="PlayStation">PLAYSTATION</option>
              <option value="Xbox">XBOX</option>
              <option value="Nintendo">NINTENDO SWITCH</option>
              <option value="iOS">iOS</option>
              <option value="Android">ANDROID</option>
            </select>
          </div>
        </div>

        {/* Collapsable details text inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-md font-mono text-xs mt-md border-t border-neo-border/10 pt-md">
          {/* Year */}
          <div className="flex flex-col gap-xs">
            <span className="text-muted-text uppercase font-bold tracking-wider">RELEASE YEAR</span>
            <input
              type="number"
              placeholder="e.g. 2023"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="bg-surface border-[3px] border-neo-border p-xs text-primary focus:outline-none focus:border-accent h-8 px-sm"
            />
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-xs">
            <span className="text-muted-text uppercase font-bold tracking-wider">MIN RATING</span>
            <input
              type="number"
              min="0"
              max="5"
              step="0.5"
              placeholder="e.g. 4.0"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="bg-surface border-[3px] border-neo-border p-xs text-primary focus:outline-none focus:border-accent h-8 px-sm"
            />
          </div>

          {/* Developer */}
          <div className="flex flex-col gap-xs">
            <span className="text-muted-text uppercase font-bold tracking-wider">STUDIO / DEV</span>
            <input
              type="text"
              placeholder="e.g. Valve"
              value={filterDev}
              onChange={(e) => setFilterDev(e.target.value)}
              className="bg-surface border-[3px] border-neo-border p-xs text-primary focus:outline-none focus:border-accent h-8 px-sm"
            />
          </div>

          {/* Publisher */}
          <div className="flex flex-col gap-xs">
            <span className="text-muted-text uppercase font-bold tracking-wider">PUBLISHER</span>
            <input
              type="text"
              placeholder="e.g. Sega"
              value={filterPub}
              onChange={(e) => setFilterPub(e.target.value)}
              className="bg-surface border-[3px] border-neo-border p-xs text-primary focus:outline-none focus:border-accent h-8 px-sm"
            />
          </div>
        </div>

        {/* Clear and Apply triggers */}
        <div className="flex justify-end gap-sm mt-md">
          <Button
            variant="secondary"
            className="text-[10px] font-bold uppercase tracking-wider py-xs"
            onClick={() => {
              setFilterGenre('');
              setFilterPlatform('');
              setFilterYear('');
              setFilterRating('');
              setFilterDev('');
              setFilterPub('');
              setFilterInstalled('');
              setFilterPlayStatus('');
            }}
          >
            RESET FILTERS
          </Button>
          <Button
            variant="primary"
            className="text-[10px] font-bold uppercase tracking-wider py-xs"
            onClick={() => executeSearch(query)}
          >
            APPLY SCANNERS
          </Button>
        </div>
      </Card>

      {/* Dynamic Status / Result Container */}
      <div>
        {searchingState === 'STANDBY' && (
          <EmptyState
            icon="📡"
            title="NO SIGNAL ACTIVE"
            description="Scrape deck is waiting for input criteria. Connect query designation above."
            variant="default"
          />
        )}

        {searchingState === 'SCANNING' && (
          <div className="space-y-lg">
            {/* Terminal progress logs */}
            <div className="border-[3px] border-accent/20 p-md bg-accent/5 font-mono text-xs text-accent leading-relaxed">
              <div className="text-[10px] text-accent/50 mb-xs uppercase tracking-widest font-bold">TERMINAL SEQUENCE LOGS</div>
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="animate-fade-in font-bold">
                  {log}
                </div>
              ))}
            </div>
            {renderLoader()}
          </div>
        )}

        {searchingState === 'ERROR' && (
          <EmptyState
            icon="⚠️"
            title={isNetworkFailure ? 'CONNECTION FAILURE' : 'SEARCH SCRAPE FAILURE'}
            description={storeError || 'Fatal error querying database nodes. Verify link properties.'}
            variant="error"
          />
        )}

        {searchingState === 'EMPTY' && (
          <div className="border-[6px] border-neo-border bg-card p-xl shadow-neo text-center relative font-sans text-primary select-none rounded-none">
            <div className="text-5xl mb-md">🚫</div>
            <h3 className="text-xl md:text-2xl font-title tracking-wider uppercase text-accent">NO MATCHES FOUND</h3>
            <div className="text-xs uppercase tracking-widest text-muted-text mt-sm max-w-md mx-auto leading-relaxed border-t border-neo-border/10 pt-md">
              <span className="font-bold text-primary block mb-xs">SUGGESTIONS</span>
              <ul className="text-left space-y-xs list-disc list-inside">
                <li>Check your spelling designation</li>
                <li>Try another software title</li>
                <li>Search by publisher or franchise</li>
                <li>Verify your scan configuration filters</li>
              </ul>
            </div>
          </div>
        )}

        {searchingState === 'FOUND' && (
          <div className="space-y-md">
            <div className="text-[10px] font-mono text-success font-bold uppercase tracking-widest border-[3px] border-success/20 p-sm bg-success/5">
              MATCHES FOUND // DISPLAYING DATABASE MATRIX CORES
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {results.map((game) => {
                const isAdding = !!addingIds[game.rawgId];
                return (
                  <Card key={game.rawgId} hasScrewHeads={true} className="hover:shadow-neo-accent transition-all duration-150 select-none relative flex flex-col justify-between h-90 rounded-none">
                    <div className="absolute top-0 left-0 right-0 h-4 bg-neo-border/5 border-b-[3px] border-neo-border/20" />
                    
                    <div className="h-35 bg-surface border-[3px] border-black overflow-hidden relative group mt-sm">
                      {game.coverImage ? (
                        <img
                          src={game.coverImage}
                          alt={game.title || 'No Cover'}
                          className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-150"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-text uppercase font-bold tracking-widest bg-surface">
                          NO COVER ART
                        </div>
                      )}
                      
                      {/* Playstatus / Installed Badge */}
                      {game.installed && (
                        <div className="absolute top-sm left-sm z-20">
                          <Badge variant={game.playStatus === 'PLAYING' ? 'accent' : 'default'}>
                            {game.playStatus === 'PLAYING' ? 'ACTIVE' : game.playStatus === 'COMPLETED' ? 'CLEARED' : 'ARMORY'}
                          </Badge>
                        </div>
                      )}

                      {typeof game.rating === 'number' && (
                        <div className="absolute top-sm right-sm z-20">
                          <Badge variant="accent">
                            ★ {game.rating.toFixed(1)}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-xs mt-sm grow">
                      <h4 className="text-md font-title tracking-wider uppercase text-primary line-clamp-1">
                        {game.title || 'UNTITLED CARTRIDGE'}
                      </h4>
                      <div className="flex justify-between items-center text-[10px] text-muted-text font-bold uppercase tracking-wider">
                        <span className="truncate max-w-35">
                          {Array.isArray(game.platforms) && game.platforms.length > 0
                            ? game.platforms.slice(0, 3).join(', ')
                            : '-'}
                        </span>
                        <span>RELEASED: {game.releaseDate && typeof game.releaseDate === 'string' && game.releaseDate.length >= 4 ? game.releaseDate.substring(0, 4) : '-'}</span>
                      </div>
                    </div>

                    <div className="mt-sm flex gap-sm">
                      <Button
                        onClick={() => handleAddToArmory(game.rawgId)}
                        disabled={isAdding || !game.rawgId || game.installed}
                        variant="primary"
                        className="flex-1 text-xs"
                      >
                        {game.installed ? 'INSTALLED' : isAdding ? 'ADDING...' : 'ADD TO ARMORY'}
                      </Button>
                      <Button
                        onClick={() => game.rawgId && navigate(`/games/${game.rawgId}`, { state: { game } })}
                        disabled={!game.rawgId}
                        variant="secondary"
                        className="flex-1 text-xs"
                      >
                        VIEW DOSSIER
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
