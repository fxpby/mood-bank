# Self-Compassion Product Mapping

Source file: `docs/自我关怀的力量.md`

## Core Takeaway

The outline maps well to the app's existing goal: move from self-judgment and attachment activation toward self-stabilization and owned action.

The strongest MVP contribution is the three-part self-compassion structure:

1. Mindfulness / 静观: see pain clearly without over-identifying.
2. Common humanity / 共通人性: remember that pain, imperfection, shame, and need are human.
3. Self-kindness / 善待自己: respond to oneself with warmth rather than attack.

This can become a compact "self-compassion pause" inside trigger, inner critic, and Return-to-Self flows.

## Product Additions

### Self-Compassion Pause

A short bridge after high activation or inner critic detection:

* "这很难。"
* "痛苦、需要和不完美是人类经验的一部分。"
* "此刻我能怎样对自己温柔一点？"

This should be optional and short, not a long meditation.

### Inner Critic Reframe

Existing inner critic work can be strengthened:

* notice harsh self-talk
* soften the tone
* rewrite as a caring but honest sentence

Recommended prompt:

* "如果这是一个很关心我的朋友，会怎么说？"
* "这句话既诚实又不伤害我，可以怎么说？"

### Body-Based Soothing

The outline includes touch/soothing/body scan. MVP can safely include conservative options:

* hand on chest
* warm palm on arm
* gentle self-hug
* soften jaw/shoulders
* slow exhale

Avoid biological claims such as "this releases oxytocin" in primary UI.

### Relationship Boundary

The interpersonal section reinforces a key product principle: self-compassion is not self-indulgence or bypassing responsibility. It helps users reduce criticism/defensiveness and take responsibility with less shame.

Prompt direction:

* "我能不能先安抚自己，再决定是否回应对方？"
* "我可以承认我的感受，也不把它变成攻击。"
* "自我关怀不是放任自己，而是选择更长期有益的行动。"

### Self-Compassion vs Self-Esteem

The outline's self-esteem section is important for this app because the MVP should not create another "am I good enough" measurement.

Product implication:

* Do not add self-esteem, self-worth, attractiveness, or likability scores.
* Use the Self account for owned action, responsibility boundaries, self-respect, and reduced self-attack.
* When users want proof that they are worthy or lovable, route them toward fact separation, self-compassion, and one responsible next action rather than a rating.

### Self-Appreciation

The later self-appreciation material can become a light positive counterpart to trigger work:

* "我刚刚有什么值得被我看见？"
* "这一步里，我欣赏自己的哪一点？"
* "我可以存下一点对自己的认可，不用把它变成比较。"

This belongs in calm closure, Return-to-Self completion, and the personal action menu, not as a public achievement or competitive badge.

### Account Effects

* Self account: strengthened by noticing pain without self-attack, softening the inner critic, and choosing a caring but responsible response.
* Energy account: may improve after soothing, but should remain user-rated.
* Connection account: should not increase unless there is actual self-contact or interpersonal contact evidence.

## MVP Recommendations

Add:

* `SelfCompassionPause` optional field on episodes or trigger completions.
* One seed personal action: "给自己一句不攻击的话".
* One seed anchor: "这很难，但我不需要再攻击自己。"
* One optional completion after inner critic: "我把批评改写成了一句关怀的话。"
* One calm-closure prompt for non-comparative self-appreciation.

Do not add:

* self-compassion score
* self-esteem or self-worth score
* clinical or biological claims
* long meditation courses
* advice that turns self-compassion into avoiding accountability
