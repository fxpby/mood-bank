# Boundaries Product Mapping

Source file: `docs/过犹不及（升级增订版）.md`

## Core Takeaway

The book maps strongly to the app's Self account: boundaries are not emotional coldness, punishment, or withdrawal. They are a way to clarify ownership, protect freedom, and love without over-carrying or controlling.

The strongest MVP contribution is a compact responsibility split:

1. What is mine?
2. What is not mine?
3. What limit or request can I state?
4. What consequence or next action will I own?

This should become a short "boundary clarity check" inside trigger support, draft self-check, full episode review, and personal action recommendations.

## Product Additions

### Boundary Clarity Check

A lightweight optional check for moments involving guilt, resentment, over-responsibility, rescuing, anger, pressure to reply, or fear that saying no will destroy connection.

Recommended prompts:

* "这件事里，什么是我的责任？"
* "什么不是我的责任，但我正在背起来？"
* "我真正能给出的是什么？"
* "我需要说的一个清楚边界是什么？"
* "如果对方失望，我能不能允许那是对方的感受？"

The flow should produce one owned next action, not a demand that the other person change.

### Boundary Forms

MVP can use compact chips adapted from the book's boundary forms:

* language: say no, ask, name a feeling
* time: delay, pause, answer later
* attention: stop checking, stop rereading
* emotional distance: let the feeling cool before deciding
* physical distance: leave a situation or take space
* support: ask a safe person for perspective
* consequence: state what the user will do if the pattern repeats
* digital: no immediate reply, no nighttime checking, no extra message today

### Guilt And Anger Signals

The book treats resentment, guilt, and anger as information about boundary strain. MVP should avoid moralizing them.

Prompt direction:

* "这个内疚是在提醒我有爱，还是在逼我越过自己的界限？"
* "这个愤怒可能在保护哪个边界？"
* "我可以共情对方的失望，但不把它变成我的责任。"

This connects to existing inner-critic and old-echo work without asking for detailed trauma retrieval.

### Say No And Receive No

A mature boundary practice includes both:

* saying no without over-explaining
* receiving another person's no without collapse, retaliation, or over-checking

MVP should include both directions so the app does not train entitlement or control.

Recommended copy:

* "我可以拒绝，也可以继续关心。"
* "对方可以拒绝，这不等于我不存在。"
* "不确定时，我可以先不答应。"

### Consequences Without Punishment

Consequences should be user-owned actions, not threats:

* "如果我今晚还想补发解释，我先保存草稿到明天。"
* "如果对话开始攻击，我先暂停并离开。"
* "如果我想反复检查，我做一个 10 分钟非检查动作。"

MVP should not encourage ultimatums, coercion, surveillance, or using points to control the other person.

### Digital Boundaries

The digital-boundary chapter maps directly to this app's signal-checking and rumination loops.

Recommended personal actions:

* "今晚不补发解释。"
* "睡前不检查这段关系的信号。"
* "把想说的先存进草稿。"
* "10 分钟内不重读聊天记录。"
* "明天再决定是否回应。"

## Account Effects

* Self account: strengthened by clear ownership, saying no, accepting no, not over-carrying, and stating a user-owned boundary.
* Energy account: may improve when boundary reduces depletion, but should remain user-rated.
* Connection account: should not increase merely because the user set a boundary. It can increase only when the boundary leads to real self-contact in a self-facing space or observable mutual respect in an interpersonal episode.

## MVP Recommendations

Add:

* `BoundaryClarityCheck` optional field on episodes.
* Boundary form chips in trigger, draft self-check, and full review.
* Seed personal actions for digital and emotional boundaries.
* One seed experiment: "练习一个小小的拒绝".
* Acceptance criterion that the app can record what is mine / not mine without blaming the other person.

Do not add:

* a boundary score
* a long boundary course or workbook
* advice to control, punish, test, or manipulate the other person
* legal/safety advice beyond recommending outside help in unsafe situations
