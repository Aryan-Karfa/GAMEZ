import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useLibraryStore } from '../../store/libraryStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { useUiStore } from '../../store/uiStore.js';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

function StatusScreen({ stats }) {
  return (
    <Card title="⚔️ OPERATOR STATUS MATRIX" variant="default" className="font-sans relative overflow-hidden select-none">
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%]" />
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-md text-center">
        <div className="border-[3px] border-neo-border/20 bg-surface p-sm">
          <div className="text-[10px] text-muted-text uppercase font-bold tracking-wider">LEVEL (TOTAL)</div>
          <div className="text-3xl font-title text-primary tracking-widest mt-xs">{stats.totalGames}</div>
        </div>

        <div className="border-[3px] border-neo-border/20 bg-surface p-sm">
          <div className="text-[10px] text-muted-text uppercase font-bold tracking-wider font-sans">QUESTING (PLAYING)</div>
          <div className="text-3xl font-title text-accent tracking-widest mt-xs">{stats.playing}</div>
        </div>

        <div className="border-[3px] border-neo-border/20 bg-surface p-sm">
          <div className="text-[10px] text-muted-text uppercase font-bold tracking-wider">JOURNAL (BACKLOG)</div>
          <div className="text-3xl font-title text-primary tracking-widest mt-xs">{stats.toPlay}</div>
        </div>

        <div className="border-[3px] border-neo-border/20 bg-surface p-sm">
          <div className="text-[10px] text-muted-text uppercase font-bold tracking-wider">CLEARED (COMPLETED)</div>
          <div className="text-3xl font-title text-green-500 tracking-widest mt-xs">{stats.completed}</div>
        </div>

        <div className="border-[3px] border-neo-border/20 bg-surface p-sm col-span-2 md:col-span-1">
          <div className="text-[10px] text-muted-text uppercase font-bold tracking-wider">DISCARDED</div>
          <div className="text-3xl font-title text-muted-text tracking-widest mt-xs">{stats.discontinued}</div>
        </div>
      </div>

      <div className="mt-md border-t-[3px] border-neo-border/10 pt-md">
        <div className="flex justify-between items-center mb-xs text-xs font-bold tracking-wider">
          <span className="text-primary uppercase tracking-widest">COMPLETION EXP BAR</span>
        </div>
        <ProgressBar value={stats.completionRate} variant="success" />
      </div>
    </Card>
  );
}

