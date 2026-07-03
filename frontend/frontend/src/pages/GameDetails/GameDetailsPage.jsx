import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import { getGameDetails } from '../../services/gameService.js';
import { useLibraryStore } from '../../store/libraryStore.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { useUiStore } from '../../store/uiStore.js';

export default function GameDetailsPage() {
  const { rawgId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Cache navigation state game details if they exist
  const cachedGame = location.state?.game;

  const [game, setGame] = useState(cachedGame || null);
  const [loading, setLoading] = useState(!cachedGame);
  const [error, setError] = useState(null);
  const addGameToLibrary = useLibraryStore((state) => state.addGame);
  const [adding, setAdding] = useState(false);

  // Track the rawgId to reset states when navigating to a new game
  const [prevRawgId, setPrevRawgId] = useState(rawgId);
  if (rawgId !== prevRawgId) {
    setPrevRawgId(rawgId);
    setGame(cachedGame || null);
    setLoading(!cachedGame);
    setError(null);
  }

  useEffect(() => {
    let active = true;

    const loadDetails = async () => {
      try {
        const response = await getGameDetails(rawgId);
        if (!active) return;
        if (response && response.success) {
          setGame(response.data);
        } else {
          if (!cachedGame) {
            setError(response?.message || 'Failed to load details.');
          }
        }
      } catch (err) {
        if (!active) return;
        if (!cachedGame) {
          setError(err.response?.data?.message || err.message || 'Failed to load metadata dossier.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (rawgId) {
      loadDetails();
    }

    return () => {
      active = false;
    };
  }, [rawgId, cachedGame]);

  const handleAddToArmory = async () => {
    if (!game) return;
    setAdding(true);
    try {
      const res = await addGameToLibrary(game.rawgId, 'TO_PLAY');
      if (res.success) {
        useUiStore.getState().addToast('CARTRIDGE CORE ADDED TO ARMORY.', 'success');
      } else {
        useUiStore.getState().addToast(res.error || 'FAILED TO ACQUIRE CORE.', 'error');
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-lg animate-pulse page-transition-wipe">
        <div className="h-10 bg-[#2a2a2a] w-1/4" />
        <div className="h-6 bg-[#2a2a2a] w-1/2 mt-sm" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mt-lg">
          <div className="h-64 bg-[#2a2a2a] border-[6px] border-neo-border md:col-span-1" />
          <div className="space-y-md md:col-span-2">
            <div className="h-12 bg-[#2a2a2a] w-3/4" />
            <div className="h-32 bg-[#2a2a2a] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex flex-col gap-xl page-transition-wipe">
        <EmptyState
          icon="⚠️"
          title="DOSSIER RETRIEVAL FAILURE"
          description={error || 'No matching database matrix entry aligns with that designation.'}
          variant="error"
          action={
            <Button variant="secondary" onClick={() => navigate(-1)}>
              RETURN TO PREVIOUS STATE
            </Button>
          }
        />
      </div>
    );
  }

  // Clean HTML or load placeholder if not loaded yet
  const cleanDescription = game.description || (loading ? 'LOADING NARRATIVE LOGS...' : 'NO DATA LOGGED.');

  return (
    <div className="flex flex-col gap-xl page-transition-wipe">
      {/* Intro */}
      <div className="flex justify-between items-end border-b border-neo-border/10 pb-md">
        <div>
          <h1 className="text-4xl md:text-5xl font-title tracking-[0.06em] font-normal text-primary leading-none uppercase">MISSION DOSSIER</h1>
          <p className="text-xs md:text-sm font-sans text-muted-text mt-xs uppercase tracking-widest">
            Technical metadata scraping logs for Designation: {game.title?.toUpperCase()}
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate(-1)} className="text-xs h-10 flex items-center justify-center">
          BACK TO SCRAPER
        </Button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Cover Block */}
        <div className="md:col-span-1">
          <Card title="CARTRIDGE CORE IMAGE" hasScrewHeads={true}>
            <div className="h-64 border-[3px] border-black bg-surface overflow-hidden relative group">
              {game.coverImage ? (
                <img
                  src={game.coverImage}
                  alt={game.title}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-150"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-text uppercase font-bold tracking-widest bg-surface">
                  NO DECORATIVE LABEL
                </div>
              )}
            </div>
            <Button
              variant="primary"
              onClick={handleAddToArmory}
              disabled={adding}
              className="w-full mt-md"
            >
              {adding ? 'ADDING...' : 'ADD TO ARMORY'}
            </Button>
          </Card>
        </div>

        {/* Narrative & Specifications */}
        <div className="md:col-span-2 space-y-md">
          <Card title={game.title}>
            <div className="flex flex-col gap-md">
              <div className="flex flex-wrap gap-xs">
                {game.platforms?.slice(0, 5).map((platformName, idx) => (
                  <Badge key={idx} variant="default">{platformName}</Badge>
                ))}
                {game.genres?.slice(0, 3).map((genreName, idx) => (
                  <Badge key={idx} variant="outline">{genreName}</Badge>
                ))}
              </div>

              {game.rating && (
                <div className="space-y-xs">
                  <span className="text-[10px] font-mono font-bold text-muted-text uppercase tracking-widest">CRITICAL DESIGNATION EVALUATION (RAWG RATINGS)</span>
                  <div className="flex items-center gap-sm">
                    <ProgressBar value={Math.round(game.rating * 20)} variant="accent" />
                    <span className="font-title text-sm text-primary min-w-9">{game.rating.toFixed(2)}/5.00</span>
                  </div>
                </div>
              )}

              <p className="text-sm font-sans text-muted-text leading-relaxed whitespace-pre-line max-w-prose">
                {cleanDescription}
              </p>
            </div>
          </Card>

          <Card title="DEVELOPMENT METADATA DECK" variant="surface">
            <div className="grid grid-cols-2 gap-sm text-xs font-mono">
              <span className="text-muted-text uppercase tracking-widest">Developer:</span>
              <span className="text-primary font-bold uppercase">{game.developers && game.developers.length > 0 ? game.developers.join(', ') : (loading ? 'RETRIEVING...' : 'N/A')}</span>
              
              <span className="text-muted-text uppercase tracking-widest">Publisher:</span>
              <span className="text-primary font-bold uppercase">{game.publishers && game.publishers.length > 0 ? game.publishers.join(', ') : (loading ? 'RETRIEVING...' : 'N/A')}</span>
              
              <span className="text-muted-text uppercase tracking-widest">Release Date:</span>
              <span className="text-primary font-bold uppercase">{game.releaseDate || 'TBA'}</span>

              <span className="text-muted-text uppercase tracking-widest">Metacritic:</span>
              <span className="text-accent font-bold uppercase">{game.metacritic || 'N/A'}</span>

              <span className="text-muted-text uppercase tracking-widest">Average Playtime:</span>
              <span className="text-primary font-bold uppercase">{game.playtime ? `${game.playtime} Hours` : (loading ? 'RETRIEVING...' : 'N/A')}</span>

              <span className="text-muted-text uppercase tracking-widest">ESRB Rating:</span>
              <span className="text-primary font-bold uppercase">{game.esrbRating || (loading ? 'RETRIEVING...' : 'N/A')}</span>

              <span className="text-muted-text uppercase tracking-widest">Website:</span>
              <span className="text-primary font-bold lowercase truncate">
                {game.website ? (
                  <a href={game.website} target="_blank" rel="noopener noreferrer" className="hover:text-accent underline transition-colors">
                    {game.website.replace(/https?:\/\/(www\.)?/, '')}
                  </a>
                ) : (
                  loading ? 'RETRIEVING...' : 'N/A'
                )}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
