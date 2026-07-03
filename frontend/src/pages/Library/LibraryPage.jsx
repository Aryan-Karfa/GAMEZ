import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useLibraryStore } from '../../store/libraryStore.js';
import { useDefaultView, usePreferencesLoading } from '../../store/preferenceStore.js';
import { useUiStore } from '../../store/uiStore.js';
import Badge from '../../components/ui/Badge.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import Card from '../../components/ui/Card.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function LibraryPage() {
  const defaultView = useDefaultView();
  const preferencesLoading = usePreferencesLoading();

  const { entries, fetchLibrary, updateEntry, deleteGame, loading } = useLibraryStore(
    useShallow((state) => ({
      entries: state.entries,
      fetchLibrary: state.fetchLibrary,
      updateEntry: state.updateEntry,
      deleteGame: state.deleteGame,
      loading: state.loading,
    }))
  );

  const [editingEntry, setEditingEntry] = useState(null);
  const [modalStatus, setModalStatus] = useState('PLAYING');
  const [modalProgress, setModalProgress] = useState(0);
  const [modalPlayTime, setModalPlayTime] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [confirmScrub, setConfirmScrub] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);

  // Sorting & Filtering State
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('TITLE'); // 'TITLE', 'PLAYTIME'

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const onEdit = (entry) => {
    setEditingEntry(entry);
    setModalStatus(entry.status);
    setModalProgress(entry.progress);
    setModalPlayTime(entry.playTimeMinutes);
    setConfirmScrub(false);
  };

  const handleSaveMission = async () => {
    if (!editingEntry) return;
    setUpdating(true);
    try {
      const res = await updateEntry(editingEntry.id, {
        status: modalStatus,
        progress: modalProgress,
        playTimeMinutes: modalPlayTime,
      });
      if (res && res.success) {
        useUiStore.getState().addToast('ARMORY DATA UPDATED.', 'success');
      }
      setEditingEntry(null);
    } catch (e) {
      useUiStore.getState().addToast(e.message || 'FAILED TO UPDATE CORE.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteScrub = async () => {
    if (!editingEntry) return;
    setScrubbing(true);
    try {
      const res = await deleteGame(editingEntry.id);
      if (res.success) {
        useUiStore.getState().addToast('CARTRIDGE SCRUB COMPLETED.', 'success');
        setEditingEntry(null);
      } else {
        useUiStore.getState().addToast(res.error || 'FAILED TO SCRUB CORE.', 'error');
      }
    } finally {
      setScrubbing(false);
      setConfirmScrub(false);
    }
  };

  const processedEntries = useMemo(() => {
    let result = [...entries];
    if (statusFilter !== 'ALL') {
      result = result.filter((entry) => entry.status === statusFilter);
    }
    result.sort((a, b) => {
      if (sortBy === 'TITLE') {
        return a.game.title.localeCompare(b.game.title);
      } else {
        return b.playTimeMinutes - a.playTimeMinutes;
      }
    });
    return result;
  }, [entries, statusFilter, sortBy]);

  const renderEmptyState = () => (
    <EmptyState
      icon="📭"
      title="YOUR ARMORY IS EMPTY"
      description="No cartridge cores are connected to your collection tracking deck. Find your first legend to populate your armory!"
      variant="accent"
      action={
        <Link
          to="/search"
          className="inline-block px-lg py-sm border-[3px] border-neo-border bg-accent text-primary font-title text-md tracking-widest uppercase shadow-neo hover:shadow-neo-accent transition-all duration-100 ease-in-out rounded-none active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          🔍 SCAN DATABASE
        </Link>
      }
    />
  );

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

  // Helper status color mapper
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'PLAYING': return 'accent';
      case 'COMPLETED': return 'default';
      default: return 'outline';
    }
  };

  const getStatusLabelText = (status) => {
    switch (status) {
      case 'PLAYING': return 'ACTIVE';
      case 'COMPLETED': return 'CLEARED';
      default: return status.replace('_', ' ');
    }
  };

  // 1. CARD VIEW RENDERER
  const renderCardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
      {processedEntries.map((entry) => {
        const hours = Math.floor(entry.playTimeMinutes / 60);
        const minutes = entry.playTimeMinutes % 60;
        const playtimeString = hours > 0 ? `${hours}H ${minutes}M` : `${minutes}M`;
        
        return (
          <Card key={entry.id} hasScrewHeads={true} className="hover:shadow-neo-accent transition-all duration-150 select-none relative flex flex-col justify-between h-90 rounded-none">
            <div className="absolute top-0 left-0 right-0 h-4 bg-neo-border/5 border-b-[3px] border-neo-border/20" />
            
            <div className="h-35 bg-surface border-[3px] border-black overflow-hidden relative group mt-sm">
              {entry.game.coverImage ? (
                <img
                  src={entry.game.coverImage}
                  alt={entry.game.title}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-150"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-text uppercase font-bold tracking-widest bg-surface">
                  NO LABEL
                </div>
              )}
              <div className="absolute top-sm right-sm z-20">
                <Badge variant={getBadgeVariant(entry.status)}>
                  {getStatusLabelText(entry.status)}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-xs mt-sm grow">
              <h4 className="text-md font-title tracking-wider uppercase text-primary line-clamp-1">
                {entry.game.title}
              </h4>
              <div className="flex justify-between items-center text-[10px] text-muted-text font-bold uppercase tracking-wider">
                <span className="truncate max-w-35">{entry.game.platforms?.join(', ') || 'PC'}</span>
                <span>⌚ {playtimeString}</span>
              </div>
              
              <div className="mt-xs">
                <div className="flex justify-between items-center text-[10px] text-primary/70 font-bold uppercase tracking-widest mb-0.5">
                  <span>HP PROGRESS</span>
                </div>
                <ProgressBar value={entry.progress} variant={entry.status === 'PLAYING' ? 'accent' : 'success'} />
              </div>
            </div>

            <Button
              onClick={() => onEdit(entry)}
              variant="primary"
              className="w-full mt-sm"
            >
              🕹️ RESUME MISSION
            </Button>
          </Card>
        );
      })}
    </div>
  );

  // 2. LIST VIEW RENDERER
  const renderListView = () => (
    <div className="border-[6px] border-neo-border bg-card shadow-neo overflow-x-auto select-none rounded-none">
      <table className="w-full text-left font-sans text-sm border-collapse">
        <thead>
          <tr className="border-b-4 border-neo-border bg-surface uppercase font-bold text-xs tracking-widest text-primary">
            <th className="p-md font-title text-md">Game Title</th>
            <th className="p-md font-title text-md">Status</th>
            <th className="p-md font-title text-md">HP Progress</th>
            <th className="p-md font-title text-md">Playtime</th>
            <th className="p-md font-title text-md text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {processedEntries.map((entry) => {
            const hours = Math.floor(entry.playTimeMinutes / 60);
            const minutes = entry.playTimeMinutes % 60;
            return (
              <tr key={entry.id} className="border-b border-neo-border/10 hover:bg-surface/50 transition-colors">
                <td className="p-md flex items-center gap-sm">
                  <div className="h-12 w-9 bg-surface border border-neo-border/20 overflow-hidden shrink-0 flex items-center justify-center text-[10px] text-muted-text font-bold">
                    {entry.game.coverImage ? (
                      <img src={entry.game.coverImage} className="w-full h-full object-cover grayscale" alt="" />
                    ) : (
                      '-'
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-primary uppercase">{entry.game.title}</div>
                    <div className="text-[9px] text-muted-text uppercase font-bold tracking-wider">
                      {entry.game.platforms?.slice(0, 3).join(', ')}
                    </div>
                  </div>
                </td>
                <td className="p-md">
                  <Badge variant={getBadgeVariant(entry.status)}>
                    {getStatusLabelText(entry.status)}
                  </Badge>
                </td>
                <td className="p-md w-56">
                  <ProgressBar value={entry.progress} variant={entry.status === 'PLAYING' ? 'accent' : 'success'} />
                </td>
                <td className="p-md font-mono text-xs text-primary font-bold">
                  {hours > 0 ? `${hours}H ` : ''}{minutes}M
                </td>
                <td className="p-md text-right">
                  <Button
                    onClick={() => onEdit(entry)}
                    variant="secondary"
                    className="px-sm py-1 text-xs"
                  >
                    EDIT
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // 3. SHELF VIEW RENDERER
  const renderShelfView = () => {
    const shelfCapacity = 6;
    const shelfCount = Math.ceil(processedEntries.length / shelfCapacity);
    
    return (
      <div className="space-y-xl">
        {Array.from({ length: shelfCount }).map((_, shelfIndex) => {
          const shelfEntries = processedEntries.slice(shelfIndex * shelfCapacity, (shelfIndex + 1) * shelfCapacity);
          return (
            <div key={shelfIndex} className="relative pt-md">
              {/* Games aligned on shelf */}
              <div className="flex gap-md px-md overflow-x-auto pb-xs items-end h-48 select-none scrollbar-thin">
                {shelfEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => onEdit(entry)}
                    className="relative w-28 h-36 bg-surface border-4 border-black hover:border-accent hover:-translate-y-3 hover:shadow-neo-accent cursor-pointer transition-all duration-150 group shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"
                  >
                    {entry.game.coverImage ? (
                      <img src={entry.game.coverImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-text uppercase font-bold p-xs text-center">
                        {entry.game.title}
                      </div>
                    )}
                    
                    {/* Mini progress tag */}
                    <div className="absolute top-1 right-1 px-1 bg-black/80 border border-neo-border/30 text-[8px] font-bold text-accent">
                      {entry.progress}%
                    </div>
                    
                    {/* Hover detail tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-sm bg-black border-2 border-neo-border p-sm w-44 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-neo text-[10px]">
                      <div className="font-bold uppercase text-primary mb-1 line-clamp-1">{entry.game.title}</div>
                      <div className="flex justify-between text-muted-text font-bold uppercase mb-1">
                        <span>{getStatusLabelText(entry.status)}</span>
                        <span>{Math.floor(entry.playTimeMinutes / 60)}H</span>
                      </div>
                      <ProgressBar value={entry.progress} variant={entry.status === 'PLAYING' ? 'accent' : 'success'} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Physical shelf base bar */}
              <div className="h-6 bg-[#1f1f1f] border-t-4 border-b-4 border-neo-border/20 shadow-[0_4px_8px_rgba(0,0,0,0.7)] flex items-center justify-center text-[10px] font-title tracking-[0.25em] text-muted-text uppercase">
                ⚙️ BACKLOG CARTRIDGE SHELF {shelfIndex + 1}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    if (loading || preferencesLoading) {
      return renderLoader();
    }

    if (processedEntries.length === 0) {
      return renderEmptyState();
    }

    switch (defaultView) {
      case 'LIST':
        return renderListView();
      case 'SHELF':
        return renderShelfView();
      case 'CARD':
      default:
        return renderCardView();
    }
  };

  return (
    <div className="flex flex-col gap-xl page-transition-wipe">
      {/* Intro & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neo-border/10 pb-md gap-md">
        <div>
          <h1 className="text-4xl md:text-5xl font-title tracking-[0.06em] font-normal text-primary leading-none uppercase">ARMORY</h1>
          <p className="text-xs md:text-sm font-sans text-muted-text mt-xs uppercase tracking-widest">
            Manage your personal backlog cartridge catalog.
          </p>
        </div>

        {/* Filter / Sort Control Dashboard */}
        <div className="flex flex-wrap items-center gap-sm">
          {/* Status Filter Rack */}
          <div className="flex border-[3px] border-neo-border p-0.5 bg-surface select-none h-10 items-center">
            {['ALL', 'PLAYING', 'COMPLETED', 'TO_PLAY'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-md h-full text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-100 ease-in-out cursor-pointer flex items-center justify-center ${
                  statusFilter === st
                    ? 'bg-accent text-primary'
                    : 'text-muted-text hover:text-primary bg-transparent'
                }`}
              >
                {st === 'ALL' ? 'ALL' : getStatusLabelText(st)}
              </button>
            ))}
          </div>

          {/* Sort Switch */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 bg-surface border-[3px] border-neo-border px-md text-[10px] font-mono font-bold text-primary rounded-none focus:outline-none focus:border-accent cursor-pointer uppercase tracking-widest transition-colors duration-100"
          >
            <option value="TITLE">SORT: A-Z</option>
            <option value="PLAYTIME">SORT: TIME</option>
          </select>

          <div className="h-10 flex items-center text-[10px] font-mono text-muted-text font-bold uppercase tracking-widest bg-surface px-md border-[3px] border-neo-border/20">
            LAYOUT: {defaultView || 'CARD'}
          </div>
        </div>
      </div>

      {/* Main layout container */}
      {renderContent()}

      {/* Interactive Editor Overlay utilizing unified Modal */}
      <Modal
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        title="MISSION CONTROL"
      >
        {editingEntry && (
          <div className="flex flex-col gap-md font-sans text-primary">
            {/* 1. Game Information */}
            <div>
              <span className="text-[10px] text-muted-text uppercase font-bold tracking-wider">GAME TITLE</span>
              <div className="text-lg font-title uppercase tracking-wide text-primary mt-xs">{editingEntry.game.title}</div>
            </div>

            {/* 2. Progress Slider */}
            <div>
              <span className="text-[10px] text-muted-text uppercase font-bold tracking-wider">HP PROGRESS: {modalProgress}%</span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={modalProgress}
                onChange={(e) => setModalProgress(Number(e.target.value))}
                className="w-full accent-accent bg-surface h-2 outline-none border border-neo-border mt-xs cursor-pointer"
              />
            </div>

            {/* 3. Playtime Input (Identical Widths) */}
            <div>
              <span className="text-[10px] text-muted-text uppercase font-bold tracking-wider">TOTAL PLAY TIME (MINUTES)</span>
              <div className="flex flex-col gap-sm mt-xs">
                <input
                  type="number"
                  min="0"
                  value={modalPlayTime}
                  onChange={(e) => setModalPlayTime(Number(e.target.value))}
                  className="w-full border-[3px] border-black bg-surface text-primary px-md py-sm font-bold rounded-none focus:outline-none focus:border-accent"
                />
                <div className="grid grid-cols-2 gap-sm">
                  <button
                    type="button"
                    onClick={() => setModalPlayTime(prev => prev + 30)}
                    className="border-[3px] border-black bg-surface hover:bg-primary hover:text-black py-1.5 text-xs font-bold transition-all rounded-none cursor-pointer"
                  >
                    +30 MINUTES
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalPlayTime(prev => prev + 60)}
                    className="border-[3px] border-black bg-surface hover:bg-primary hover:text-black py-1.5 text-xs font-bold transition-all rounded-none cursor-pointer"
                  >
                    +1 HOUR
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Status Selector */}
            <div>
              <span className="text-[10px] text-muted-text uppercase font-bold tracking-wider font-sans">CURRENT EXP STATUS</span>
              <div className="grid grid-cols-2 gap-sm mt-xs">
                {['PLAYING', 'COMPLETED', 'TO_PLAY', 'DISCONTINUED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setModalStatus(st)}
                    className={`py-xs text-[10px] font-black tracking-widest uppercase border-[3px] border-black transition-all rounded-none cursor-pointer ${
                      modalStatus === st 
                        ? 'bg-accent text-primary shadow-[2px_2px_0px_rgba(0,0,0,1)]' 
                        : 'bg-surface text-muted-text hover:text-primary'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Save/Cancel/Scrub Buttons */}
            <div className="mt-md">
              {confirmScrub ? (
                <div className="border-[3px] border-accent bg-accent/5 p-sm text-center flex flex-col gap-sm">
                  <div className="text-[10px] font-mono text-accent font-bold uppercase tracking-widest animate-pulse">
                    ⚠️ WARNING: CONFIRM DESTRUCTIVE SCRUB PROCEDURE?
                  </div>
                  <div className="flex gap-sm">
                    <Button
                      variant="primary"
                      className="flex-1 py-1 text-xs"
                      onClick={handleDeleteScrub}
                      disabled={scrubbing}
                    >
                      {scrubbing ? 'SCRUBBING...' : 'CONFIRM SCRUB'}
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1 py-1 text-xs"
                      onClick={() => setConfirmScrub(false)}
                      disabled={scrubbing}
                    >
                      ABORT
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-sm">
                  <div className="flex gap-md">
                    <Button
                      onClick={handleSaveMission}
                      disabled={updating}
                      variant="primary"
                      className="flex-1 font-title"
                    >
                      {updating ? 'WRITING MEMORY...' : '💾 WRITE MEMORY'}
                    </Button>
                    <Button
                      onClick={() => setEditingEntry(null)}
                      variant="secondary"
                      className="flex-1 font-title"
                    >
                      CANCEL
                    </Button>
                  </div>
                  <Button
                    onClick={() => setConfirmScrub(true)}
                    variant="secondary"
                    className="w-full font-title border-accent/40 text-accent hover:bg-accent/15 hover:text-accent py-xs"
                  >
                    🗑️ SCRUB CARTRIDGE CORE
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
