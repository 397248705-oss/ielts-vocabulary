# IELTS Vocabulary PWA Design

## Overview

Build a mobile-first vocabulary learning PWA for personal IELTS study. The app runs in a phone browser, can be added to the home screen, and stores all learning progress locally on the device. The first release focuses on a useful standalone experience rather than accounts, cloud sync, or backend services.

The app's working name is "雅思单词本".

## Goals

- Provide a phone-friendly daily IELTS vocabulary study flow.
- Include an internal IELTS vocabulary set with 500-1000 entries.
- Store learning progress only in the browser on the phone.
- Use a mixed learning mode: flashcard recognition, multiple choice, and spelling.
- Schedule review with an Anki-style spaced repetition model.
- Support browser speech synthesis for word pronunciation.
- Support local backup and restore through exported/imported learning records.
- Work as a PWA with cached app assets and vocabulary data after first successful load.

## Non-Goals

- No user account system.
- No cloud synchronization.
- No backend service in the first version.
- No paid or copied commercial IELTS wordbook content.
- No real human pronunciation audio in the first version.

## Product Structure

The app has four bottom navigation tabs:

- `今日`: Shows today's study state and starts the learning session.
- `词库`: Browses the built-in IELTS vocabulary, supports search, and shows each word's study state.
- `统计`: Shows study streak, mastered word count, accuracy, and today's progress.
- `设置`: Changes daily new-word count, exports/imports local records, and supports resetting local data.

The home screen opens directly to today's task. It shows due review count, daily new-word target, total progress, and a primary "开始学习" action.

## Learning Flow

The daily task is built from two queues:

- Due review words: words whose next review date is today or earlier.
- New words: unseen words added until the daily new-word target is met.

The default daily new-word target is 20. The user can change it in settings.

The mixed learning mode uses three exercise types:

- Flashcard: Shows English word, phonetic spelling, part of speech, and pronunciation button. The user reveals Chinese meaning and example sentence, then chooses `认识`, `模糊`, or `不认识`.
- Multiple choice: Shows the English word and four Chinese meaning options.
- Spelling: Shows Chinese meaning and an example hint, then asks the user to type the English word.

New words start with flashcards. Review words can appear as flashcards, multiple choice, or spelling depending on familiarity. Spelling is used for words with higher familiarity so the first experience is not too punishing.

The user can leave a session at any time. Completed exercise results are saved immediately, and unfinished tasks remain available later.

## Spaced Repetition

Each word has a local study record. The record stores:

- Whether the word has been seen.
- Familiarity score.
- Current review interval.
- Next review date.
- Consecutive correct count.
- Error count.
- Latest result.
- Exercise history summary.
- Favorite flag.

The algorithm is Anki-style but hidden from the UI. User-facing results map to internal review quality:

- `不认识` or incorrect answer: reduce familiarity, shorten the interval, and bring the word back soon.
- `模糊` or hesitant answer: keep a short interval and make only small familiarity changes.
- `认识` or correct answer: increase familiarity and extend the interval.
- Correct spelling answers count more strongly than correct multiple-choice answers.

The scheduler prioritizes due review words before new words.

## Vocabulary Data

The built-in vocabulary file stores each word as structured data:

- Stable word ID.
- English word.
- Chinese definition.
- Part of speech.
- Phonetic spelling.
- English example sentence.
- Chinese example translation.
- Difficulty tag.

Vocabulary data and study records are stored separately. Updating the built-in vocabulary must not overwrite the user's progress.

The first release targets 500-1000 IELTS high-frequency words. Definitions and examples should be original or from sources with compatible licensing. The app must avoid copying commercial IELTS wordbook text.

## Local Storage and Backup

Learning progress is stored locally in the phone browser. The first version should use a structured browser storage approach suitable for records that may grow over time, such as IndexedDB.

Settings store:

- Daily new-word target, default `20`.
- User preferences needed by the study flow.
- Backup metadata if available.

The settings page includes:

- Export learning records to a JSON backup file.
- Import learning records from a JSON backup file.
- Clear local data, protected by a second confirmation.

Import validation must reject incompatible or malformed files without overwriting existing progress.

## PWA and Offline Behavior

The app should include:

- Web app manifest.
- Service worker.
- Cached app shell assets.
- Cached vocabulary data.
- Mobile home-screen metadata.

After the first successful load, the app should open from cache and preserve study progress offline. If cache loading fails, the user should see a retry option. If local records cannot be read, the app should offer retry, import backup, or reset.

Pronunciation uses browser speech synthesis. If unsupported, the pronunciation button is disabled or hidden, and the rest of the study flow continues normally.

## UI Direction

The interface is mobile-first and designed for one-handed use:

- Bottom navigation.
- Large primary action on the home screen.
- Study card as the visual center of the learning page.
- Thumb-friendly controls.
- Compact statistics that are easy to scan.
- Clear feedback after each answer.

The visual style should be calm and focused. Use a neutral base with a small set of state colors for correct, incorrect, due, and mastered states.

## Error Handling

The app handles these cases explicitly:

- Local record read failure: show retry, import backup, and reset options.
- Vocabulary cache failure: show reload/retry.
- Speech synthesis unavailable: disable or hide pronunciation.
- Backup import format mismatch: reject the file and keep current records.
- Clear-data action: require a second confirmation.

All destructive operations must avoid accidental data loss.

## Testing Strategy

Core tests should cover:

- Creating today's task from due reviews and new words.
- Saving progress after each exercise.
- Updating next review date and interval from each answer result.
- Distinguishing weights for flashcard, multiple choice, and spelling outcomes.
- Preserving progress after refresh.
- Exporting and importing learning records.
- Rejecting invalid backup imports.
- Mobile viewport layout for home, study, vocabulary, statistics, and settings screens.
- PWA app load and cache behavior in a local browser.

## Open Implementation Choices

- Exact frontend stack will be chosen during implementation planning.
- Exact spaced repetition formula can be a small local implementation inspired by SM-2 or a proven lightweight scheduling library if it fits the frontend stack.
- Exact IELTS word source will be selected during implementation, with licensing checked before data is included.

