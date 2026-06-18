# Attachment Continuity Awareness

## Why This Matters

The product should cover the user's experience that felt connection can collapse, disappear, become dangerous, or feel unreal during silence, delay, ambiguity, conflict, warmth-afterglow, or separation.

For MVP, this should be treated as momentary awareness of connection continuity, not as diagnosis of anxious, avoidant, fearful-avoidant, disorganized attachment, or object-constancy impairment.

## Source Notes

* Mikulincer, Shaver, and Pereg describe attachment theory as a useful framework for affect regulation and distinguish attachment-related strategies after activation. This supports designing around momentary activation and regulation strategy rather than stable diagnosis: https://link.springer.com/article/10.1023/A:1024515519160
* Fraley's ECR-R notes adult attachment self-report is commonly modeled with anxiety and avoidance dimensions. This supports avoiding a single "attachment type" label in MVP and instead detecting momentary anxiety/avoidance-like patterns: https://labs.psychology.illinois.edu/~rcfraley/measures/ecrr.htm
* Psychodynamic "object constancy" language is useful for product thinking, but it is not the right primary UI language for a self-reflection PWA. User-facing copy should use "连接感", "还能记得什么", "现在不能证明什么", and "我和自己还接得上什么".

## Product Implications

* Do not ask users to classify themselves as anxious, avoidant, or fearful-avoidant in primary flows.
* Do not produce a stable attachment score, object-constancy score, or clinical interpretation.
* Add a lightweight "connection continuity check" in high-activation flows.
* Detect momentary patterns:
  * separation alarm: urgency to verify closeness, reply, signal, or reassurance
  * deactivation: numbness, withdrawal, minimizing need, cutting off, or telling oneself it does not matter
  * push-pull: simultaneous urge to approach and escape, send and delete, cling and disappear
  * self-disconnection: losing contact with body, needs, values, or present reality
* Use stored anchors as reminders of continuity, not proof of future relationship outcomes.
* Account impact should reward noticing and returning to self, not feeling secure immediately.
