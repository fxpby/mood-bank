# Seeing And Being Seen Product Mapping

Source file: `docs/如何了解一个人.md`

## Core Takeaway

This outline overlaps with the existing PRD themes of being seen, empathy, repair, and healthy love, but it adds a more operational layer: seeing someone is not just an emotional outcome; it is a set of learnable micro-skills.

For the MVP, the useful product addition is not "how to read people" or a personality analysis tool. It is a short, optional "seeing / being seen practice" that helps the user:

* receive being seen without escalating into obligation or future prediction
* prepare to see the other person through better questions and listening
* distinguish understanding from agreeing, rescuing, diagnosing, or controlling
* handle hard conversations by tracking both content and the underlying emotional frame
* practice companioning: presence, patience, and witness, not advice-giving

## Product Additions

### Seeing / Being Seen Practice

Add a lightweight optional check for moments involving warmth, misunderstanding, repair, hard conversation, or the user's wish to respond well.

Recommended framing:

* "这次我被看见了什么？"
* "我还想更看见对方什么？"
* "我是在理解，还是急着回应/证明/建议？"
* "我可以先确认我听懂了，而不是马上解决。"

This should sit inside full episode review, rich incoming message review, draft checker, repair/understanding check, and calm closure. It should not become a Home primary action.

### Illuminator Orientation

The book contrasts diminishers with illuminators. MVP can adapt this as a self-stance check, not a label for the other person.

Recommended prompts:

* "此刻我是在照亮，还是在缩小对方？"
* "我有没有用一个标签替代一个人？"
* "我能不能把对方先看作一个复杂、变化中的人？"
* "我能不能承认：我现在只知道一部分？"

This maps to Self account because it supports humility, non-control, and responsibility for one's stance.

### Listening And Question Skills

Add small "see better" action chips when the user wants to respond, repair, or understand:

* ask one open question
* reflect back what I heard
* name the feeling I think I heard and ask if it fits
* ask for the story, not the conclusion
* pause before giving advice
* ask "然后呢？"
* ask "这件事对你来说意味着什么？"
* ask "我有没有听漏什么？"

These should be optional personal actions or draft-check outputs. The app should not force the user to interrogate the other person or keep a conversation going when they need rest or boundaries.

### Two-Layer Hard Conversation Check

Hard conversations have a content layer and a relationship/emotion layer. MVP can add a short optional check:

* content layer: what are we talking about?
* undercurrent layer: what seems at stake emotionally?
* respect check: is respect still present?
* frame check: are we trying to win, defend, understand, repair, set a boundary, or pause?
* next step: clarify, mirror, ask, repair, boundary, pause, or later topic

This extends the existing repair/understanding and boundary checks.

### Companioning Instead Of Fixing

The chapters on presence and supporting despair reinforce an important MVP boundary: not every response should be advice, reframe, or solution.

Recommended prompts:

* "这里需要建议，还是陪伴？"
* "我能不能表达：我在，不急着让你变好？"
* "对方是否需要回应，还是只需要被接住一点？"
* "如果我没有能力接住，我能诚实表达自己的限度吗？"

This is especially useful for rich incoming messages and draft checker, where users may over-carry or over-answer.

### Narrative Listening

The book's "life story" material is too large for MVP as a required feature, but it can inform later topics and deeper full review.

MVP prompt seeds:

* "这像是对方故事里的哪个主题？我有证据吗，还是只是猜测？"
* "我想了解的是事件，还是这件事对 TA 的意义？"
* "我可以把它放进稍后，等关系自然抵达。"

The app should avoid building a dossier about the other person. Any narrative notes should be episode-scoped and user-owned.

## Account Effects

* Connection account: can increase when the episode records real being seen, being understood, mutual listening, respectful presence, or repair.
* Self account: can increase when the user chooses humility, non-labeling, open questioning, reflective listening, boundary-aware presence, or pause instead of control.
* Energy account: records whether seeing/being-seen work was nourishing, depleting, or mixed.

## MVP Recommendations

Add:

* A `SeeingPractice` optional field on episodes.
* A small set of listening/question action chips.
* A two-layer hard conversation check inside repair/understanding.
* Companioning prompts in rich incoming message review and draft checker.
* Seed experiment: "Reflect Before Reply" and "Ask One Better Question".
* Acceptance criteria that seeing practice records user stance and one next action without analyzing the other person.

Do not add:

* people-reading tools
* personality tests or MBTI/Big Five features
* empathy score
* partner dossier or psychological profile
* advice that the user must always listen longer, repair, or stay available
* crisis-support workflows beyond the existing support-seeking boundary
