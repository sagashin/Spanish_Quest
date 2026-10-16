// Vamos! Quest - Main Application (React 18 + Tailwind CSS)
const APP_JSX_SOURCE = `
const { useState, useEffect, useMemo, useRef } = React;

// Helper for shuffling arrays
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Clean punctuation from chunk for speech synthesis
function cleanWordForSpeech(word) {
  return String(word || '').replace(/[¡!¿?.,]/g, '').trim();
}

// SVG Icon component for crisp sporty icons
function Icon({ name, className = "w-5 h-5" }) {
  const icons = {
    Flame: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2c1.5 3.5 4 5.5 4 9a4 4 0 11-8 0c0-1.5.5-3 1.5-4.5C9 8.5 8 10.5 8 12.5A6 6 0 0014 18.5a6 6 0 004-10.5C17.5 5 15 3 12 2z" />
        <path fillOpacity="0.4" d="M12 22a7 7 0 007-7c0-3.5-2.5-6.5-5.5-8.5.5 2 0 4-1.5 5.5-1-1.5-1.5-3-1-4.5C7.5 10 5 12.5 5 15a7 7 0 007 7z" />
      </svg>
    ),
    Zap: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    Trophy: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
    Volume2: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    ),
    Mic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    ),
    Home: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    Swords: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
        <line x1="13" x2="19" y1="19" y2="13" />
        <line x1="16" x2="20" y1="16" y2="20" />
        <line x1="19" x2="21" y1="21" y2="19" />
        <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
        <line x1="5" x2="9" y1="14" y2="18" />
        <line x1="7" x2="4" y1="17" y2="20" />
        <line x1="3" x2="5" y1="19" y2="21" />
      </svg>
    ),
    BookOpen: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    MessageSquare: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    Settings: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    Check: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    Sparkles: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    ),
    HandMetal: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 12.5V10a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1.4" />
        <path d="M14 11V9a2 2 0 1 0-4 0v2" />
        <path d="M10 10.5V5a2 2 0 1 0-4 0v9" />
        <path d="m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v5" />
      </svg>
    ),
    Utensils: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    ),
    Compass: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    ArrowLeft: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
    ),
    Download: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
    ),
    Upload: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" x2="12" y1="3" y2="15" />
      </svg>
    ),
    Search: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    )
  };
  return icons[name] || icons.Sparkles;
}

// ==================== 1. DASHBOARD COMPONENT ====================
function DashboardView({ state, stats, onSelectCategoryStage, onStartReview, onNavigate, onOpenSettings }) {
  const [showRanksModal, setShowRanksModal] = useState(false);
  const dueCount = stats.duePhrases.length;

  return (
    <div className="space-y-6 pb-8 animate-pop">
      {/* Top Hero Banner & Status Cards */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/95 to-rose-950/70 p-5 sm:p-6 shadow-2xl">
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-gradient-to-br from-red-600/25 to-amber-500/20 blur-2xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-xs font-bold text-amber-300 mb-2">
              <span>🇪🇸 SPAIN EXPEDITION 2027</span>
              <span className="text-white/40">|</span>
              <span>PLAYER: {state.playerName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              ¡Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-400">{state.playerName}</span>! ⚽
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              スペインのピッチと街で使えるリアルな一言を今日もモノにしよう！
            </p>
          </div>

          <button
            onClick={() => window.VAMOS_SPEECH.speakSpanish('¡Hola! ¡Vamos a España!')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-amber-300 transition active:scale-95"
            title="スペイン語ボイスをテスト"
          >
            <Icon name="Volume2" className="w-4 h-4 text-amber-400" />
            <span>¡Vamos! 音声</span>
          </button>
        </div>

        {/* 4 Key Status Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Level */}
          <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-3.5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-slate-950 font-black text-lg font-sport shadow-lg shadow-amber-500/20">
              Lv.{stats.level}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-slate-400 uppercase">現在レベル</div>
              <div className="text-sm font-black text-white truncate">あと {stats.xpForNextLevel - stats.xpInLevel} XP</div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: \`\${Math.round((stats.xpInLevel / stats.xpForNextLevel) * 100)}%\` }}
                />
              </div>
            </div>
          </div>

          {/* Total XP */}
          <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-3.5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Icon name="Zap" className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">獲得XP</div>
              <div className="text-xl font-black text-amber-300 font-sport">{stats.xp.toLocaleString()} <span className="text-xs font-bold">XP</span></div>
            </div>
          </div>

          {/* Streak */}
          <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-3.5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl">
              🔥
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">連続学習</div>
              <div className="text-xl font-black text-rose-400 font-sport">{state.streak} <span className="text-xs font-bold text-slate-300">日連続</span></div>
            </div>
          </div>

          {/* Learned Phrases */}
          <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-3.5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Icon name="BookOpen" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">習得フレーズ</div>
              <div className="text-xl font-black text-emerald-300 font-sport">
                {stats.learnedCount} <span className="text-xs font-bold text-slate-400">/ {stats.totalPhrases}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's SRS Review Alert Banner */}
      <div
        className={\`rounded-3xl p-4 sm:p-5 border transition-all \${
          dueCount > 0
            ? 'bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/15 border-amber-400/60 animate-pulse-gold'
            : 'bg-slate-900/80 border-white/10'
        }\`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 \${
              dueCount > 0 ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30' : 'bg-emerald-500/20 text-emerald-400'
            }\`}>
              {dueCount > 0 ? '⚡' : '✅'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  忘却曲線 SRS アラート
                </span>
                {dueCount > 0 && (
                  <span className="text-xs font-bold text-rose-300 animate-bounce">● 今が記憶定着のチャンス！</span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-1">
                {dueCount > 0
                  ? \`今日復習すべきフレーズが \${dueCount}件 あります！\`
                  : '今日のSRS復習はすべて完了しています！🎉'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {dueCount > 0
                  ? '忘れる前に復習して「マスター（金カード）」へ進化させよう！ボーナスXPも獲得！'
                  : 'いつでも「コレクション」から自由復習や発音チェックができるよ。'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onStartReview(dueCount > 0 ? 'due' : 'practice')}
            className={\`px-5 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shrink-0 transition active:scale-95 shadow-lg \${
              dueCount > 0
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:brightness-110 shadow-amber-500/25'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30'
            }\`}
          >
            <Icon name="Sparkles" className="w-4 h-4" />
            <span>
              {dueCount > 0 ? \`今日の復習クエスト（\${dueCount}件）\` : '復習プラクティス（5問）'}
            </span>
          </button>
        </div>
      </div>

      {/* Spain Expedition Readiness Card (称号＆渡航準備度) */}
      <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400">🇪🇸 SPAIN READINESS</span>
            <h2 className="text-base sm:text-lg font-black text-white">スペイン渡航準備度＆称号</h2>
          </div>
          <button
            onClick={() => setShowRanksModal(!showRanksModal)}
            className="text-xs font-bold text-amber-300 hover:underline flex items-center gap-1"
          >
            <span>称号一覧を見る</span>
            <span>{showRanksModal ? '▲' : '▼'}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-950/75 rounded-2xl p-4 border border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600/30 to-amber-500/30 border border-amber-400/40 flex items-center justify-center text-4xl shrink-0 shadow-inner">
            {stats.currentRank.badge}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-amber-400 block">{stats.currentRank.enTitle}</span>
                <h3 className="text-xl sm:text-2xl font-black text-white">{stats.currentRank.title}</h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-sport text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-400">
                  {stats.readinessPct}%
                </span>
                <span className="text-xs text-slate-400 block">渡航準備度</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-1">{stats.currentRank.desc}</p>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mt-3 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: \`\${Math.max(4, stats.readinessPct)}%\` }}
              />
            </div>
            {stats.nextRank ? (
              <div className="text-[11px] text-slate-400 mt-1.5 flex justify-between">
                <span>現在: {stats.currentRank.title}</span>
                <span className="text-amber-300 font-bold">
                  次の称号「{stats.nextRank.badge} {stats.nextRank.title}」まで あと {Math.max(1, stats.nextRank.minPct - stats.readinessPct)}%
                </span>
              </div>
            ) : (
              <div className="text-[11px] text-amber-300 font-bold mt-1.5">
                👑 最高称号「ピッチの司令塔」に到達！スペインで最高の体験をしよう！
              </div>
            )}
          </div>
        </div>

        {showRanksModal && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-2.5 animate-pop">
            {window.VAMOS_DATA.ranks.map((r, idx) => {
              const unlocked = stats.readinessPct >= r.minPct;
              return (
                <div
                  key={idx}
                  className={\`rounded-xl p-3 border text-center \${
                    unlocked
                      ? 'bg-amber-500/10 border-amber-400/40 text-white'
                      : 'bg-slate-950/50 border-white/5 text-slate-500 opacity-60'
                  }\`}
                >
                  <div className="text-2xl mb-1">{r.badge}</div>
                  <div className="text-xs font-black">{r.title}</div>
                  <div className="text-[10px] text-amber-300/80 font-sport mt-0.5">準備度 {r.minPct}%〜</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Progress Bars & Direct Stage Launchers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">QUEST CATEGORIES</span>
            <h2 className="text-lg sm:text-xl font-black text-white">カテゴリ別進捗＆クエスト出撃</h2>
          </div>
          <button
            onClick={() => onNavigate('quest')}
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <span>全ステージを見る →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.categoryStats.map(cat => {
            const st1Cleared = state.completedStages[\`\${cat.id}_1\`];
            const st2Cleared = state.completedStages[\`\${cat.id}_2\`];
            return (
              <div
                key={cat.id}
                className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 hover:border-white/25 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={\`w-12 h-12 rounded-2xl bg-gradient-to-br \${cat.color} flex items-center justify-center text-white shadow-lg\`}>
                        <Icon name={cat.icon} className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">{cat.name}</h3>
                        <p className="text-xs text-slate-400 line-clamp-1">{cat.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-lg font-black font-sport text-amber-300">{cat.pct}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>習得: <strong className="text-white">{cat.learned}</strong> / {cat.total} フレーズ</span>
                      <span>マスター: <strong className="text-amber-300">{cat.mastered}</strong></span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={\`h-full bg-gradient-to-r \${cat.color} rounded-full transition-all duration-500\`}
                        style={{ width: \`\${Math.max(4, cat.pct)}%\` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stage Quick Launch Buttons */}
                <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-white/5">
                  <button
                    onClick={() => onSelectCategoryStage(cat.id, 1)}
                    className={\`py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition active:scale-95 \${
                      st1Cleared
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                        : 'bg-white/10 text-white hover:bg-white/15 border border-white/10'
                    }\`}
                  >
                    <span>{st1Cleared ? '★' : '▶'} Stage 1 (基本)</span>
                  </button>
                  <button
                    onClick={() => onSelectCategoryStage(cat.id, 2)}
                    className={\`py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition active:scale-95 \${
                      st2Cleared
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                        : 'bg-gradient-to-r from-rose-600 to-amber-500 text-slate-950 hover:brightness-110'
                    }\`}
                  >
                    <span>{st2Cleared ? '★' : '🔥'} Stage 2 (実践)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roleplay & Backup Quick Promo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => onNavigate('roleplay')}
          className="cursor-pointer rounded-3xl bg-gradient-to-br from-rose-900/40 via-slate-900 to-slate-900 border border-rose-500/30 p-5 hover:border-rose-400/60 transition flex items-center justify-between gap-4"
        >
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              AI ROLEPLAY CHALLENGE
            </span>
            <h3 className="text-base font-black text-white mt-2">現地3ターン対話シミュレーション 🗣️</h3>
            <p className="text-xs text-slate-300 mt-1">
              サッカー練習への参加やバルでのチュロス注文をリアルに体験！
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-2xl shrink-0">
            ⚽
          </div>
        </div>

        <div
          onClick={onOpenSettings}
          className="cursor-pointer rounded-3xl bg-slate-900/90 border border-white/10 p-5 hover:border-white/25 transition flex items-center justify-between gap-4"
        >
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
              DATA BACKUP & SETTINGS
            </span>
            <h3 className="text-base font-black text-white mt-2">学習データのJSON保存・復元 💾</h3>
            <p className="text-xs text-slate-300 mt-1">
              進捗は自動保存中！スマホやPCへのデータ引き継ぎもワンタップ。
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
            <Icon name="Settings" className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 2. QUEST / LESSON MODE COMPONENT ====================
function QuestModeView({ state, initialSelection, onUpdateState, onGoToCollection }) {
  const categories = window.VAMOS_DATA.categories;
  const allPhrases = window.VAMOS_DATA.phrases;

  const [selectedCategory, setSelectedCategory] = useState(
    (initialSelection && initialSelection.category) || 'soccer'
  );
  const [activeQuest, setActiveQuest] = useState(null); // { categoryId, stage, questions, currentIndex, score, newlyUnlockedIds }
  const [questionState, setQuestionState] = useState(null);

  // If launched directly from Dashboard with category + stage
  useEffect(() => {
    if (initialSelection && initialSelection.category && initialSelection.stage) {
      setSelectedCategory(initialSelection.category);
      startStage(initialSelection.category, initialSelection.stage);
    }
  }, [initialSelection]);

  // Build a 5-question micro-learning stage mixing Chunk Puzzle, 4-Choice Listening, and Speaking Challenge
  function startStage(categoryId, stageNum) {
    const catPhrases = allPhrases.filter(p => p.category === categoryId);
    const stagePool = stageNum === 'all'
      ? catPhrases
      : catPhrases.filter(p => p.stage === stageNum);

    // Ensure 5 questions per stage (combine stage phrases + review reinforcement from same category)
    const otherCatPhrases = catPhrases.filter(p => p.stage !== stageNum);
    const basePool = [...shuffleArray(stagePool), ...shuffleArray(otherCatPhrases)];
    const fivePhrases = [];
    for (let i = 0; i < 5; i++) {
      fivePhrases.push(basePool[i % basePool.length]);
    }

    // Question formats: 0=chunk, 1=listening, 2=chunk, 3=listening, 4=speaking
    const types = ['chunk', 'listening', 'chunk', 'listening', 'speaking'];

    const questions = fivePhrases.map((phrase, idx) => {
      const qType = types[idx];
      if (qType === 'chunk') {
        const allBlocks = shuffleArray([
          ...phrase.chunks.map((text, i) => ({ id: \`c_\${i}_\${text}\`, text, isTarget: true })),
          ...(phrase.distractors || []).slice(0, 2).map((text, i) => ({ id: \`d_\${i}_\${text}\`, text, isTarget: false }))
        ]);
        return {
          index: idx,
          type: 'chunk',
          phrase,
          poolBlocks: allBlocks
        };
      } else if (qType === 'listening') {
        const wrongOptions = shuffleArray(
          allPhrases.filter(p => p.id !== phrase.id)
        ).slice(0, 3);
        const options = shuffleArray([phrase, ...wrongOptions]);
        return {
          index: idx,
          type: 'listening',
          phrase,
          options
        };
      } else {
        return {
          index: idx,
          type: 'speaking',
          phrase
        };
      }
    });

    // Automatically register the first phrase into the Vocabulary Bank
    const newlyUnlocked = [];
    const firstId = questions[0].phrase.id;
    if (!state.cards[firstId]?.seen) {
      newlyUnlocked.push(firstId);
    }
    const nextState = window.VAMOS_STORAGE.markPhraseSeen(state, firstId);
    onUpdateState(nextState);

    const questObj = {
      categoryId,
      stage: stageNum,
      questions,
      currentIndex: 0,
      correctCount: 0,
      earnedXp: 0,
      newlyUnlockedIds: newlyUnlocked,
      finished: false
    };
    setActiveQuest(questObj);
    initQuestionInteraction(questions[0], nextState.autoSpeak);
  }

  function initQuestionInteraction(q, shouldSpeak) {
    setQuestionState({
      selectedBlocks: [],
      selectedOptionId: null,
      isSubmitted: false,
      isCorrect: false,
      isListeningMic: false,
      recognizedText: '',
      micMessage: '',
      pronunciationScore: null
    });
    if (shouldSpeak) {
      setTimeout(() => {
        window.VAMOS_SPEECH.speakSpanish(q.phrase.spanish);
      }, 220);
    }
  }

  // Handle tapping a Spanish word block in Chunk Puzzle
  function handleTapBlock(block, isFromSelected) {
    if (!questionState || questionState.isSubmitted) return;
    const currentQ = activeQuest.questions[activeQuest.currentIndex];

    // Speak the tapped word in Spanish!
    window.VAMOS_SPEECH.playSfx('tap', state.soundEnabled);
    window.VAMOS_SPEECH.speakSpanish(cleanWordForSpeech(block.text), { rate: 0.95 });

    if (isFromSelected) {
      setQuestionState(prev => ({
        ...prev,
        selectedBlocks: prev.selectedBlocks.filter(b => b.id !== block.id)
      }));
    } else {
      setQuestionState(prev => ({
        ...prev,
        selectedBlocks: [...prev.selectedBlocks, block]
      }));
    }
  }

  // Submit Chunk Puzzle answer
  function submitChunkAnswer() {
    if (!questionState || questionState.isSubmitted) return;
    const currentQ = activeQuest.questions[activeQuest.currentIndex];
    const userWords = questionState.selectedBlocks.map(b => b.text);
    const targetWords = currentQ.phrase.chunks;
    const isCorrect =
      userWords.length === targetWords.length &&
      userWords.every((w, i) => w === targetWords[i]);

    finalizeQuestionResult(isCorrect);
  }

  // Submit 4-choice Listening answer
  function submitListeningOption(optionPhrase) {
    if (!questionState || questionState.isSubmitted) return;
    const currentQ = activeQuest.questions[activeQuest.currentIndex];
    const isCorrect = optionPhrase.id === currentQ.phrase.id;
    setQuestionState(prev => ({
      ...prev,
      selectedOptionId: optionPhrase.id
    }));
    finalizeQuestionResult(isCorrect);
  }

  // Start Web Speech API microphone recognition for Speaking question
  function handleStartMic() {
    if (!questionState || questionState.isSubmitted) return;
    const currentQ = activeQuest.questions[activeQuest.currentIndex];

    setQuestionState(prev => ({
      ...prev,
      isListeningMic: true,
      micMessage: '🎙️ スペイン語を聞き取り中... 元気よく発音してみよう！'
    }));

    window.VAMOS_SPEECH.startSpeechRecognition({
      onResult: (transcript, alternatives) => {
        let bestEval = window.VAMOS_SPEECH.evaluatePronunciation(currentQ.phrase.spanish, transcript);
        (alternatives || []).forEach(alt => {
          const ev = window.VAMOS_SPEECH.evaluatePronunciation(currentQ.phrase.spanish, alt);
          if (ev.score > bestEval.score) bestEval = ev;
        });

        setQuestionState(prev => ({
          ...prev,
          isListeningMic: false,
          recognizedText: transcript,
          pronunciationScore: bestEval.score,
          micMessage: bestEval.isMatch
            ? \`🎉 バッチリ聞き取れました！「\${transcript}」(一致度 \${bestEval.score}%)\`
            : \`聞き取り結果:「\${transcript}」— もう一度マイクを押すか「タップで発音クリア」で進めるよ！\`
        }));

        if (bestEval.isMatch) {
          finalizeQuestionResult(true);
        }
      },
      onError: (errMsg) => {
        setQuestionState(prev => ({
          ...prev,
          isListeningMic: false,
          micMessage: errMsg
        }));
      },
      onEnd: () => {
        setQuestionState(prev => ({
          ...prev,
          isListeningMic: false
        }));
      }
    });
  }

  // Fallback / Tap to clear speaking challenge
  function handleTapClearSpeaking() {
    if (!questionState || questionState.isSubmitted) return;
    const currentQ = activeQuest.questions[activeQuest.currentIndex];
    window.VAMOS_SPEECH.speakSpanish(currentQ.phrase.spanish);
    setQuestionState(prev => ({
      ...prev,
      recognizedText: currentQ.phrase.spanish,
      pronunciationScore: 100,
      micMessage: '✨ 声出し確認クリア！ネイティブ発音をしっかりイメージできたね！'
    }));
    finalizeQuestionResult(true);
  }

  function finalizeQuestionResult(isCorrect) {
    const currentQ = activeQuest.questions[activeQuest.currentIndex];
    window.VAMOS_SPEECH.playSfx(isCorrect ? 'correct' : 'wrong', state.soundEnabled);
    window.VAMOS_SPEECH.speakSpanish(currentQ.phrase.spanish);

    const xpDelta = isCorrect ? 25 : 10;
    const updatedState = window.VAMOS_STORAGE.recordQuestAnswer(
      {
        ...state,
        xp: (state.xp || 0) + xpDelta
      },
      currentQ.phrase.id,
      isCorrect
    );
    onUpdateState(updatedState);

    setQuestionState(prev => ({
      ...prev,
      isSubmitted: true,
      isCorrect
    }));

    setActiveQuest(prev => ({
      ...prev,
      correctCount: prev.correctCount + (isCorrect ? 1 : 0),
      earnedXp: prev.earnedXp + xpDelta
    }));
  }

  // Move to next question or finish stage
  function handleNextQuestion() {
    const nextIdx = activeQuest.currentIndex + 1;
    if (nextIdx >= activeQuest.questions.length) {
      // Stage Complete!
      window.VAMOS_SPEECH.playSfx('fanfare', state.soundEnabled);
      const stageKey = \`\${activeQuest.categoryId}_\${activeQuest.stage}\`;
      const stageBonusXp = 40;
      const nextState = {
        ...state,
        xp: (state.xp || 0) + stageBonusXp,
        totalQuestsCleared: (state.totalQuestsCleared || 0) + 1,
        completedStages: {
          ...state.completedStages,
          [stageKey]: true
        }
      };
      onUpdateState(nextState);
      setActiveQuest(prev => ({
        ...prev,
        earnedXp: prev.earnedXp + stageBonusXp,
        finished: true
      }));
    } else {
      const nextQ = activeQuest.questions[nextIdx];
      const wasSeen = state.cards[nextQ.phrase.id]?.seen;
      const nextState = window.VAMOS_STORAGE.markPhraseSeen(state, nextQ.phrase.id);
      onUpdateState(nextState);

      setActiveQuest(prev => ({
        ...prev,
        currentIndex: nextIdx,
        newlyUnlockedIds: !wasSeen && !prev.newlyUnlockedIds.includes(nextQ.phrase.id)
          ? [...prev.newlyUnlockedIds, nextQ.phrase.id]
          : prev.newlyUnlockedIds
      }));
      initQuestionInteraction(nextQ, state.autoSpeak);
    }
  }

  // ---- STAGE SELECTOR VIEW ----
  if (!activeQuest) {
    const currentCatObj = categories.find(c => c.id === selectedCategory) || categories[0];
    const catPhrases = allPhrases.filter(p => p.category === selectedCategory);

    return (
      <div className="space-y-6 pb-8 animate-pop">
        {/* Category Selector Tabs */}
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">SELECT CATEGORY</span>
          <h1 className="text-2xl font-black text-white mt-0.5">クエスト学習モード ⚔️</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            1ステージ5問！パズル・リスニング・スピーキングで直感的にフレーズを身につけよう。
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            {categories.map(cat => {
              const active = cat.id === selectedCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={\`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 \${
                    active
                      ? \`bg-gradient-to-br \${cat.color} text-white border-white/40 shadow-lg\`
                      : 'bg-slate-900/90 text-slate-300 border-white/10 hover:border-white/25'
                  }\`}
                >
                  <Icon name={cat.icon} className="w-5 h-5 shrink-0" />
                  <div className="truncate">
                    <div className="text-xs sm:text-sm font-black truncate">{cat.name}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage Cards for Selected Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 'all'].map((stageNum) => {
            const isAll = stageNum === 'all';
            const stageKey = \`\${selectedCategory}_\${stageNum}\`;
            const isCleared = state.completedStages[stageKey];
            const stagePhrases = isAll
              ? catPhrases
              : catPhrases.filter(p => p.stage === stageNum);

            return (
              <div
                key={stageNum}
                className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 flex flex-col justify-between hover:border-amber-400/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={\`text-xs font-black px-3 py-1 rounded-full border \${currentCatObj.badgeBg}\`}>
                      {isAll ? '🏆 総まとめマッチ' : \`STAGE \${stageNum}\`}
                    </span>
                    {isCleared && (
                      <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                        <Icon name="Check" className="w-4 h-4" /> CLEAR!
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-white">
                    {isAll
                      ? \`\${currentCatObj.name}・オールスター5問\`
                      : stageNum === 1
                      ? \`\${currentCatObj.name}：基本フレーズ編\`
                      : \`\${currentCatObj.name}：実践応用編\`}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    全5問（並び替えパズル・4択リスニング・発音チャレンジ）
                  </p>

                  {/* Preview of phrases in this stage */}
                  <div className="mt-4 space-y-2">
                    {stagePhrases.slice(0, 4).map(p => (
                      <div
                        key={p.id}
                        onClick={() => window.VAMOS_SPEECH.speakSpanish(p.spanish)}
                        className="cursor-pointer rounded-xl bg-slate-950/80 border border-white/5 px-3 py-2 flex items-center justify-between gap-2 hover:border-white/20"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-black text-amber-300 truncate">{p.spanish}</div>
                          <div className="text-[11px] text-slate-400 truncate">{p.japanese}</div>
                        </div>
                        <Icon name="Volume2" className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => startStage(selectedCategory, stageNum)}
                  className={\`w-full mt-5 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 bg-gradient-to-r \${currentCatObj.color} text-white hover:brightness-110\`}
                >
                  <span>キックオフ！（5問スタート）</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---- STAGE COMPLETED CELEBRATION VIEW ----
  if (activeQuest.finished) {
    const unlockedPhrases = allPhrases.filter(p => activeQuest.newlyUnlockedIds.includes(p.id));
    return (
      <div className="max-w-xl mx-auto rounded-3xl bg-slate-900/95 border border-amber-400/40 p-6 sm:p-8 text-center space-y-6 animate-pop shadow-2xl">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-rose-500 mx-auto flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30">
          🏆
        </div>
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">¡GOLAZO! STAGE COMPLETE</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">ステージクリア！！ 🎉</h2>
          <p className="text-sm text-slate-300 mt-1">
            5問中 <strong className="text-amber-300">{activeQuest.correctCount}問</strong> 正解！スペイン渡航へまた一歩前進だ！
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-950/90 border border-amber-400/30 p-4">
            <div className="text-xs text-slate-400 font-bold">獲得XP（ボーナス込）</div>
            <div className="text-2xl font-black text-amber-300 font-sport mt-1">+{activeQuest.earnedXp} XP</div>
          </div>
          <div className="rounded-2xl bg-slate-950/90 border border-emerald-400/30 p-4">
            <div className="text-xs text-slate-400 font-bold">図鑑登録フレーズ</div>
            <div className="text-2xl font-black text-emerald-300 font-sport mt-1">
              {unlockedPhrases.length > 0 ? \`+\${unlockedPhrases.length} 枚 NEW!\` : '習熟度UP!'}
            </div>
          </div>
        </div>

        {unlockedPhrases.length > 0 && (
          <div className="text-left space-y-2">
            <div className="text-xs font-black text-amber-300 uppercase">✨ 新しくトレカ図鑑に登録されたフレーズ</div>
            {unlockedPhrases.map(p => (
              <div
                key={p.id}
                onClick={() => window.VAMOS_SPEECH.speakSpanish(p.spanish)}
                className="cursor-pointer rounded-2xl bg-slate-950/80 border border-amber-400/30 p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-[11px] text-amber-300/90 font-bold">{p.kana}</div>
                  <div className="text-sm font-black text-white">{p.spanish}</div>
                  <div className="text-xs text-slate-400">{p.japanese}</div>
                </div>
                <Icon name="Volume2" className="w-5 h-5 text-amber-300" />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => setActiveQuest(null)}
            className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm transition"
          >
            ステージ選択へ戻る
          </button>
          <button
            onClick={onGoToCollection}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/25"
          >
            トレカ図鑑を見る ✨
          </button>
        </div>
      </div>
    );
  }

  // ---- ACTIVE QUESTION VIEW ----
  const currentQ = activeQuest.questions[activeQuest.currentIndex];
  const phrase = currentQ.phrase;
  const progressPct = ((activeQuest.currentIndex + 1) / activeQuest.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8 animate-pop">
      {/* Top Bar: Back & Progress */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveQuest(null)}
          className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
        >
          <Icon name="ArrowLeft" className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
            <span>
              QUESTION {activeQuest.currentIndex + 1} / {activeQuest.questions.length}
            </span>
            <span className="text-amber-300">
              {currentQ.type === 'chunk'
                ? '🧩 チャンク並び替えパズル'
                : currentQ.type === 'listening'
                ? '🎧 4択リスニング＆意味当て'
                : '🎙️ スピーキング発音挑戦'}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full transition-all duration-300"
              style={{ width: \`\${progressPct}%\` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl bg-slate-900/95 border border-white/10 p-5 sm:p-6 shadow-2xl space-y-5">
        {/* Audio & Prompt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {currentQ.type === 'chunk'
                ? '日本語のお題をスペイン語に並べ替えよう！'
                : currentQ.type === 'listening'
                ? 'スペイン語を聞いて正しい意味を選ぼう！'
                : 'お手本を聞いてスペイン語を発音しよう！'}
            </span>
            {currentQ.type === 'chunk' ? (
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                「{phrase.japanese}」
              </h2>
            ) : (
              <div className="mt-2">
                <div className="text-xs font-bold text-amber-300 tracking-wide">{phrase.kana}</div>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-sport">{phrase.spanish}</h2>
                {currentQ.type === 'speaking' && (
                  <div className="text-sm text-slate-300 mt-1">意味：{phrase.japanese}</div>
                )}
              </div>
            )}
          </div>

          {/* Native TTS Controls (Normal + Slow Turtle) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.VAMOS_SPEECH.speakSpanish(phrase.spanish, { rate: 0.94 })}
              className="px-3.5 py-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Icon name="Volume2" className="w-4 h-4" />
              <span>お手本音声</span>
            </button>
            <button
              onClick={() => window.VAMOS_SPEECH.speakSpanish(phrase.spanish, { rate: 0.62 })}
              className="px-3 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 font-bold text-xs active:scale-95"
              title="ゆっくり再生"
            >
              🐢 ゆっくり
            </button>
          </div>
        </div>

        {/* ---- TYPE 1: CHUNK PUZZLE ---- */}
        {currentQ.type === 'chunk' && questionState && (
          <div className="space-y-5">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>💡 単語ブロックをタップすると発音が鳴るよ！</span>
              <span className="text-amber-300 font-bold">ガイド: {phrase.kana}</span>
            </div>

            {/* Selected Answer Tray */}
            <div className="min-h-[84px] rounded-2xl bg-slate-950/90 border-2 border-dashed border-white/15 p-3.5 flex flex-wrap items-center gap-2.5">
              {questionState.selectedBlocks.length === 0 ? (
                <span className="text-xs text-slate-500 mx-auto">
                  下のスペイン語ブロックを順番にタップしてここに並べよう！
                </span>
              ) : (
                questionState.selectedBlocks.map(block => (
                  <button
                    key={block.id}
                    onClick={() => handleTapBlock(block, true)}
                    disabled={questionState.isSubmitted}
                    className="chunk-btn px-4 py-2 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 font-black text-sm flex flex-col items-center"
                  >
                    <span className="text-[10px] font-bold text-slate-800 leading-none mb-0.5">
                      {phrase.wordRubies?.[block.text] || ''}
                    </span>
                    <span className="font-sport">{block.text}</span>
                  </button>
                ))
              )}
            </div>

            {/* Available Word Blocks Pool */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {currentQ.poolBlocks.map(block => {
                const isUsed = questionState.selectedBlocks.some(b => b.id === block.id);
                return (
                  <button
                    key={block.id}
                    onClick={() => !isUsed && handleTapBlock(block, false)}
                    disabled={isUsed || questionState.isSubmitted}
                    className={\`chunk-btn px-4 py-2.5 rounded-xl font-black text-sm flex flex-col items-center border transition \${
                      isUsed
                        ? 'bg-slate-900/40 text-slate-600 border-white/5 opacity-40 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border-white/15'
                    }\`}
                  >
                    <span className="text-[10px] font-bold text-amber-300/90 leading-none mb-0.5">
                      {phrase.wordRubies?.[block.text] || 'スペイン語'}
                    </span>
                    <span className="font-sport">{block.text}</span>
                  </button>
                );
              })}
            </div>

            {!questionState.isSubmitted && (
              <button
                onClick={submitChunkAnswer}
                disabled={questionState.selectedBlocks.length === 0}
                className={\`w-full py-3.5 rounded-2xl font-black text-sm transition \${
                  questionState.selectedBlocks.length > 0
                    ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-lg active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }\`}
              >
                回答をチェックする！
              </button>
            )}
          </div>
        )}

        {/* ---- TYPE 2: 4-CHOICE LISTENING ---- */}
        {currentQ.type === 'listening' && questionState && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2.5">
              {currentQ.options.map((opt, i) => {
                const isSelected = questionState.selectedOptionId === opt.id;
                const isAnswer = opt.id === phrase.id;
                let btnStyle = 'bg-slate-950/80 hover:bg-slate-800 border-white/10 text-white';
                if (questionState.isSubmitted) {
                  if (isAnswer) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
                  } else if (isSelected && !isAnswer) {
                    btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-950/40 border-white/5 text-slate-500';
                  }
                }
                return (
                  <button
                    key={opt.id}
                    onClick={() => submitListeningOption(opt)}
                    disabled={questionState.isSubmitted}
                    className={\`p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base flex items-center justify-between transition \${btnStyle}\`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-black text-amber-300">
                        {i + 1}
                      </span>
                      <span>{opt.japanese}</span>
                    </div>
                    {questionState.isSubmitted && isAnswer && (
                      <span className="text-emerald-400 font-black text-xs">✓ 正解</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---- TYPE 3: SPEAKING CHALLENGE (Web Speech API) ---- */}
        {currentQ.type === 'speaking' && questionState && (
          <div className="text-center space-y-4 py-3">
            <div className="inline-block rounded-2xl bg-slate-950/80 border border-white/10 px-5 py-3">
              <div className="text-xs text-slate-400">カタカナ発音ガイド</div>
              <div className="text-lg sm:text-xl font-black text-amber-300 mt-0.5">{phrase.kana}</div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleStartMic}
                disabled={questionState.isSubmitted || questionState.isListeningMic}
                className={\`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition \${
                  questionState.isListeningMic
                    ? 'bg-red-600 animate-mic'
                    : questionState.isSubmitted
                    ? 'bg-emerald-600'
                    : 'bg-gradient-to-br from-rose-600 to-amber-500 hover:scale-105 active:scale-95'
                }\`}
              >
                <Icon name="Mic" className="w-9 h-9" />
              </button>
              <div className="text-xs font-bold text-slate-300">
                {questionState.isListeningMic
                  ? '🔴 マイクに向かってスペイン語を話してね...'
                  : 'マイクボタンを押して発音してみよう！'}
              </div>
            </div>

            {questionState.micMessage && (
              <div className="rounded-2xl bg-slate-950/90 border border-white/10 p-3 text-xs font-bold text-amber-300">
                {questionState.micMessage}
              </div>
            )}

            {!questionState.isSubmitted && (
              <div className="pt-2">
                <button
                  onClick={handleTapClearSpeaking}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-xs font-bold text-slate-200 transition"
                >
                  🔊 マイクが使えない環境・声出し確認でクリア（スキップ）
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---- FEEDBACK & CULTURAL TIP AFTER SUBMISSION ---- */}
        {questionState && questionState.isSubmitted && (
          <div
            className={\`rounded-2xl p-4 border animate-pop \${
              questionState.isCorrect
                ? 'bg-emerald-950/50 border-emerald-500/40'
                : 'bg-rose-950/50 border-rose-500/40'
            }\`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className={\`text-sm font-black \${questionState.isCorrect ? 'text-emerald-300' : 'text-rose-300'}\`}>
                  {questionState.isCorrect
                    ? '🎉 ¡Excelente! 正解！ (+25 XP)'
                    : \`💡 惜しい！正解は「\${phrase.spanish}」 (+10 XP)\`}
                </div>
                <div className="text-xs font-bold text-amber-300 mt-1">
                  {phrase.spanish} （{phrase.kana}）＝ {phrase.japanese}
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  🇪🇸 <strong>現地リアルTips:</strong> {phrase.tip}
                </p>
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm shadow-lg transition active:scale-95"
            >
              {activeQuest.currentIndex + 1 < activeQuest.questions.length
                ? '次の問題へ進む →'
                : 'ステージ結果を見る 🏆'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== 3. SMART REVIEW COLLECTION & SRS MODE ====================
function CollectionAndSrsView({ state, stats, initialMode, onClearInitialMode, onUpdateState }) {
  const allPhrases = window.VAMOS_DATA.phrases;
  const categories = window.VAMOS_DATA.categories;

  const [catFilter, setCatFilter] = useState('all');
  const [masteryFilter, setMasteryFilter] = useState('all'); // 'all' | 'due' | 'unlearned' | 'learning' | 'mastered'
  const [searchQuery, setSearchQuery] = useState('');
  const [srsSession, setSrsSession] = useState(null); // { queue, currentIndex, isRevealed, selectedOptionId, completedCount, earnedXp }

  useEffect(() => {
    if (initialMode) {
      startSrsSession(initialMode);
      if (onClearInitialMode) onClearInitialMode();
    }
  }, [initialMode]);

  function startSrsSession(mode = 'due') {
    const dueList = stats.duePhrases;
    let pool = [];
    if (mode === 'due' && dueList.length > 0) {
      pool = shuffleArray(dueList);
    } else {
      // Practice mode: prioritize seen cards or unlock starter set
      const seenCards = allPhrases.filter(p => state.cards[p.id]?.seen);
      pool = shuffleArray(seenCards.length >= 3 ? seenCards : allPhrases).slice(0, 5);
    }

    const queue = pool.map(phrase => {
      const wrong = shuffleArray(allPhrases.filter(p => p.id !== phrase.id)).slice(0, 3);
      return {
        phrase,
        options: shuffleArray([phrase, ...wrong])
      };
    });

    setSrsSession({
      mode,
      queue,
      currentIndex: 0,
      selectedOptionId: null,
      isRevealed: false,
      completedCount: 0,
      earnedXp: 0,
      finished: false
    });

    if (queue[0] && state.autoSpeak) {
      setTimeout(() => window.VAMOS_SPEECH.speakSpanish(queue[0].phrase.spanish), 200);
    }
  }

  function handleSelectSrsOption(opt) {
    if (!srsSession || srsSession.isRevealed) return;
    const currentItem = srsSession.queue[srsSession.currentIndex];
    const isCorrect = opt.id === currentItem.phrase.id;
    window.VAMOS_SPEECH.playSfx(isCorrect ? 'correct' : 'wrong', state.soundEnabled);
    window.VAMOS_SPEECH.speakSpanish(currentItem.phrase.spanish);

    setSrsSession(prev => ({
      ...prev,
      selectedOptionId: opt.id,
      isRevealed: true
    }));
  }

  // Evaluate with SRS self-rating ('hard' | 'good' | 'easy')
  function handleRateSrsCard(quality) {
    const currentItem = srsSession.queue[srsSession.currentIndex];
    const updatedState = window.VAMOS_STORAGE.recordSrsReview(state, currentItem.phrase.id, quality);
    onUpdateState(updatedState);

    const xpGain = quality === 'easy' ? 25 : quality === 'good' ? 20 : 10;
    const nextIdx = srsSession.currentIndex + 1;

    if (nextIdx >= srsSession.queue.length) {
      window.VAMOS_SPEECH.playSfx('fanfare', state.soundEnabled);
      setSrsSession(prev => ({
        ...prev,
        completedCount: prev.completedCount + 1,
        earnedXp: prev.earnedXp + xpGain,
        finished: true
      }));
    } else {
      const nextPhrase = srsSession.queue[nextIdx].phrase;
      if (state.autoSpeak) {
        setTimeout(() => window.VAMOS_SPEECH.speakSpanish(nextPhrase.spanish), 200);
      }
      setSrsSession(prev => ({
        ...prev,
        currentIndex: nextIdx,
        selectedOptionId: null,
        isRevealed: false,
        completedCount: prev.completedCount + 1,
        earnedXp: prev.earnedXp + xpGain
      }));
    }
  }

  // Unlock all 32 cards in collection for instant browsing
  function handleUnlockAllCards() {
    const today = window.VAMOS_STORAGE.getTodayStr();
    const nextCards = { ...state.cards };
    allPhrases.forEach(p => {
      nextCards[p.id] = {
        ...(nextCards[p.id] || {}),
        seen: true,
        masteryLevel: Math.max(1, nextCards[p.id]?.masteryLevel || 1),
        nextReviewDate: nextCards[p.id]?.nextReviewDate || today
      };
    });
    onUpdateState({
      ...state,
      cards: nextCards
    });
    window.VAMOS_SPEECH.playSfx('fanfare', state.soundEnabled);
  }

  // Filtered trading cards
  const filteredPhrases = useMemo(() => {
    const today = window.VAMOS_STORAGE.getTodayStr();
    return allPhrases.filter(p => {
      if (catFilter !== 'all' && p.category !== catFilter) return false;
      const c = state.cards[p.id] || { seen: false, masteryLevel: 0 };

      if (masteryFilter === 'due') {
        if (!c.seen || (c.nextReviewDate && c.nextReviewDate > today)) return false;
      } else if (masteryFilter === 'unlearned') {
        if (c.masteryLevel > 0) return false;
      } else if (masteryFilter === 'learning') {
        if (c.masteryLevel < 1 || c.masteryLevel > 3) return false;
      } else if (masteryFilter === 'mastered') {
        if (c.masteryLevel < 4) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hit =
          p.spanish.toLowerCase().includes(q) ||
          p.japanese.toLowerCase().includes(q) ||
          p.kana.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [allPhrases, catFilter, masteryFilter, searchQuery, state.cards]);

  // ---- ACTIVE SRS REVIEW QUIZ MODAL/VIEW ----
  if (srsSession) {
    if (srsSession.finished) {
      return (
        <div className="max-w-xl mx-auto rounded-3xl bg-slate-900/95 border border-amber-400/40 p-6 sm:p-8 text-center space-y-5 animate-pop shadow-2xl">
          <div className="text-5xl">🔥</div>
          <h2 className="text-2xl font-black text-white">SRS スマート復習完了！</h2>
          <p className="text-sm text-slate-300">
            {srsSession.completedCount}枚のフレーズを復習し、忘却曲線スケジュールを更新しました！
          </p>
          <div className="rounded-2xl bg-slate-950/90 border border-amber-400/30 p-4 max-w-xs mx-auto">
            <div className="text-xs text-slate-400 font-bold">獲得復習ボーナス</div>
            <div className="text-2xl font-black text-amber-300 font-sport mt-1">+{srsSession.earnedXp} XP</div>
          </div>
          <button
            onClick={() => setSrsSession(null)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm shadow-lg"
          >
            トレカ図鑑へ戻る
          </button>
        </div>
      );
    }

    const currentItem = srsSession.queue[srsSession.currentIndex];
    const phrase = currentItem.phrase;
    const cardState = state.cards[phrase.id] || { masteryLevel: 1 };

    return (
      <div className="max-w-xl mx-auto space-y-5 pb-8 animate-pop">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSrsSession(null)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5"
          >
            <Icon name="ArrowLeft" className="w-4 h-4" />
            <span>図鑑に戻る</span>
          </button>
          <span className="text-xs font-black text-amber-300">
            SRS REVIEW {srsSession.currentIndex + 1} / {srsSession.queue.length}
          </span>
        </div>

        <div className="rounded-3xl bg-slate-900/95 border border-amber-400/40 p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
              現在 Lv.{cardState.masteryLevel} / 5
            </span>
            <button
              onClick={() => window.VAMOS_SPEECH.speakSpanish(phrase.spanish)}
              className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5"
            >
              <Icon name="Volume2" className="w-4 h-4" />
              <span>発音を聞く</span>
            </button>
          </div>

          <div className="text-center py-4">
            <div className="text-xs font-bold text-amber-300">{phrase.kana}</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-sport mt-1">{phrase.spanish}</h2>
            <p className="text-xs text-slate-400 mt-2">このスペイン語の意味を選ぼう！</p>
          </div>

          <div className="space-y-2.5">
            {currentItem.options.map(opt => {
              const isAnswer = opt.id === phrase.id;
              const isSelected = srsSession.selectedOptionId === opt.id;
              let cls = 'bg-slate-950/80 hover:bg-slate-800 border-white/10 text-white';
              if (srsSession.isRevealed) {
                if (isAnswer) cls = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
                else if (isSelected) cls = 'bg-rose-500/20 border-rose-400 text-rose-200';
                else cls = 'bg-slate-950/40 border-white/5 text-slate-500';
              }
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectSrsOption(opt)}
                  disabled={srsSession.isRevealed}
                  className={\`w-full p-3.5 rounded-2xl border-2 text-left font-bold text-sm transition \${cls}\`}
                >
                  {opt.japanese}
                </button>
              );
            })}
          </div>

          {/* SRS Self-Evaluation Buttons after reveal */}
          {srsSession.isRevealed && (
            <div className="pt-3 border-t border-white/10 space-y-3 animate-pop">
              <div className="text-xs text-center font-bold text-slate-300">
                記憶の手応えはどうだった？（次回の出題日が変わるよ！）
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleRateSrsCard('hard')}
                  className="p-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-center transition active:scale-95"
                >
                  <div className="text-xs font-black text-rose-300">😓 難しい</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">明日もう1回</div>
                </button>
                <button
                  onClick={() => handleRateSrsCard('good')}
                  className="p-3 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-center transition active:scale-95"
                >
                  <div className="text-xs font-black text-sky-300">👍 普通</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Lv.+1 / 数日後</div>
                </button>
                <button
                  onClick={() => handleRateSrsCard('easy')}
                  className="p-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-center transition active:scale-95"
                >
                  <div className="text-xs font-black text-emerald-300">⚡ 簡単！</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Lv.+2 / 長期記憶</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- VOCABULARY TRADING CARD COLLECTION VIEW ----
  return (
    <div className="space-y-6 pb-8 animate-pop">
      {/* Header & SRS Launch Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-white/10 rounded-3xl p-5">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">TRADING CARD VOCABULARY BANK</span>
          <h1 className="text-2xl font-black text-white mt-0.5">スマート復習コレクション 🃏</h1>
          <p className="text-xs text-slate-300 mt-1">
            カードをタップするとスペイン語音声が再生！現在 <strong className="text-amber-300">{stats.seenCount} / {stats.totalPhrases}枚</strong> が図鑑に登録済み。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {stats.seenCount < stats.totalPhrases && (
            <button
              onClick={handleUnlockAllCards}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-xs font-bold text-slate-200 transition"
            >
              🔓 全32枚を図鑑解放
            </button>
          )}
          <button
            onClick={() => startSrsSession(stats.duePhrases.length > 0 ? 'due' : 'practice')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Icon name="Sparkles" className="w-4 h-4" />
            <span>
              {stats.duePhrases.length > 0
                ? \`SRS期限カード復習 (\${stats.duePhrases.length}件)\`
                : 'SRS復習モードを開始'}
            </span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none">
            <Icon name="Search" className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="スペイン語・カタカナ・日本語でフレーズ検索..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCatFilter('all')}
            className={\`px-3.5 py-1.5 rounded-full text-xs font-black shrink-0 border transition \${
              catFilter === 'all'
                ? 'bg-amber-400 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-slate-300 border-white/10'
            }\`}
          >
            全カテゴリ ({allPhrases.length})
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCatFilter(c.id)}
              className={\`px-3.5 py-1.5 rounded-full text-xs font-black shrink-0 border transition \${
                catFilter === c.id
                  ? 'bg-amber-400 text-slate-950 border-amber-400'
                  : 'bg-slate-900 text-slate-300 border-white/10'
              }\`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Mastery Level Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'すべての状態' },
            { id: 'due', label: \`⚡ 今日の復習対象 (\${stats.duePhrases.length})\` },
            { id: 'unlearned', label: '未習得 (Lv.0)' },
            { id: 'learning', label: '🔥 学習中 (Lv.1-3)' },
            { id: 'mastered', label: '👑 マスター (Lv.4-5)' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setMasteryFilter(f.id)}
              className={\`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition \${
                masteryFilter === f.id
                  ? 'bg-rose-600 text-white border-rose-400'
                  : 'bg-slate-900/70 text-slate-400 border-white/10'
              }\`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trading Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPhrases.map(p => {
          const c = state.cards[p.id] || { seen: false, masteryLevel: 0, nextReviewDate: null };
          const catObj = categories.find(cat => cat.id === p.category);
          const isMaster = c.masteryLevel >= 4;
          const isLearning = c.masteryLevel >= 1 && c.masteryLevel <= 3;
          const cardClass = isMaster
            ? 'card-master'
            : isLearning
            ? 'card-learning'
            : 'card-unlearned';

          return (
            <div
              key={p.id}
              onClick={() => {
                window.VAMOS_SPEECH.playSfx('tap', state.soundEnabled);
                window.VAMOS_SPEECH.speakSpanish(p.spanish);
              }}
              className={\`trading-card cursor-pointer rounded-3xl p-5 flex flex-col justify-between \${cardClass}\`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={\`text-[11px] font-black px-2.5 py-0.5 rounded-full border \${catObj?.badgeBg || ''}\`}>
                    {catObj?.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {!c.seen && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        クエスト未登場
                      </span>
                    )}
                    <span className={\`text-xs font-black font-sport \${
                      isMaster ? 'text-amber-300' : isLearning ? 'text-rose-300' : 'text-slate-500'
                    }\`}>
                      {isMaster ? '👑 MASTER' : isLearning ? '🔥 LEARNING' : 'Lv.0'}
                    </span>
                  </div>
                </div>

                {/*Katakana Ruby + Spanish + Japanese*/}
                <div className="text-xs font-bold text-amber-300/95 tracking-wide">{p.kana}</div>
                <h3 className="text-xl font-black text-white font-sport mt-0.5 flex items-center justify-between gap-2">
                  <span>{p.spanish}</span>
                  <Icon name="Volume2" className="w-5 h-5 text-amber-400 shrink-0" />
                </h3>
                <p className="text-sm font-bold text-slate-200 mt-1">{p.japanese}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{p.tip}</p>
              </div>

              {/* SRS Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={star <= c.masteryLevel ? 'text-amber-400' : 'text-slate-700'}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-slate-400 ml-1">Lv.{c.masteryLevel}/5</span>
                </div>
                <div className="text-slate-400">
                  {c.nextReviewDate ? \`次回: \${c.nextReviewDate}\` : 'タップで発音'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== 4. AI ROLEPLAY CHALLENGE COMPONENT ====================
function RoleplayModeView({ state, onUpdateState }) {
  const scenarios = window.VAMOS_DATA.roleplays;
  const [activeScenario, setActiveScenario] = useState(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [turnFeedback, setTurnFeedback] = useState(null); // { isCorrect, text, selectedOption }
  const [isCompleted, setIsCompleted] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [micHint, setMicHint] = useState('');

  function startScenario(sc) {
    setActiveScenario(sc);
    setTurnIndex(0);
    setTurnFeedback(null);
    setIsCompleted(false);
    setMicHint('');
    const firstTurn = sc.turns[0];
    setChatHistory([
      {
        sender: 'partner',
        spanish: firstTurn.partnerSpanish,
        kana: firstTurn.partnerKana,
        japanese: firstTurn.partnerJapanese
      }
    ]);
    if (state.autoSpeak) {
      setTimeout(() => window.VAMOS_SPEECH.speakSpanish(firstTurn.partnerSpanish), 250);
    }
  }

  function handleChooseOption(opt) {
    if (turnFeedback && turnFeedback.isCorrect) return;
    window.VAMOS_SPEECH.speakSpanish(opt.spanish);

    if (opt.correct) {
      window.VAMOS_SPEECH.playSfx('correct', state.soundEnabled);
      setTurnFeedback({
        isCorrect: true,
        text: opt.feedback,
        selectedOption: opt
      });
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'player',
          spanish: opt.spanish,
          kana: opt.kana,
          japanese: opt.japanese
        }
      ]);
    } else {
      window.VAMOS_SPEECH.playSfx('wrong', state.soundEnabled);
      setTurnFeedback({
        isCorrect: false,
        text: opt.feedback,
        selectedOption: opt
      });
    }
  }

  // Voice input in Roleplay Mode!
  function handleRoleplayVoiceInput() {
    if (!activeScenario) return;
    const currentTurn = activeScenario.turns[turnIndex];
    const correctOption = currentTurn.options.find(o => o.correct);

    setIsListeningMic(true);
    setMicHint('🎙️ スペイン語の返答を聞き取り中...');

    window.VAMOS_SPEECH.startSpeechRecognition({
      onResult: (transcript) => {
        setIsListeningMic(false);
        const ev = window.VAMOS_SPEECH.evaluatePronunciation(correctOption.spanish, transcript);
        if (ev.isMatch) {
          setMicHint(\`🎉 音声認識成功！「\${transcript}」\`);
          handleChooseOption(correctOption);
        } else {
          setMicHint(\`聞き取り:「\${transcript}」— 下の選択肢をタップするかもう一度話してみてね！\`);
        }
      },
      onError: (msg) => {
        setIsListeningMic(false);
        setMicHint(msg);
      },
      onEnd: () => {
        setIsListeningMic(false);
      }
    });
  }

  function handleNextTurn() {
    const nextIdx = turnIndex + 1;
    if (nextIdx >= activeScenario.turns.length) {
      window.VAMOS_SPEECH.playSfx('fanfare', state.soundEnabled);
      const nextState = window.VAMOS_STORAGE.touchStudyStreak({
        ...state,
        xp: (state.xp || 0) + activeScenario.xpReward,
        completedRoleplays: {
          ...state.completedRoleplays,
          [activeScenario.id]: true
        }
      });
      onUpdateState(nextState);
      setIsCompleted(true);
    } else {
      const nextTurn = activeScenario.turns[nextIdx];
      setTurnIndex(nextIdx);
      setTurnFeedback(null);
      setMicHint('');
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'partner',
          spanish: nextTurn.partnerSpanish,
          kana: nextTurn.partnerKana,
          japanese: nextTurn.partnerJapanese
        }
      ]);
      if (state.autoSpeak) {
        setTimeout(() => window.VAMOS_SPEECH.speakSpanish(nextTurn.partnerSpanish), 250);
      }
    }
  }

  if (!activeScenario) {
    return (
      <div className="space-y-6 pb-8 animate-pop">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400">3-TURN AI ROLEPLAY</span>
          <h1 className="text-2xl font-black text-white mt-0.5">AIロールプレイ・ミニチャレンジ 🗣️</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            スペイン現地のリアルな3ターン会話シミュレーション！選択肢タップまたはマイク発音で会話を成立させよう。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {scenarios.map(sc => {
            const cleared = state.completedRoleplays[sc.id];
            return (
              <div
                key={sc.id}
                className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 flex flex-col justify-between hover:border-rose-400/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{sc.partnerAvatar}</span>
                    <span className={\`text-xs font-black px-3 py-1 rounded-full \${
                      cleared
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }\`}>
                      {cleared ? '✓ 達成済み' : \`+\${sc.xpReward} XP\`}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-rose-400">{sc.location}</div>
                  <h3 className="text-lg font-black text-white mt-1">{sc.title}</h3>
                  <p className="text-xs text-slate-300 mt-1.5">{sc.subtitle}</p>
                  <div className="mt-3 text-xs text-slate-400">
                    相手: <strong className="text-white">{sc.partnerName}</strong>（3ターン対話）
                  </div>
                </div>

                <button
                  onClick={() => startScenario(sc)}
                  className="w-full mt-5 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-sm shadow-lg transition active:scale-95"
                >
                  会話をスタートする 🗣️
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const currentTurn = activeScenario.turns[turnIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8 animate-pop">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScenario(null)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <Icon name="ArrowLeft" className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs font-bold text-amber-300">{activeScenario.location}</div>
            <h2 className="text-sm sm:text-base font-black text-white">{activeScenario.title}</h2>
          </div>
        </div>
        <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
          TURN {Math.min(turnIndex + 1, 3)} / 3
        </span>
      </div>

      {/* Chat Timeline */}
      <div className="space-y-3 bg-slate-950/70 border border-white/10 rounded-3xl p-4 sm:p-5">
        {chatHistory.map((msg, i) => {
          const isPartner = msg.sender === 'partner';
          return (
            <div
              key={i}
              className={\`flex items-start gap-3 animate-pop \${isPartner ? '' : 'flex-row-reverse'}\`}
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl shrink-0">
                {isPartner ? activeScenario.partnerAvatar : '🧢'}
              </div>
              <div
                onClick={() => window.VAMOS_SPEECH.speakSpanish(msg.spanish)}
                className={\`cursor-pointer max-w-[82%] rounded-2xl p-3.5 border \${
                  isPartner
                    ? 'bg-slate-900 border-white/10 text-white'
                    : 'bg-gradient-to-br from-rose-600/30 to-amber-500/20 border-amber-400/40 text-white'
                }\`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] text-amber-300 font-bold">
                  <span>{msg.kana}</span>
                  <Icon name="Volume2" className="w-3.5 h-3.5 shrink-0" />
                </div>
                <div className="text-base font-black font-sport mt-0.5">{msg.spanish}</div>
                <div className="text-xs text-slate-300 mt-1">{msg.japanese}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Turn Response Selector */}
      {!isCompleted ? (
        <div className="rounded-3xl bg-slate-900/95 border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-bold text-amber-300">
              💡 ヒント: {currentTurn.hint}
            </div>
            <button
              onClick={handleRoleplayVoiceInput}
              disabled={isListeningMic}
              className={\`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition \${
                isListeningMic
                  ? 'bg-red-600 text-white border-red-400 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-400/30'
              }\`}
            >
              <Icon name="Mic" className="w-3.5 h-3.5" />
              <span>{isListeningMic ? '聞き取り中...' : '声で返答する'}</span>
            </button>
          </div>

          {micHint && (
            <div className="text-xs font-bold text-amber-300 bg-slate-950/80 rounded-xl p-2.5 border border-white/10">
              {micHint}
            </div>
          )}

          <div className="space-y-2.5">
            {currentTurn.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleChooseOption(opt)}
                className="w-full p-4 rounded-2xl bg-slate-950/85 hover:bg-slate-800 border border-white/10 hover:border-amber-400/40 text-left transition active:scale-99"
              >
                <div className="text-[11px] font-bold text-amber-300">{opt.kana}</div>
                <div className="text-base font-black text-white font-sport mt-0.5">{opt.spanish}</div>
                <div className="text-xs text-slate-400 mt-0.5">{opt.japanese}</div>
              </button>
            ))}
          </div>

          {turnFeedback && (
            <div
              className={\`rounded-2xl p-4 border animate-pop \${
                turnFeedback.isCorrect
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
              }\`}
            >
              <div className="text-xs sm:text-sm font-bold">{turnFeedback.text}</div>
              {turnFeedback.isCorrect && (
                <button
                  onClick={handleNextTurn}
                  className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs sm:text-sm"
                >
                  {turnIndex + 1 < activeScenario.turns.length
                    ? '次のターンへ進む →'
                    : 'ロールプレイ達成！報酬を受け取る 🏆'}
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-400/50 p-6 text-center space-y-4 animate-pop">
          <div className="text-4xl">🎉</div>
          <h3 className="text-2xl font-black text-white">3ターン対話ミッション達成！</h3>
          <p className="text-sm text-slate-200">
            {activeScenario.partnerName}と最高のコミュニケーションができたね！ (+{activeScenario.xpReward} XP)
          </p>
          <button
            onClick={() => setActiveScenario(null)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm shadow-lg"
          >
            シナリオ一覧へ戻る
          </button>
        </div>
      )}
    </div>
  );
}

// ==================== 5. SETTINGS & JSON BACKUP MODAL ====================
function SettingsModal({ state, onClose, onUpdateState }) {
  const [nameInput, setNameInput] = useState(state.playerName || 'Leo');
  const [importText, setImportText] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const fileInputRef = useRef(null);

  function handleSaveSettings() {
    onUpdateState({
      ...state,
      playerName: nameInput.trim() || 'Leo'
    });
    setStatusMsg('✅ プレイヤー設定を保存しました！');
  }

  // Export JSON Backup as downloadable file
  function handleExportJsonFile() {
    try {
      const jsonStr = JSON.stringify(state, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`vamos_quest_backup_\${window.VAMOS_STORAGE.getTodayStr()}.json\`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMsg('✅ 学習データのJSONファイルをダウンロードしました！');
    } catch (e) {
      setStatusMsg('⚠️ エクスポートに失敗しました。');
    }
  }

  // Copy JSON to clipboard
  function handleCopyJson() {
    try {
      const jsonStr = JSON.stringify(state, null, 2);
      navigator.clipboard.writeText(jsonStr);
      setStatusMsg('✅ JSONバックアップをクリップボードにコピーしました！');
    } catch (e) {
      setStatusMsg('⚠️ コピーできませんでした。ファイルダウンロードを使ってね。');
    }
  }

  // Import JSON from file upload
  function handleFileImport(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      applyImportedJson(ev.target.result);
    };
    reader.readAsText(file);
  }

  function applyImportedJson(rawText) {
    try {
      const parsed = JSON.parse(rawText);
      if (!parsed || typeof parsed !== 'object' || !parsed.cards) {
        setStatusMsg('⚠️ 無効なJSONデータです。Vamos! Questのバックアップファイルを選択してください。');
        return;
      }
      onUpdateState(parsed);
      setNameInput(parsed.playerName || 'Leo');
      setImportText('');
      setStatusMsg('🎉 学習データのインポート（復元）が完了しました！');
    } catch (err) {
      setStatusMsg('⚠️ JSONの解析に失敗しました。正しいJSON形式か確認してください。');
    }
  }

  function handleResetAll() {
    if (window.confirm('本当に学習データを初期状態にリセットしますか？（バックアップを取っておくのがおすすめです）')) {
      const fresh = window.VAMOS_STORAGE.createInitialState();
      onUpdateState(fresh);
      setNameInput(fresh.playerName);
      setStatusMsg('🔄 初期データにリセットしました。');
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/15 p-6 space-y-5 shadow-2xl animate-pop my-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <Icon name="Settings" className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white">設定 ＆ 学習データバックアップ</h2>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
          >
            閉じる ✕
          </button>
        </div>

        {/* Player Name & Audio Toggles */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">プレイヤー名（ニックネーム）</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-sm text-white"
              />
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs"
              >
                変更保存
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => onUpdateState({ ...state, soundEnabled: !state.soundEnabled })}
              className={\`p-3 rounded-2xl border text-left transition \${
                state.soundEnabled
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950 border-white/10 text-slate-400'
              }\`}
            >
              <div className="text-xs font-black">🎵 ゲーム効果音 (SFX)</div>
              <div className="text-[11px] mt-0.5">{state.soundEnabled ? 'ON (有効)' : 'OFF (ミュート)'}</div>
            </button>

            <button
              onClick={() => onUpdateState({ ...state, autoSpeak: !state.autoSpeak })}
              className={\`p-3 rounded-2xl border text-left transition \${
                state.autoSpeak
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950 border-white/10 text-slate-400'
              }\`}
            >
              <div className="text-xs font-black">🗣️ 問題表示時の自動発音</div>
              <div className="text-[11px] mt-0.5">{state.autoSpeak ? 'ON (自動再生)' : 'OFF (手動のみ)'}</div>
            </button>
          </div>
        </div>

        {/* JSON Export / Import Backup Section */}
        <div className="rounded-2xl bg-slate-950/90 border border-white/10 p-4 space-y-3">
          <div className="text-xs font-black text-amber-300 uppercase">
            💾 学習データのJSONエクスポート / インポート
          </div>
          <p className="text-xs text-slate-400">
            XP・連続学習ストリーク・各カードのSRS習熟度をJSONファイルとして保存・復元できます。
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleExportJsonFile}
              className="py-2.5 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-black text-xs flex items-center justify-center gap-1.5"
            >
              <Icon name="Download" className="w-4 h-4" />
              <span>JSONファイルを保存</span>
            </button>
            <button
              onClick={handleCopyJson}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-slate-200 font-bold text-xs"
            >
              📋 JSONをコピー
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">JSONファイルから復元</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="py-1.5 px-3 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 font-black text-xs flex items-center gap-1.5"
              >
                <Icon name="Upload" className="w-3.5 h-3.5" />
                <span>ファイルを選択してインポート</span>
              </button>
            </div>

            <details className="text-xs text-slate-400">
              <summary className="cursor-pointer hover:text-slate-200 font-bold py-1">
                またはJSONテキストを直接貼り付けてインポート
              </summary>
              <div className="mt-2 space-y-2">
                <textarea
                  rows="3"
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  placeholder='{"version":1,"playerName":"Leo",...}'
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white font-mono"
                />
                <button
                  onClick={() => applyImportedJson(importText)}
                  disabled={!importText.trim()}
                  className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs disabled:opacity-40"
                >
                  貼り付けたJSONを復元する
                </button>
              </div>
            </details>
          </div>
        </div>

        {statusMsg && (
          <div className="rounded-xl bg-amber-400/15 border border-amber-400/40 p-3 text-xs font-bold text-amber-300">
            {statusMsg}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            onClick={handleResetAll}
            className="text-xs font-bold text-rose-400 hover:underline"
          >
            学習データを初期状態にリセット
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs"
          >
            完了
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== ROOT APPLICATION ====================
function App() {
  const [state, setState] = useState(() => window.VAMOS_STORAGE.loadState());
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'quest' | 'collection' | 'roleplay'
  const [questInitial, setQuestInitial] = useState(null);
  const [reviewInitialMode, setReviewInitialMode] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const stats = useMemo(() => window.VAMOS_STORAGE.computeStats(state), [state]);

  function updateAndSaveState(nextState) {
    setState(nextState);
    window.VAMOS_STORAGE.saveState(nextState);
  }

  function handleSelectCategoryStage(categoryId, stage) {
    setQuestInitial({ category: categoryId, stage, ts: Date.now() });
    setActiveTab('quest');
  }

  function handleStartReview(mode = 'due') {
    setReviewInitialMode(mode);
    setActiveTab('collection');
  }

  return (
    <div className="min-h-screen stadium-grid flex flex-col">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-950/85 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 via-red-600 to-amber-400 flex items-center justify-center text-xl shadow-lg shadow-rose-600/30">
              ⚽
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white font-sport">
                  VAMOS! <span className="text-amber-400">QUEST</span>
                </span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 -mt-1 hidden sm:block">
                13歳からのスペイン語冒険クエスト
              </div>
            </div>
          </div>

          {/* Quick Status Pills & Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="px-2.5 py-1 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-1.5 text-xs font-black text-rose-400 font-sport">
              <span>🔥</span>
              <span>{state.streak}日</span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-1.5 text-xs font-black text-amber-300 font-sport">
              <Icon name="Zap" className="w-3.5 h-3.5 text-amber-400" />
              <span>{stats.xp} XP</span>
            </div>
            <div className="hidden sm:flex px-2.5 py-1 rounded-xl bg-amber-400/15 border border-amber-400/30 items-center gap-1 text-xs font-black text-amber-300">
              <span>{stats.currentRank.badge}</span>
              <span>Lv.{stats.level}</span>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition"
              title="設定・バックアップ"
            >
              <Icon name="Settings" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-5 pb-24">
        {activeTab === 'dashboard' && (
          <DashboardView
            state={state}
            stats={stats}
            onSelectCategoryStage={handleSelectCategoryStage}
            onStartReview={handleStartReview}
            onNavigate={setActiveTab}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}

        {activeTab === 'quest' && (
          <QuestModeView
            state={state}
            initialSelection={questInitial}
            onUpdateState={updateAndSaveState}
            onGoToCollection={() => setActiveTab('collection')}
          />
        )}

        {activeTab === 'collection' && (
          <CollectionAndSrsView
            state={state}
            stats={stats}
            initialMode={reviewInitialMode}
            onClearInitialMode={() => setReviewInitialMode(null)}
            onUpdateState={updateAndSaveState}
          />
        )}

        {activeTab === 'roleplay' && (
          <RoleplayModeView
            state={state}
            onUpdateState={updateAndSaveState}
          />
        )}
      </main>

      {/* Mobile-First Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 backdrop-blur-xl bg-slate-950/90 border-t border-white/10">
        <div className="max-w-lg mx-auto px-3 h-16 grid grid-cols-4 gap-1">
          {[
            { id: 'dashboard', label: 'ホーム', icon: 'Home' },
            { id: 'quest', label: 'クエスト', icon: 'Swords' },
            { id: 'collection', label: 'トレカ復習', icon: 'BookOpen', badge: stats.duePhrases.length },
            { id: 'roleplay', label: 'AI対話', icon: 'MessageSquare' }
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id !== 'quest') setQuestInitial(null);
                  setActiveTab(tab.id);
                }}
                className={\`relative flex flex-col items-center justify-center rounded-2xl transition \${
                  active ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }\`}
              >
                {active && (
                  <span className="absolute top-1 w-8 h-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-400" />
                )}
                <div className="relative">
                  <Icon name={tab.icon} className="w-5 h-5" />
                  {tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full bg-rose-600 text-[10px] font-black text-white">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-black mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Settings & JSON Backup Modal */}
      {showSettings && (
        <SettingsModal
          state={state}
          onClose={() => setShowSettings(false)}
          onUpdateState={updateAndSaveState}
        />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`;

// Compile and execute JSX via @babel/standalone so it works on both file:// and http://
(function bootVamosQuest() {
  try {
    const compiled = Babel.transform(APP_JSX_SOURCE, { presets: ['react'] }).code;
    const runFn = new Function(compiled);
    runFn();
  } catch (err) {
    console.error('Failed to boot Vamos! Quest:', err);
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.innerHTML = '<div style="padding:24px;color:#f87171;">アプリの起動中にエラーが発生しました: ' + err.message + '</div>';
    }
  }
})();

