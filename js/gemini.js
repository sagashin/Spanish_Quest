// Vamos! Quest - Gemini API Integration (Infinite Roleplay Chat & Custom Phrase Generator)
(function () {
  const DEFAULT_MODEL = 'gemini-3.8-flash';

  const MODEL_PRESETS = [
    { id: 'gemini-3.8-flash', label: 'gemini-3.8-flash (推奨・高速)' },
    { id: 'gemini-3.8-pro', label: 'gemini-3.8-pro (高精度)' },
    { id: 'gemini-2.5-flash', label: 'gemini-2.5-flash (互換・高速)' },
    { id: 'gemini-2.5-pro', label: 'gemini-2.5-pro (互換・高精度)' }
  ];

  const ROLEPLAY_PERSONAS = [
    {
      id: 'mateo',
      name: 'マテオ (Mateo)',
      role: '13歳・現地のサッカーチームメイト',
      avatar: '⚽',
      badge: '一番人気！ピッチで交流',
      color: 'from-red-600 to-amber-500',
      desc: '練習前や試合後にピッチで話す陽気な13歳のスペイン人少年。サッカー用語や同年代のスラングを優しく教えてくれる！',
      personaPrompt:
        'あなたはスペイン・マドリードのサッカークラブに所属する13歳の陽気な少年「マテオ (Mateo)」です。日本から来た13歳の少年と練習前や試合後にピッチで楽しく話しています。サッカーや好きな選手、ポジション、日本のことなどを話題にしてください。',
      initialTurn: {
        ai_spanish: '¡Hola! Soy Mateo. ¡Bienvenido al equipo! ¿De qué juegas?',
        ai_pronunciation: 'オラ！ ソイ マテオ。ビエンベニード アル エキポ！ デ ケ フエガス？',
        ai_japanese: 'やあ！俺はマテオ。チームへようこそ！君はポジションどこ？',
        coach_feedback: '',
        suggested_replies: [
          {
            spanish: '¡Hola Mateo! Soy de Japón. Juego de centrocampista.',
            pronunciation: 'オラ マテオ！ ソイ デ ハポン。フエゴ デ セントロカンピスタ',
            japanese: 'やあマテオ！日本から来ました。ミッドフィルダーをやってるよ。'
          },
          {
            spanish: '¡Mucho gusto! Juego de delantero. ¡Vamos!',
            pronunciation: 'ムーチョ グスト！ フエゴ デ デランテロ。バモス！',
            japanese: 'よろしく！フォワードをやってるよ。行こうぜ！'
          },
          {
            spanish: '¡Hola! Me gusta mucho el fútbol.',
            pronunciation: 'オラ！ メ グスタ ムーチョ エル フトボル',
            japanese: 'やあ！僕はサッカーが大好きだよ。'
          }
        ]
      }
    },
    {
      id: 'carlos',
      name: 'カルロス (Carlos)',
      role: 'バルの優しい店員さん',
      avatar: '🍊',
      badge: '注文＆買い物練習',
      color: 'from-emerald-500 to-teal-600',
      desc: 'チュロスやオレンジジュース、タパスの注文を笑顔で受けてくれる優しいバルの店員さん。',
      personaPrompt:
        'あなたはスペインの街角にある人気のバル「Bar El Sol」の優しい店員「カルロス (Carlos)」です。13歳の日本人の少年が注文しに来ました。チュロスやホットチョコレート、オレンジジュース、タパスなどの注文を優しく受け、会計まで楽しくやり取りしてください。',
      initialTurn: {
        ai_spanish: '¡Hola! Bienvenido al Bar El Sol. ¿Qué quieres tomar hoy?',
        ai_pronunciation: 'オラ！ ビエンベニード アル バル エル ソル。ケ キエレス トマール オイ？',
        ai_japanese: 'やあ！バル・エル・ソルへようこそ。今日は何を頼むかい？',
        coach_feedback: '',
        suggested_replies: [
          {
            spanish: '¡Hola! Quiero churros con chocolate, por favor.',
            pronunciation: 'オラ！ キエロ チュロス コン チョコラテ ポル ファボール',
            japanese: 'こんにちは！ホットチョコ付きのチュロスをください。'
          },
          {
            spanish: 'Un zumo de naranja, por favor.',
            pronunciation: 'ウン スモ デ ナランハ ポル ファボール',
            japanese: 'オレンジジュースを1つください。'
          },
          {
            spanish: '¿Qué me recomiendas?',
            pronunciation: 'ケ メ レコミエンダス？',
            japanese: 'おすすめは何ですか？'
          }
        ]
      }
    },
    {
      id: 'coach',
      name: 'フリートーク (Sofíaコーチ)',
      role: '優しいスペイン語＆現地生活コーチ',
      avatar: '🇪🇸',
      badge: '何でも質問・雑談OK',
      color: 'from-sky-500 to-indigo-600',
      desc: 'スペインでの生活、観光、サッカー観戦、挨拶など何でも雑談＆質問できるフリートークモード！',
      personaPrompt:
        'あなたは13歳の日本人の少年をサポートする明るく優しいスペイン人コーチ「ソフィア (Sofía)」です。スペイン旅行、サッカー観戦、挨拶、現地の習慣など、どんなトピックでも楽しく会話してください。相手が日本語で質問した場合も優しく受け止めつつ、A1レベルの短いスペイン語で会話を続けてください。',
      initialTurn: {
        ai_spanish: '¡Hola! ¿Cómo estás hoy? ¿Listo para practicar español?',
        ai_pronunciation: 'オラ！ コモ エスタス オイ？ リスト パラ プラクティカール エスパニョール？',
        ai_japanese: 'やあ！今日の調子はどう？スペイン語の練習をする準備はいい？',
        coach_feedback: '',
        suggested_replies: [
          {
            spanish: '¡Sí, estoy listo! ¡Vamos!',
            pronunciation: 'シ、エストイ リスト！ バモス！',
            japanese: 'うん、準備バッチリだよ！行こう！'
          },
          {
            spanish: '¡Hola! Quiero ir al estadio en España.',
            pronunciation: 'オラ！ キエロ イール アル エスタディオ エン エスパーニャ',
            japanese: 'やあ！スペインでスタジアムに行きたいです。'
          },
          {
            spanish: 'Estoy muy bien, gracias.',
            pronunciation: 'エストイ ムイ ビエン、グラシアス',
            japanese: 'とても元気です、ありがとう。'
          }
        ]
      }
    }
  ];

  // Safely strip ```json ... ``` markdown code fences and parse JSON
  function safeParseJson(rawText) {
    if (!rawText) throw new Error('AIからの応答が空でした。');
    let cleaned = String(rawText).trim();
    // Remove ```json ... ``` or ``` ... ```
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // If there is surrounding text, extract from first { to last }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    return JSON.parse(cleaned);
  }

  // Low-level call to Google Gemini generateContent REST endpoint
  async function callGeminiApi({ apiKey, modelId, systemPrompt, userPrompt }) {
    const trimmedKey = String(apiKey || '').trim();
    if (!trimmedKey) {
      const err = new Error('API_KEY_MISSING');
      err.code = 'API_KEY_MISSING';
      throw err;
    }

    const activeModel = String(modelId || DEFAULT_MODEL).trim() || DEFAULT_MODEL;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(activeModel)}:generateContent?key=${encodeURIComponent(trimmedKey)}`;

    const body = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      let errDetail = '';
      try {
        const errJson = await res.json();
        errDetail = errJson?.error?.message || JSON.stringify(errJson);
      } catch (_) {
        errDetail = await res.text();
      }
      throw new Error(`Gemini API エラー (${res.status}): ${errDetail || 'モデル名またはAPIキーを確認してください（設定画面で変更可能）'}`);
    }

    const data = await res.json();
    const textOutput = data?.candidates?.[0]?.content?.parts
      ?.map(p => p.text || '')
      .join('\n') || '';

    return safeParseJson(textOutput);
  }

  // Feature 1: Infinite Free Roleplay Chat Turn
  async function generateRoleplayReply({ apiKey, modelId, personaId, history, userMessage }) {
    const persona = ROLEPLAY_PERSONAS.find(p => p.id === personaId) || ROLEPLAY_PERSONAS[0];

    const systemPrompt = `あなたは13歳の日本人の少年と話すスペインの友人（または店員）です。相手はスペイン語を始めたばかりなので、必ずA1レベルの超シンプルで短いスペイン語（1回につき1〜2文）で返答し、最後に相手が答えやすい簡単な質問を投げかけて会話をリードしてください。必ず指定されたJSONフォーマットのみで出力してください。

【キャラクター設定】
${persona.personaPrompt}

【厳守する出力JSONフォーマット】
{
  "ai_spanish": "AIのスペイン語の返答（A1レベルの短く自然な文、1〜2文）",
  "ai_pronunciation": "ai_spanishのカタカナ発音ガイド",
  "ai_japanese": "ai_spanishの自然な日本語訳",
  "coach_feedback": "ユーザーの直前の発言に対する日本語での優しい褒め言葉や、より自然な表現のワンポイントアドバイス",
  "suggested_replies": [
    {
      "spanish": "次にユーザーが返せるおすすめスペイン語1（A1レベル）",
      "pronunciation": "カタカナ発音1",
      "japanese": "日本語の意味1"
    },
    {
      "spanish": "おすすめスペイン語2（A1レベル）",
      "pronunciation": "カタカナ発音2",
      "japanese": "日本語の意味2"
    },
    {
      "spanish": "おすすめスペイン語3（A1レベル）",
      "pronunciation": "カタカナ発音3",
      "japanese": "日本語の意味3"
    }
  ]
}`;

    const recentTurns = (history || []).slice(-6).map(m => {
      const speaker = m.sender === 'ai' ? persona.name : 'ユーザー(13歳日本人少年)';
      return `${speaker}: ${m.spanish}`;
    }).join('\n');

    const userPrompt = `【これまでの会話履歴】
${recentTurns}

【今回のユーザーの発言】
${userMessage}

上記のユーザーの発言に対して、指定されたJSONフォーマットのみで返答を生成してください。`;

    const parsed = await callGeminiApi({
      apiKey,
      modelId,
      systemPrompt,
      userPrompt
    });

    const replies = Array.isArray(parsed.suggested_replies) && parsed.suggested_replies.length > 0
      ? parsed.suggested_replies.slice(0, 3).map(r => ({
          spanish: String(r.spanish || '¡Vale!'),
          pronunciation: String(r.pronunciation || 'バレ！'),
          japanese: String(r.japanese || 'わかったよ！')
        }))
      : persona.initialTurn.suggested_replies;

    return {
      ai_spanish: String(parsed.ai_spanish || '¡Qué bien! ¿Seguimos hablando?'),
      ai_pronunciation: String(parsed.ai_pronunciation || 'ケ ビエン！ セギモス アブランド？'),
      ai_japanese: String(parsed.ai_japanese || 'いいね！もっと話そうか？'),
      coach_feedback: String(parsed.coach_feedback || 'ナイスチャレンジ！その調子でどんどん声に出していこう！'),
      suggested_replies: replies
    };
  }

  // Feature 2: Custom Phrase Generator ("現地で知りたい言葉" AIリクエスト)
  async function generateCustomPhrase({ apiKey, modelId, japaneseRequest }) {
    const systemPrompt = `あなたは13歳の日本の少年（来年スペインへサッカー留学・旅行予定）のためのスペイン語コーチです。
ユーザーが知りたい日本語の言葉やシチュエーションを受け取り、スペイン現地（マドリードやバルセロナなど）で同年代の友達やお店・ピッチで最も自然に使われる実用的なスペイン語フレーズ（A1〜A2レベル、短く覚えやすい表現）に変換してください。
必ず以下のJSONフォーマットのみで出力してください。

{
  "spanish": "現地で最も自然に使われるスペイン語フレーズ",
  "japanese": "入力された日本語（または整理した自然な日本語訳）",
  "pronunciation": "ネイティブに近いカタカナ発音表記",
  "category": "挨拶・基本 | サッカー・交流 | 食事・買い物 | 移動・サバイバル のいずれか1つを厳密に指定",
  "chunks": ["単語1", "単語2", "単語3"],
  "tip": "13歳向けの楽しいワンポイント解説や使うタイミングのアドバイス"
}`;

    const userPrompt = `知りたい日本語・表現：「${japaneseRequest}」
この表現をスペイン現地で使えるフレーズに変換し、指定のJSONフォーマットのみで出力してください。chunksにはスペイン語フレーズをスペース区切りで分割した各単語の配列を入れてください。`;

    const parsed = await callGeminiApi({
      apiKey,
      modelId,
      systemPrompt,
      userPrompt
    });

    const spanish = String(parsed.spanish || '').trim();
    if (!spanish) {
      throw new Error('フレーズを生成できませんでした。別の言葉でもう一度試してみてね！');
    }

    const rawChunks = Array.isArray(parsed.chunks) && parsed.chunks.length > 0
      ? parsed.chunks.map(c => String(c).trim()).filter(Boolean)
      : spanish.split(/\s+/).filter(Boolean);

    const validCategories = ['挨拶・基本', 'サッカー・交流', '食事・買い物', '移動・サバイバル'];
    const categoryName = validCategories.includes(parsed.category)
      ? parsed.category
      : 'サッカー・交流';

    const categoryMap = {
      '挨拶・基本': 'greetings',
      'サッカー・交流': 'soccer',
      '食事・買い物': 'food',
      '移動・サバイバル': 'travel'
    };

    return {
      spanish,
      japanese: String(parsed.japanese || japaneseRequest).trim(),
      pronunciation: String(parsed.pronunciation || '').trim(),
      kana: String(parsed.pronunciation || '').trim(),
      category: categoryMap[categoryName] || 'soccer',
      categoryLabel: categoryName,
      chunks: rawChunks,
      distractors: ['por', 'favor', 'dónde'].filter(d => !spanish.toLowerCase().includes(d)).slice(0, 2),
      tip: String(parsed.tip || '現地で声に出して使ってみよう！').trim()
    };
  }

  window.VAMOS_GEMINI = {
    DEFAULT_MODEL,
    MODEL_PRESETS,
    ROLEPLAY_PERSONAS,
    safeParseJson,
    generateRoleplayReply,
    generateCustomPhrase
  };
})();
