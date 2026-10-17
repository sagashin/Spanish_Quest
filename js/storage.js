// Vamos! Quest - LocalStorage State, Custom Phrases & Spaced Repetition System (SRS) Manager
(function () {
  const STORAGE_KEY = 'vamos_quest_save_v2';
  const LEGACY_KEY = 'vamos_quest_save_v1';

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

  function getAllPhrases(state) {
    const base = (window.VAMOS_DATA && window.VAMOS_DATA.phrases) || [];
    const custom = (state && Array.isArray(state.customPhrases)) ? state.customPhrases : [];
    return [...custom, ...base];
  }

  function createInitialState() {
    const cards = {};
    const phrases = (window.VAMOS_DATA && window.VAMOS_DATA.phrases) || [];

    phrases.forEach(p => {
      cards[p.id] = {
        seen: false,
        masteryLevel: 0, // 0: 未習得, 1-3: 学習中, 4-5: マスター
        nextReviewDate: null,
        lastReviewedDate: null,
        correctCount: 0,
        reviewCount: 0
      };
    });

    return {
      version: 2,
      playerName: 'Leo',
      xp: 0,
      streak: 0,
      lastStudyDate: null,
      soundEnabled: true,
      autoSpeak: true,
      geminiApiKey: '',
      geminiModel: 'gemini-3.8-flash',
      customPhrases: [],
      completedStages: {},
      cards,
      totalQuestsCleared: 0,
      totalReviewsCleared: 0
    };
  }

  function normalizeState(parsed) {
    const base = createInitialState();
    if (!parsed || typeof parsed !== 'object') return base;

    const merged = {
      ...base,
      ...parsed,
      geminiApiKey: typeof parsed.geminiApiKey === 'string' ? parsed.geminiApiKey : base.geminiApiKey,
      geminiModel: parsed.geminiModel || base.geminiModel,
      customPhrases: Array.isArray(parsed.customPhrases) ? parsed.customPhrases : [],
      cards: { ...base.cards, ...(parsed.cards || {}) },
      completedStages: { ...(parsed.completedStages || {}) }
    };

    const today = getTodayStr();
    if (merged.lastStudyDate && merged.lastStudyDate !== today) {
      const last = new Date(merged.lastStudyDate + 'T00:00:00');
      const curr = new Date(today + 'T00:00:00');
      const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        merged.streak = 0;
      }
    }
    return merged;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
      if (!raw) {
        const init = createInitialState();
        saveState(init);
        return init;
      }
      const parsed = JSON.parse(raw);
      return normalizeState(parsed);
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

  // Add a custom phrase from AI Dictionary or AI Roleplay Chat to SRS & Quest Pool
  function addCustomPhrase(state, phraseInput) {
    const today = getTodayStr();
    const all = getAllPhrases(state);
    const normTarget = String(phraseInput.spanish || '').trim().toLowerCase();

    const existing = all.find(p => String(p.spanish || '').trim().toLowerCase() === normTarget);
    if (existing) {
      // Already exists: ensure it's marked seen and due for review
      const prevCard = state.cards[existing.id] || { masteryLevel: 1 };
      const updated = touchStudyStreak({
        ...state,
        cards: {
          ...state.cards,
          [existing.id]: {
            ...prevCard,
            seen: true,
            masteryLevel: Math.max(1, prevCard.masteryLevel || 1),
            nextReviewDate: today
          }
        }
      });
      return { state: updated, addedPhrase: existing, isDuplicate: true };
    }

    const id = 'custom_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const spanish = String(phraseInput.spanish || '').trim();
    const pronunciation = String(phraseInput.pronunciation || phraseInput.kana || '').trim();
    const japanese = String(phraseInput.japanese || '').trim();
    const chunks = Array.isArray(phraseInput.chunks) && phraseInput.chunks.length > 0
      ? phraseInput.chunks
      : spanish.split(/\s+/).filter(Boolean);

    const newPhrase = {
      id,
      category: phraseInput.category || 'soccer',
      stage: 2,
      isCustom: true,
      spanish,
      pronunciation,
      kana: pronunciation,
      japanese,
      chunks,
      distractors: ['por', 'favor', 'dónde'].filter(d => !spanish.toLowerCase().includes(d)).slice(0, 2),
      wordRubies: {},
      tip: phraseInput.tip || 'AI辞書・ロールプレイから追加したマイフレーズ！現地でどんどん使おう！'
    };

    const nextState = touchStudyStreak({
      ...state,
      xp: (state.xp || 0) + 20,
      customPhrases: [newPhrase, ...(state.customPhrases || [])],
      cards: {
        ...state.cards,
        [id]: {
          seen: true,
          masteryLevel: 1,
          nextReviewDate: today,
          lastReviewedDate: today,
          correctCount: 1,
          reviewCount: 0
        }
      }
    });

    return { state: nextState, addedPhrase: newPhrase, isDuplicate: false };
  }

  function deleteCustomPhrase(state, phraseId) {
    const nextCustom = (state.customPhrases || []).filter(p => p.id !== phraseId);
    const nextCards = { ...(state.cards || {}) };
    delete nextCards[phraseId];
    return {
      ...state,
      customPhrases: nextCustom,
      cards: nextCards
    };
  }

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
      // Intervals: Lv1=today/1d, Lv2=1d, Lv3=3d, Lv4=7d, Lv5=14d
      const intervalDays = nextLevel <= 1 ? 0 : nextLevel === 2 ? 1 : nextLevel === 3 ? 3 : nextLevel === 4 ? 7 : 14;
      nextDue = addDaysStr(intervalDays);
    } else {
      nextLevel = Math.max(0, prev.masteryLevel - 1);
      nextDue = today;
    }

    return touchStudyStreak({
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
  }

  // SRS Evaluation: quality = 'again' (もう一回) | 'good' (普通) | 'easy' (余裕)
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

    // Standard SRS intervals: 1日後, 3日後, 7日後, 14日後, 30日後
    const srsIntervalsByLevel = [1, 1, 3, 7, 14, 30];
    let nextLevel = prev.masteryLevel;
    let daysToAdd = 1;

    if (quality === 'again' || quality === 'hard') {
      nextLevel = Math.max(1, prev.masteryLevel - 1);
      daysToAdd = 1; // 1日後
    } else if (quality === 'good') {
      nextLevel = Math.min(5, prev.masteryLevel + 1);
      daysToAdd = srsIntervalsByLevel[nextLevel] || 3;
    } else if (quality === 'easy') {
      nextLevel = Math.min(5, prev.masteryLevel + 2);
      daysToAdd = srsIntervalsByLevel[nextLevel] || 7;
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
          correctCount: (prev.correctCount || 0) + (quality !== 'again' && quality !== 'hard' ? 1 : 0)
        }
      }
    });
  }

  function getDuePhrases(state) {
    const today = getTodayStr();
    const phrases = getAllPhrases(state);
    return phrases.filter(p => {
      const c = state.cards && state.cards[p.id];
      if (!c || !c.seen) return false;
      if (!c.nextReviewDate) return true;
      return c.nextReviewDate <= today;
    });
  }

  function computeStats(state) {
    const phrases = getAllPhrases(state);
    const categories = (window.VAMOS_DATA && window.VAMOS_DATA.categories) || [];
    const ranks = (window.VAMOS_DATA && window.VAMOS_DATA.ranks) || [];

    const xp = state.xp || 0;
    const level = Math.floor(xp / 150) + 1;
    const xpInLevel = xp % 150;
    const xpForNextLevel = 150;

    let seenCount = 0;
    let learnedCount = 0;
    let masteredCount = 0;
    let totalMasteryPoints = 0;
    const maxMasteryPoints = phrases.length * 5;

    phrases.forEach(p => {
      const c = state.cards && state.cards[p.id];
      if (c && c.seen) seenCount++;
      if (c && c.masteryLevel >= 1) learnedCount++;
      if (c && c.masteryLevel >= 4) masteredCount++;
      if (c && c.masteryLevel > 0) totalMasteryPoints += Math.min(5, c.masteryLevel);
    });

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
      customCount: (state.customPhrases || []).length,
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
    getAllPhrases,
    createInitialState,
    normalizeState,
    loadState,
    saveState,
    touchStudyStreak,
    markPhraseSeen,
    addCustomPhrase,
    deleteCustomPhrase,
    recordQuestAnswer,
    recordSrsReview,
    getDuePhrases,
    computeStats
  };
})();
