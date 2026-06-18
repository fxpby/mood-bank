# Mosquito-Elephant Product Mapping

Source file: `docs/躲在蚊子后面的大象.md`

## Core Takeaway

The book's central product insight is: a small visible trigger ("mosquito") may activate a much larger hidden need, wound, protective program, or self/other image ("elephant"). This maps strongly to the app's trigger-first and old-echo direction.

The MVP should not turn the book into long questionnaires. It should use the metaphor as a compact reflection structure:

1. Name the mosquito: what small visible event happened?
2. Name the elephant signal: why did it feel bigger than the event?
3. Identify the touched need: safety, respect, autonomy, belonging, fairness, care, recognition, curiosity, rest, etc.
4. Identify the protective program: check, explain, accuse, withdraw, please, control, numb, overwork, rescue, prove.
5. Choose one new response: a small action that protects the need without repeating the old program.

## Concepts To Add

### Mosquito / Elephant Split

This should become a user-facing optional check in triggered and full record flows:

* "蚊子：今天看得见的小事是什么？"
* "大象：它碰到的更大东西可能是什么？"
* "如果别人觉得这是小事，为什么它对我不是小事？"
* "这件事背后哪个需要被碰到了？"

### Basic Needs

The book repeatedly frames intense emotional reactions as signals that a basic need is threatened or neglected. The app should add a needs vocabulary, not as a diagnosis but as selectable chips.

Recommended MVP need chips:

* safety / 安全感
* being seen / 被看见
* respect / 被尊重
* autonomy / 自主
* boundary / 边界
* fairness / 公平
* belonging / 归属
* care / 被照顾
* reliability / 稳定回应
* competence / 能力感
* rest / 休息
* play / 好奇和自由

### Protective Program

The book's "self-protection program" maps well to existing trigger urges and drama-triangle work. Add explicit language:

* "我的旧保护程序想让我怎么做？"
* "这个动作短期在保护什么？长期会让我更靠近还是更远离需要？"

### Need Quadrant

The book's need/value quadrant is too heavy for first screen but useful for future or deep review. MVP can include a lightweight two-need tension check:

* Need A: the need activated right now.
* Need B: another need that may also matter.
* Old ineffective expression.
* One more balanced expression.

Examples:

* security vs autonomy
* being respected vs respecting self/others
* belonging vs independence
* fairness vs flexibility
* being cared for vs not over-carrying

### Repetition Training

The book emphasizes repeated practice and choosing one frequently recurring scenario. This maps to experiments:

* Pick one recurring mosquito.
* Track the elephant it points to.
* Practice one new response repeatedly.
* Reward repeated noticing and completion, not immediate emotional relief.

## MVP Recommendations

Add:

* `MosquitoElephantCheck` optional section in episodes.
* Need chips in trigger and full episode flows.
* Protective program chips tied to urge.
* One seed experiment: "找到我的大象".
* Account effects: identifying a need and choosing a new response primarily supports Self; completing a new response can support Self/Energy.

Do not add:

* long book-style self-tests in MVP
* claims that the app replaces therapy
* multi-page need quadrant as required flow
* examples copied from the book as seed data