function CartridgeCard({ entry, onEdit }) {
  const { progress, playTimeMinutes, game, status } = entry;
  
  const hours = Math.floor(playTimeMinutes / 60);
  const minutes = playTimeMinutes % 60;
  const playtimeString = hours > 0 ? `${hours}H ${minutes}M` : `${minutes}M`;

  const getStatusBadge = (st) => {
    switch (st) {
      case 'PLAYING': return { text: 'ACTIVE', var: 'accent' };
      case 'COMPLETED': return { text: 'CLEARED', var: 'default' };
      default: return { text: 'BACKLOG', var: 'outline' };
    }
  };

  const badgeInfo = getStatusBadge(status);

  return (
    <Card hasScrewHeads={true} className="hover:shadow-neo-accent transition-all duration-150 select-none relative flex flex-col justify-between h-90 rounded-none">
      <div className="absolute top-0 left-0 right-0 h-4 bg-neo-border/5 border-b-[3px] border-neo-border/20" />
      
      <div className="h-35 bg-surface border-[3px] border-black overflow-hidden relative group mt-sm">
        {game.coverImage ? (
          <img
            src={game.coverImage}
            alt={game.title}
            className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-150"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-text uppercase font-bold tracking-widest bg-surface">
            NO LABEL
          </div>
        )}
        <div className="absolute top-sm right-sm z-20">
          <Badge variant={badgeInfo.var}>
            {badgeInfo.text}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-xs mt-sm grow">
        <h4 className="text-md font-title tracking-wider uppercase text-primary line-clamp-1">
          {game.title}
        </h4>
        <div className="flex justify-between items-center text-[10px] text-muted-text font-bold uppercase tracking-wider">
          <span className="truncate max-w-35">{game.platforms?.join(', ') || 'PC'}</span>
          <span>⌚ {playtimeString}</span>
        </div>
        
        <div className="mt-xs">
          <div className="flex justify-between items-center text-[10px] text-primary/70 font-bold uppercase tracking-widest mb-0.5">
            <span>HP PROGRESS</span>
          </div>
          <ProgressBar value={progress} variant={status === 'PLAYING' ? 'accent' : 'success'} />
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
}

function SkeletonCartridge() {
  return (
    <Card className="h-90 animate-pulse relative flex flex-col justify-between rounded-none">
      <div className="absolute top-0 left-0 right-0 h-4 bg-neo-border/5 border-b-[3px] border-neo-border/20" />
      <div className="h-35 bg-[#2a2a2a] border-[3px] border-black mt-sm" />
      <div className="flex flex-col gap-sm mt-sm grow">
        <div className="h-6 bg-[#2a2a2a] w-3/4" />
        <div className="h-4 bg-[#2a2a2a] w-1/2" />
        <div className="h-5 bg-[#2a2a2a] w-full mt-sm" />
      </div>
      <div className="h-10 bg-[#2a2a2a] w-full mt-sm" />
    </Card>
  );
}

export default function DashboardPage() {
  const { entries, fetchLibrary, loading } = useLibraryStore(
    useShallow((state) => ({
      entries: state.entries,
      fetchLibrary: state.fetchLibrary,
      loading: state.loading,
    }))
  );
  
  const user = useAuthStore((state) => state.user);
  
  const [editingEntry, setEditingEntry] = useState(null);
  const [modalStatus, setModalStatus] = useState('PLAYING');
  const [modalProgress, setModalProgress] = useState(0);
  const [modalPlayTime, setModalPlayTime] = useState(0);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const stats = useMemo(() => {
    const totalGames = entries.length;
    const playing = entries.filter((e) => e.status === 'PLAYING').length;
    const toPlay = entries.filter((e) => e.status === 'TO_PLAY').length;
    const completed = entries.filter((e) => e.status === 'COMPLETED').length;
    const discontinued = entries.filter((e) => e.status === 'DISCONTINUED').length;
    const completionRate = totalGames > 0 ? Number(((completed / totalGames) * 100).toFixed(1)) : 0;
    
    return { totalGames, playing, toPlay, completed, discontinued, completionRate };
  }, [entries]);

  const activeQuests = useMemo(() => {
    return entries
      .filter((e) => e.status === 'PLAYING')
      .sort((a, b) => new Date(b.lastProgressUpdate) - new Date(a.lastProgressUpdate));
  }, [entries]);

  const recentlyUpdated = useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  }, [entries]);

  const recentAdditions = useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [entries]);

  const handleOpenEdit = (entry) => {
    setEditingEntry(entry);
    setModalStatus(entry.status);
    setModalProgress(entry.progress);
    setModalPlayTime(entry.playTimeMinutes);
  };

  const handleSaveMission = async () => {
    setUpdating(true);
    const result = await useLibraryStore.getState().updateEntry(editingEntry.id, {
      status: modalStatus,
      progress: modalProgress,
      playTimeMinutes: modalPlayTime,
    });
    setUpdating(false);
    if (result.success) {
      useUiStore.getState().addToast('MISSION JOURNAL WRITTEN SUCCESSFULLY.', 'success');
      setEditingEntry(null);
    } else {
      useUiStore.getState().addToast(result.error || 'FAILED TO UPDATE DATABASE JOURNAL.', 'error');
    }
  };

  if (loading && entries.length === 0) {
    return (
      <div className="space-y-lg animate-pulse">
        <div className="h-10 bg-[#2a2a2a] w-1/4" />
        <div className="h-6 bg-[#2a2a2a] w-1/2 mt-sm" />
        <div className="h-40 bg-[#2a2a2a] w-full mt-lg border-[6px] border-neo-border" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-lg">
          <SkeletonCartridge />
          <SkeletonCartridge />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-xl">
      {/* Hero Header */}
      <div className="border-b border-neo-border/10 pb-md">
        <h1 className="text-4xl md:text-5xl font-title tracking-[0.06em] font-normal text-primary leading-none uppercase">
          ⚔️ GREETINGS, COMMANDER {user?.username || 'GUEST'}
        </h1>
        <p className="text-xs md:text-sm font-sans text-muted-text mt-xs uppercase tracking-widest">
          TERMINAL ACTIVE // SENSOR NETWORK LINK STABLE // CHOOSE CARTRIDGE TO DEPLOY
        </p>
      </div>

      {/* Stats Board */}
      <StatusScreen stats={stats} />

      {entries.length > 0 ? (
        /* Main Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mt-md">
          {/* Active Missions */}
          <div className="lg:col-span-8 space-y-md">
            <h2 className="text-[1.8rem] font-title tracking-wider font-normal text-primary border-b-4 border-neo-border pb-xs uppercase flex items-center justify-between">
              <span>🎮 ACTIVE MISSIONS</span>
              <span className="h-2 w-24 warning-stripes opacity-20 border border-neo-border" />
            </h2>
            {activeQuests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                {activeQuests.map((entry) => (
                  <CartridgeCard key={entry.id} entry={entry} onEdit={handleOpenEdit} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="💤"
                title="ACTIVE QUEUE EMPTY"
                description="Slot in a backlog cartridge or scan the RAWG database to populate your active armory."
                variant="default"
                action={
                  <Link
                    to="/library"
                    className="inline-block px-md py-1.5 border-[3px] border-black bg-[#EAEAEA] text-black font-title text-sm tracking-wider uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-neo transition-all duration-100 ease-in-out rounded-none active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    📖 ARMORY JOURNAL
                  </Link>
                }
              />
            )}
          </div>

          {/* Feeds */}
          <div className="lg:col-span-4 flex flex-col gap-lg">
            {/* Recent Updates */}
            <Card title="📜 MISSION JOURNAL LOGS" className="grow">
              {recentlyUpdated.length > 0 ? (
                <div className="space-y-sm">
                  {recentlyUpdated.map((entry) => (
                    <div key={entry.id} className="flex gap-sm items-center border-b border-neo-border/10 pb-xs">
                      <div className="h-10 w-8 bg-surface border-2 border-black shrink-0 overflow-hidden flex items-center justify-center text-[10px] text-muted-text font-bold">
                        {entry.game.coverImage ? (
                          <img src={entry.game.coverImage} alt="" className="w-full h-full object-cover grayscale" />
                        ) : (
                          '-'
                        )}
                      </div>
                      <div className="grow min-w-0">
                        <div className="text-xs font-bold text-primary truncate uppercase">{entry.game.title}</div>
                        <div className="text-[10px] text-muted-text uppercase tracking-wider flex justify-between mt-0.5">
                          <span className="text-accent">{entry.status.replace('_', ' ')}</span>
                          <span>{lastUpdatedDateText(entry.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-lg text-xs text-muted-text uppercase tracking-widest">LOG EMPTY</div>
              )}
            </Card>

            {/* Recent Additions */}
            <Card title="📦 NEW ACQUISITIONS" className="grow">
              {recentAdditions.length > 0 ? (
                <div className="space-y-sm">
                  {recentAdditions.map((entry) => (
                    <div key={entry.id} className="flex gap-sm items-center border-b border-neo-border/10 pb-xs">
                      <div className="h-10 w-8 bg-surface border-2 border-black shrink-0 overflow-hidden flex items-center justify-center text-[10px] text-muted-text font-bold">
                        {entry.game.coverImage ? (
                          <img src={entry.game.coverImage} alt="" className="w-full h-full object-cover grayscale" />
                        ) : (
                          '-'
                        )}
                      </div>
                      <div className="grow min-w-0">
                        <div className="text-xs font-bold text-primary truncate uppercase">{entry.game.title}</div>
                        <div className="text-[10px] text-muted-text uppercase tracking-wider flex justify-between mt-0.5">
                          <span>{entry.status.replace('_', ' ')}</span>
                          <span>{lastUpdatedDateText(entry.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-lg text-xs text-muted-text uppercase tracking-widest">LOG EMPTY</div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        !loading && (
          <EmptyState
            icon="📭"
            title="YOUR ARMORY IS EMPTY"
            description="Your tracking database is offline. Scan RAWG data nodes to establish cartridge collection coordinates."
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
        )
      )}

      {/* Reusable Modal Component Integration */}
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

            {/* 5. Save/Cancel Buttons */}
            <div className="mt-md flex gap-md">
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
          </div>
        )}
      </Modal>
    </div>
  );
}

function lastUpdatedDateText(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
