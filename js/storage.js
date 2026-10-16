// Vamos! Quest - LocalStorage State & Spaced Repetition System (SRS) Manager
(function () {
  const STORAGE_KEY = 'vamos_quest_save_v1';

  function getTodayStr() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function addDaysStr(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function createInitialState() {
    const today = getTodayStr();
    const cards = {};
    const phrases = (window.VAMOS_DATA && window.VAMOS_DATA.phrases) || [];

    // Initialize all phrase records; pre-unlock 3 iconic starter phrases as due today
    // so the user immediately sees the "今日の復習クエスト" alert and trading card demo,
    // while all other phrases unlock automatically as soon as they appear in a Quest!
    const starterIds = ['gr_1', 'sc_1', 'fd_1'];

    phrases.forEach(p => {
      const isStarter = starterIds.includes(p.id);
      cards[p.id] = {
        seen: isStarter,
        masteryLevel: isStarter ? 1 : 0, // 0: 未習得, 1-3: 学習中, 4-5: マスター
        nextReviewDate: isStarter ? today : null,
        lastReviewedDate: null,
        correctCount: isStarter ? 1 : 0,
        reviewCount: 0
      };
    });

    return {
      version: 1,
      playerName: 'Leo',
      xp: 60,
      streak: 1,
      lastStudyDate: today,
      soundEnabled: true,
      autoSpeak: true,
      completedStages: {}, // e.g. { 'greetings_1': true }
      completedRoleplays: {}, // e.g. { 'rp_soccer': true }
      cards,
      totalQuestsCleared: 0,
      totalReviewsCleared: 0
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const init = createInitialState();
        saveState(init);
        return init;
      }
      const parsed = JSON.parse(raw);
      const base = createInitialState();
      const merged = {
        ...base,
        ...parsed,
        cards: { ...base.cards, ...(parsed.cards || {}) },
        completedStages: { ...(parsed.completedStages || {}) },
        completedRoleplays: { ...(parsed.completedRoleplays || {}) }
      };
      // Check streak continuity
      const today = getTodayStr();
      if (merged.lastStudyDate && merged.lastStudyDate !== today) {
        const last = new Date(merged.lastStudyDate + 'T00:00:00');
        const curr = new Date(today + 'T00:00:00');
        const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
        if (diffDays > 1) {
          // Streak broken if more than 1 day skipped, but keep at least 1 when active
          merged.streak = 0;
        }
      }
      return merged;
    } catch (e) {
      return createInitialState();
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  // Record daily activity and update streak
  function touchStudyStreak(state) {
    const today = getTodayStr();
    let newStreak = state.streak || 1;
    if (state.lastStudyDate !== today) {
      if (!state.lastStudyDate) {
        newStreak = 1;
      } else {
        const last = new Date(state.lastStudyDate + 'T00:00:00');
        const curr = new Date(today + 'T00:00:00');
        const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak = (state.streak || 0) + 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      }
    } else if (newStreak === 0) {
      newStreak = 1;
    }
    return {
      ...state,
      streak: newStreak,
      lastStudyDate: today
    };
  }

  // Register a phrase as seen when it appears in a Quest
  function markPhraseSeen(state, phraseId) {
    const prev = state.cards[phraseId] || {
      seen: false,
      masteryLevel: 0,
      nextReviewDate: null,
      lastReviewedDate: null,
      correctCount: 0,
      reviewCount: 0
    };
    if (prev.seen) return state;
    const today = getTodayStr();
    return {
      ...state,
      cards: {
        ...state.cards,
        [phraseId]: {
          ...prev,
          seen: true,
          nextReviewDate: prev.nextReviewDate || today
        }
      }
    };
  }

  // Update card after answering a question in Quest Mode
  function recordQuestAnswer(state, phraseId, isCorrect) {
    const today = getTodayStr();
    const prev = state.cards[phraseId] || {
      seen: true,
      masteryLevel: 0,
      nextReviewDate: today,
      lastReviewedDate: null,
      correctCount: 0,
      reviewCount: 0
    };

    let nextLevel = prev.masteryLevel;
    let nextDue = prev.nextReviewDate || today;

    if (isCorrect) {
      nextLevel = Math.min(5, Math.max(1, prev.masteryLevel + 1));
      // If first time learning in quest, make it reviewable today or tomorrow based on level
      const intervalDays = nextLevel <= 1 ? 0 : nextLevel === 2 ? 1 : nextLevel === 3 ? 3 : 7;
      nextDue = addDaysStr(intervalDays);
    } else {
      nextLevel = Math.max(0, prev.masteryLevel - 1);
      nextDue = today; // review today if missed!
    }

    const updated = touchStudyStreak({
      ...state,
      cards: {
        ...state.cards,
        [phraseId]: {
          ...prev,
          seen: true,
          masteryLevel: nextLevel,
          nextReviewDate: nextDue,
          lastReviewedDate: today,
          correctCount: prev.correctCount + (isCorrect ? 1 : 0)
        }
      }
    });
    return updated;
  }

  // SRS Evaluation in Review Mode: quality = 'hard' | 'good' | 'easy'
  function recordSrsReview(state, phraseId, quality) {
    const today = getTodayStr();
    const prev = state.cards[phraseId] || {
      seen: true,
      masteryLevel: 1,
      nextReviewDate: today,
      lastReviewedDate: null,
      correctCount: 0,
      reviewCount: 0
    };

    let nextLevel = prev.masteryLevel;
    let daysToAdd = 1;

    if (quality === 'hard') {
      nextLevel = Math.max(1, prev.masteryLevel - 1);
      daysToAdd = 1; // Review again tomorrow
    } else if (quality === 'good') {
      nextLevel = Math.min(5, prev.masteryLevel + 1);
      const intervals = [1, 1, 2, 4, 7, 14];
      daysToAdd = intervals[nextLevel] || 3;
    } else if (quality === 'easy') {
      nextLevel = Math.min(5, prev.masteryLevel + 2);
      const intervals = [1, 2, 4, 7, 14, 30];
      daysToAdd = intervals[nextLevel] || 7;
    }

    const nextDue = addDaysStr(daysToAdd);
    const xpGain = quality === 'easy' ? 25 : quality === 'good' ? 20 : 10;

    return touchStudyStreak({
      ...state,
      xp: (state.xp || 0) + xpGain,
      totalReviewsCleared: (state.totalReviewsCleared || 0) + 1,
      cards: {
        ...state.cards,
        [phraseId]: {
          ...prev,
          seen: true,
          masteryLevel: nextLevel,
          nextReviewDate: nextDue,
          lastReviewedDate: today,
          reviewCount: (prev.reviewCount || 0) + 1,
          correctCount: (prev.correctCount || 0) + (quality !== 'hard' ? 1 : 0)
        }
      }
    });
  }

  // Get list of phrases due for SRS review today (or earlier)
  function getDuePhrases(state) {
    const today = getTodayStr();
    const phrases = (window.VAMOS_DATA && window.VAMOS_DATA.phrases) || [];
    return phrases.filter(p => {
      const c = state.cards && state.cards[p.id];
      if (!c || !c.seen) return false;
      if (!c.nextReviewDate) return true;
      return c.nextReviewDate <= today;
    });
  }

  // Compute level, rank, and category progress metrics
  function computeStats(state) {
    const phrases = (window.VAMOS_DATA && window.VAMOS_DATA.phrases) || [];
    const categories = (window.VAMOS_DATA && window.VAMOS_DATA.categories) || [];
    const ranks = (window.VAMOS_DATA && window.VAMOS_DATA.ranks) || [];

    const xp = state.xp || 0;
    const level = Math.floor(xp / 150) + 1;
    const xpInLevel = xp % 150;
    const xpForNextLevel = 150;

    let seenCount = 0;
    let learnedCount = 0; // masteryLevel >= 1
    let masteredCount = 0; // masteryLevel >= 4
    let totalMasteryPoints = 0;
    const maxMasteryPoints = phrases.length * 5;

    phrases.forEach(p => {
      const c = state.cards && state.cards[p.id];
      if (c && c.seen) seenCount++;
      if (c && c.masteryLevel >= 1) learnedCount++;
      if (c && c.masteryLevel >= 4) masteredCount++;
      if (c && c.masteryLevel > 0) totalMasteryPoints += Math.min(5, c.masteryLevel);
    });

    // Overall readiness % combines phrase acquisition (70%) and mastery depth (30%)
    const learnedRatio = phrases.length > 0 ? learnedCount / phrases.length : 0;
    const masteryRatio = maxMasteryPoints > 0 ? totalMasteryPoints / maxMasteryPoints : 0;
    const readinessPct = Math.min(100, Math.round((learnedRatio * 0.7 + masteryRatio * 0.3) * 100));

    let currentRank = ranks[0];
    let nextRank = null;
    for (let i = 0; i < ranks.length; i++) {
      if (readinessPct >= ranks[i].minPct) {
        currentRank = ranks[i];
        nextRank = ranks[i + 1] || null;
      }
    }

    const categoryStats = categories.map(cat => {
      const catPhrases = phrases.filter(p => p.category === cat.id);
      const catLearned = catPhrases.filter(p => {
        const c = state.cards && state.cards[p.id];
        return c && c.masteryLevel >= 1;
      }).length;
      const catMastered = catPhrases.filter(p => {
        const c = state.cards && state.cards[p.id];
        return c && c.masteryLevel >= 4;
      }).length;
      const pct = catPhrases.length > 0 ? Math.round((catLearned / catPhrases.length) * 100) : 0;
      return {
        ...cat,
        total: catPhrases.length,
        learned: catLearned,
        mastered: catMastered,
        pct
      };
    });

    const duePhrases = getDuePhrases(state);

    return {
      xp,
      level,
      xpInLevel,
      xpForNextLevel,
      seenCount,
      learnedCount,
      masteredCount,
      totalPhrases: phrases.length,
      readinessPct,
      currentRank,
      nextRank,
      categoryStats,
      duePhrases
    };
  }

  window.VAMOS_STORAGE = {
    STORAGE_KEY,
    getTodayStr,
    addDaysStr,
    createInitialState,
    loadState,
    saveState,
    touchStudyStreak,
    markPhraseSeen,
    recordQuestAnswer,
    recordSrsReview,
    getDuePhrases,
    computeStats
  };
})();

