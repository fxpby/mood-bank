# Emotion Language Product Mapping

Source file: `docs/Atlas of the Heart : Mapping Meaningful Connection and the Language of Human Experience (9780399592577): Mapping Meaningful Connection and the Language of Human Experience.md`

## Core Takeaway

The book's most useful MVP contribution is emotional granularity: users need more than "开心 / 难过 / 生气" to understand what is happening inside them. Precise emotion language can reduce helplessness, misinterpretation, and reactive behavior.

For this app, emotion identification should be a short map, not an encyclopedia. The product should help users move from vague activation to a more accurate label, then to body signal, need, and owned next action.

## Product Additions

### Emotion Granularity

Use a two-step emotion picker:

1. Choose a broad emotion family.
2. Optionally refine into a nearby emotion.

MVP should allow "not sure" and "mixed" because forced precision can create shame or overthinking.

Recommended prompt:

* "先粗略命名就够了。"
* "如果愿意，再选一个更贴近的词。"
* "我可能不是 X，而更像 Y。"

### MVP Emotion Families

Keep the set compact:

* stress / overwhelm
* anxiety / worry / fear
* vulnerability / exposure
* shame / guilt / embarrassment / humiliation
* anger / resentment / contempt / disgust
* sadness / grief / heartbreak / longing
* disappointment / regret / discouragement / frustration
* envy / jealousy / comparison
* loneliness / disconnection / invisibility
* belonging / connection / being seen
* joy / happiness / calm / contentment / gratitude / relief
* curiosity / confusion / awe / wonder
* pride / humility / defensiveness

The app does not need to include all 87 emotions from the book in MVP.

### Near-Emotion Distinctions

Add small "emotion pair" nudges when relevant:

* anxiety vs excitement: similar body activation, different story and direction
* stress vs overwhelm: pressure vs "I cannot function right now"
* worry vs fear: future thought-chain vs present threat response
* shame vs guilt: "I am bad" vs "I did something misaligned"
* guilt vs responsibility boundary: useful repair signal vs over-carrying
* anger vs hurt/fear/betrayal: anger may be a signal to inspect what is underneath
* resentment vs boundary/need: "what do I need but have not asked for?"
* envy vs jealousy: wanting what someone has vs fearing loss of an existing connection
* sadness vs grief vs heartbreak: sadness as emotion, grief as loss process, heartbreak as love/connection loss
* loneliness vs solitude: painful lack of meaningful connection vs restorative aloneness
* fitting in vs belonging: changing self to be accepted vs being accepted as self
* sympathy vs empathy: distance/pity vs feeling-with and understanding
* joy vs happiness vs contentment: brief intense connection, broader pleasant state, enoughness
* calm vs relief: regulated response vs tension leaving after threat passes
* pride vs hubris: grounded pride in effort vs inflated self-protection

### Body And Story Split

Emotion recognition should capture four layers without making the user complete all of them:

* body signal
* emotion word
* story / interpretation attached to it
* need, value, or action tendency

This pairs with existing fact/interpretation separation.

### Mixed Emotions

The app should explicitly support mixed states:

* moved and scared
* warm and overwhelmed
* happy and sad
* connected and activated
* relieved and disappointed

This is important for rich incoming messages and ambiguous relationship moments.

### Emotion Calibration

Emotion identification answers "what is this feeling?" Emotion calibration answers "how do I relate to this feeling?"

MVP should help users see emotions as signals rather than enemies, commands, identities, or objective facts about the relationship.

Fear is the clearest example:

* fear is not the enemy
* fear can be a messenger that something or someone matters
* fear may be protecting attachment, safety, dignity, belonging, or self-trust
* the danger is often suppression, denial, or turning fear into control, anger, attack, or self-abandonment

Recommended calibration prompts:

* "这个情绪想保护什么？"
* "它在提醒我，我很在乎什么？"
* "它最害怕失去什么？"
* "如果我不压下它，也不让它开车，我能选择什么？"
* "这个情绪本身可以被允许；我需要约束的是被它驱动的动作。"

This should be short and should lead to one wise, loving, or self-respecting action.

### Connection Language

The book's connection material reinforces existing product direction:

* connection = feeling seen, heard, and valued
* belonging is not the same as fitting in
* self-betrayal can create disconnection from self and others
* empathy requires boundaries; otherwise it becomes over-carrying or entanglement

This should strengthen the Connection and Self accounts without creating a relationship-health score.

### High-Risk Emotion Boundary

The book discusses despair/hopelessness and severe pain. MVP can include a gentle safety boundary:

* If the user selects despair/hopelessness or writes self-harm content, the app should not continue ordinary reflection as if it is enough.
* The app should show a non-alarming suggestion to seek immediate human/professional/crisis support, while preserving the user's draft if safe.

The MVP should not claim to assess suicide risk or provide crisis intervention.

## Account Effects

* Self account: supported by naming emotion accurately, distinguishing shame from guilt, and choosing an owned next action.
* Energy account: can be affected by overwhelm, relief, calm, depletion, or restoration, but should remain user-rated.
* Connection account: can be supported by real experiences of being seen, heard, valued, belonging, empathy, repair, or self-contact in self-facing spaces.

## MVP Recommendations

Add:

* `EmotionRating` model with family, label, intensity, confidence, body cues, story, and action tendency.
* An `EmotionGranularityCheck` optional helper for near-emotion distinctions.
* An `EmotionCalibration` optional helper that reframes emotion as messenger/protector/signal and separates feeling from action.
* Emotion chips in trigger flow and full record, with "not sure" and "mixed" support.
* Rich incoming message review should let users mark mixed emotion threads such as "warm but overwhelmed".
* Acceptance criteria for identifying at least one emotion family and optionally refining it.

Do not add:

* all 87 emotion definitions as required UI
* diagnostic mood labels
* automatic emotion detection from message text in MVP
* emotion accuracy scoring
* moralizing emotion as good/bad or telling users to eliminate fear, sadness, anger, or vulnerability
* crisis assessment or treatment claims
