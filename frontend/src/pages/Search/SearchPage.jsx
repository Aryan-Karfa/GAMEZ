import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { useSearchStore } from '../../store/searchStore.js';
import { useLibraryStore } from '../../store/libraryStore.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { useUiStore } from '../../store/uiStore.js';

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState(''); // Typing buffer state
  const [addingIds, setAddingIds] = useState({}); // tracking which IDs are adding
  const [focused, setFocused] = useState(false);

  // Retrieve Zustand Search store parameters
  const {
    storeQuery,
    results,
    loading,
    storeError,
    search,
  } = useSearchStore(
    useShallow((state) => ({
      storeQuery: state.query,
      results: state.results,
      loading: state.loading,
      storeError: state.error,
      search: state.search,
    }))
  );

  const addGameToLibrary = useLibraryStore((state) => state.addGame);

  // Derived status states (Zustand as the single source of truth)
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    search(query);
  };

  const handleAddToArmory = async (rawgId) => {
    if (!rawgId) return;
    setAddingIds((prev) => ({ ...prev, [rawgId]: true }));
    try {
      const res = await addGameToLibrary(rawgId, 'TO_PLAY');
      if (res.success) {
        useUiStore.getState().addToast('CARTRIDGE CORE ADDED TO ARMORY.', 'success');
      } else {
        useUiStore.getState().addToast(res.error || 'FAILED TO ACQUIRE CORE.', 'error');
      }
    } finally {
      setAddingIds((prev) => ({ ...prev, [rawgId]: false }));
    }
  };

  const renderLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-90 animate-pulse relative flex flex-col justify-between rounded-none">
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
    <div className="flex flex-col gap-xl page-transition-wipe">
      {/* Intro */}
      <div className="border-b border-neo-border/10 pb-md">
        <h1 className="text-4xl md:text-5xl font-title tracking-[0.06em] font-normal text-primary leading-none uppercase">SCANNING TERMINAL</h1>
        <p className="text-xs md:text-sm font-sans text-muted-text mt-xs uppercase tracking-widest">
          Discover new software cartridges and allocate them to your armory modules.
        </p>
      </div>

      {/* Terminal Search Input Panel */}
      <Card title="DATABASE SCRAPE DECK">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-md">
          <div className={`flex-1 flex items-center bg-surface border-[3px] transition-colors duration-150 px-md h-10 ${
            focused ? 'border-accent text-accent' : 'border-neo-border text-muted-text'
          }`}>
            <span className={`font-mono font-black pr-sm select-none transition-colors duration-150 ${
              focused ? 'text-accent' : 'text-muted-text'
            }`}>&gt;&gt;</span>
            <input
              type="text"
              placeholder="Enter game designation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="flex-1 bg-transparent border-none text-primary placeholder-muted-text/50 text-sm rounded-none focus:outline-none w-full"
            />
          </div>
          <Button variant="primary" type="submit" className="sm:w-40 font-title h-10 flex items-center justify-center">
            START SCAN
          </Button>
        </form>
        <div className="text-[10px] font-mono text-muted-text mt-md flex justify-between uppercase tracking-widest">
          <span>CODENAME: SCRAPE_DECK_V2</span>
          <span>STATUS: {searchingState}</span>
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
            <div className="text-xs font-mono text-accent font-bold uppercase tracking-widest animate-pulse border-[3px] border-accent/20 p-sm bg-accent/5">
              SCANNING DATABASE NODE CODES... [0x7FF45]
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
          <EmptyState
            icon="🚫"
            title="NO RESULTS DETECTED"
            description="No matching database matrix entry aligns with that designation. Check criteria strings."
            variant="accent"
          />
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
                        disabled={isAdding || !game.rawgId}
                        variant="primary"
                        className="flex-1 text-xs"
                      >
                        {isAdding ? 'ADDING...' : 'ADD TO ARMORY'}
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
