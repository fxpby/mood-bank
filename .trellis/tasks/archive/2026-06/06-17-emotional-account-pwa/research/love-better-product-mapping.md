# Love Better Product Mapping

Source file: `docs/How to Love Better: The Path to Deeper Connection Through Growth, Kindness, and Compassion.md`

## Core Takeaway

The book's strongest contribution to this MVP is healthy love literacy: love and being loved are learned capacities, not automatic instincts. Many users enter intimacy with emotional neglect, family-of-origin wounds, media-shaped fantasies, and limited models for repair, kindness, conflict, or steady care after novelty fades.

For this app, the product should not become a relationship course or a verdict engine. It should add short, contextual prompts that help the user practice better love in one concrete moment:

* distinguishing love from attachment, control, and novelty-chasing
* seeing conflict as a possible path to understanding rather than automatic failure
* remembering that care is a skill, not only a feeling
* choosing repair, honesty, kindness, responsibility, boundary, or waiting when activated
* noticing whether an action preserves freedom and dignity for both people

## Product Additions

### Healthy Love Literacy

Add an optional check for interpersonal spaces and high-meaning self-facing spaces.

Recommended framing:

* "爱和被爱都需要学习。"
* "现在不是判断整段关系的时候，先看这一刻我能练习什么。"
* "我想要的是理解、修复、靠近、边界，还是确定感？"
* "这个动作会增加自由和理解，还是增加控制和压力？"

This should be available after emotion calibration, boundary clarity, draft self-check, rich incoming message review, and conflict-related episodes.

### Love Vs Attachment / Control / Novelty

The book repeatedly separates love from attachment. In product terms, this maps to a lightweight motivation check:

* "这是爱，还是想抓紧来降低不安？"
* "我想靠近，还是想让对方按我的方式存在？"
* "我是在表达真实关心，还是在用行动换确定感？"
* "我是在珍惜这段连接，还是只是在追逐新鲜感/高峰感？"

The output should be one freedom-preserving action, such as:

* pause before sending another message
* ask one honest question without pressure
* name one boundary
* receive warmth without escalating
* let the topic wait
* choose one self-care action while still caring

### Relationship Phase Awareness

The user's note about passion, disillusionment, self-reflection, and repair maps well to an optional "phase awareness" chip set. This should not become deterministic relationship-stage doctrine.

MVP phase chips:

* attraction / resonance
* disillusionment / mismatch noticing
* self-reflection
* repair / negotiation
* integration / insight
* ordinary care / maintenance

Purpose:

* help the user not treat loss of novelty as automatic loss of love
* help the user not treat first conflict as automatic incompatibility
* help the user notice whether they are avoiding the self-reflection and repair phases
* normalize ordinary care and maintenance as real intimacy, not a downgrade from passion

### Repair And Understanding Check

Conflict-related episodes should offer a short repair check:

* "这次我想被理解的是什么？"
* "我可能还没有理解对方的是什么？"
* "我能为自己的哪一部分负责？"
* "这里需要修复、边界、等待，还是先放进稍后？"
* "如果目标不是赢，而是理解，下一句/下一步会有什么不同？"

This connects directly to the Self account because responsibility, non-control, and repair attempts are user-owned. Connection should increase only when there is real mutual understanding, repair, or respectful contact.

### Care Literacy

The book distinguishes loving someone from knowing how to care for them. MVP should support this as a small reflection, not a demand for the other person to provide care.

Recommended prompts:

* "我希望被爱的方式是什么？"
* "我正在怎样学习照顾这段关系，而不失去自己？"
* "我能清楚表达一个偏好吗，而不是期待对方猜到？"
* "这次我收到的关怀是什么？我还需要什么不能从这一次推出？"

The app should not ask the user to diagnose the other person's capacity or attachment style.

### Growth Signals Without Partner Scoring

The book's green flags should not become a partner scorecard. They can become evidence-based "growth signals" in a specific episode:

* honesty
* kindness
* willingness to understand
* willingness to repair
* respect for boundaries
* accountability
* non-control
* mutual presence
* ordinary care

Prompt:

* "这次互动里，有没有一个可观察的成长信号？"
* "这只是这一刻的证据，不是未来保证。"

### Love After Emotional Neglect

The user's observation about emotional neglect and family-of-origin wounds fits the existing old-echo and inner-critic sections. The app should help users see that unhealthy love templates can be learned, then gently practiced differently.

Recommended prompts:

* "我现在期待的爱，像不像过去熟悉的模式？"
* "我是不是把高张力误认为强烈的爱？"
* "平静、稳定、普通，会不会反而让我不习惯？"
* "这一刻我能学习一种更健康的被爱方式吗？"

Avoid asking for detailed childhood memories or making trauma claims.

## Account Effects

* Connection account: can increase when an episode records being seen, mutual understanding, repair, honest care, respectful conflict, or ordinary reliable care.
* Self account: can increase when the user chooses honesty with kindness, accountability without self-attack, repair without control, boundary without punishment, or care without self-abandonment.
* Energy account: records whether a growth/repair attempt is nourishing, depleting, or mixed. Not all "good relationship work" feels energizing in the short term.

## MVP Recommendations

Add:

* A `RelationshipLearningCheck` optional field on episodes.
* A short "healthy love literacy" section in relevant full-review flows.
* Optional phase chips for attraction, disillusionment, self-reflection, repair, integration, and ordinary care.
* A repair/understanding check for conflict or post-trigger moments.
* Love-vs-attachment/control/novelty prompts.
* Growth-signal chips that are evidence-based and episode-scoped.
* Seed experiments:
  * Conflict As Understanding
  * How Can I Love Better
  * Love Without Control
  * Repair Before Conclusion
  * Ordinary Care Counts

Do not add:

* true-love tests
* compatibility score
* partner green-flag/red-flag scoring
* advice about whether to stay or leave
* deterministic relationship-stage labels
* claims that conflict, disillusionment, or loss of novelty automatically means the relationship is wrong
* prompts that pressure the user to keep repairing when a boundary or outside support is needed
