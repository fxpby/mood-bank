# DBT-Informed Return-To-Self Notes

## Purpose

Use DBT-inspired skill structure to make the app's "Return to Self" flow concrete, short, and non-clinical.

## Relevant DBT Skill Families

* Mindfulness: notice, observe, describe, and return attention to the present.
* Distress tolerance: survive high-emotion moments without making them worse.
* Self-soothing: use senses and simple body actions to reduce arousal.
* Emotion regulation: name emotions and choose effective next action.
* Interpersonal effectiveness: preserve self-respect and boundaries while relating to others.

## Local Workbook References

Source: `docs/DBT-skills-work-book.md`

Relevant sections inspected:

* Chapter 1, "REST": Relax, Evaluate, Set an intention, Take action.
* Chapter 1, self-soothing through five senses: smell, sight, hearing, taste, touch.
* Chapter 3, physiological coping skills: cold stimulation, paced/slow breathing, progressive muscle relaxation, physical movement. These need safety disclaimers and should be optional.
* Chapter 4, mindfulness emotion description: identify emotions, distinguish emotion/thought/body sensations, describe intensity, notice emotional waves.

## Product Mapping

The MVP should not claim to provide DBT therapy. It can use DBT-informed patterns:

* Notice: name what is happening in the body/emotion.
* Pause: create a short gap before checking, sending, or escalating.
* Ground: use body/senses actions.
* Choose: pick one effective next action the user controls.
* Return: reconnect to a small real-life activity.

The trigger support flow maps cleanly onto REST:

* Relax -> body landing.
* Evaluate -> fact + emotion/body check.
* Set an intention -> owned next action.
* Take action -> return-to-self or save/continue into deeper flow.

## Return-To-Self Flow

Recommended MVP structure:

1. Body landing: water, wash hands/face, stand and walk, look outside, hold something soft, five-senses observation, paced breath.
2. Attention anchor: a short grounding sentence.
3. Next real-life action: eat, shower, study/read, walk, make a drink, sleep, write personal content, stop analyzing for now.

Extra DBT-informed options:

* Five senses can be offered as a segmented control: see, hear, smell, taste, touch.
* Emotion description can be lightweight: emotion label, intensity, body location, thought/story.
* Physiological options should be conservative in MVP:
  * cold water on hands/face rather than intense cold exposure
  * slow breathing rather than complex breath retention
  * unclench jaw / relax shoulders rather than full progressive muscle relaxation
  * short walk or gentle movement rather than intense exercise

## Safety Boundary

Copy should say "DBT-informed" or "inspired by grounding skills" only in documentation, not as a clinical promise in the UI. The app is for self-reflection and stabilization, not crisis care or therapy.

Avoid:

* instructing users with heart/blood-pressure/pregnancy/respiratory risks to use cold or intense physiological methods without professional advice
* presenting any grounding option as guaranteed to work
* using long therapy-like worksheets in urgent flows
