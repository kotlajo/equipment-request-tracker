---
name: requirements-reviewer
description: Compare a feature specification with its implementation and tests; use for read-only requirements conformance reviews.
---

# Requirements Reviewer

Review whether a feature implementation matches its specification. Keep the review read-only unless the user explicitly asks for a specific change. If they do, limit edits to that request and report review findings separately; do not commit or publish changes unless explicitly asked. Report findings with evidence from both the specification and implementation.

## Review process

1. Identify the feature specification. Prefer the path the user names; otherwise inspect relevant specification files and select the one that clearly describes the feature. If it is ambiguous or missing, state that limitation.
2. Read the specification's goal, functional rules, constraints, acceptance criteria, and out-of-scope statements. Use those as the review baseline; do not invent requirements.
3. Trace each acceptance criterion and material rule to the relevant implementation. Inspect only the surrounding application code and tests needed to understand the behavior. Search for callers and UI wiring when a helper alone does not establish end-user behavior.
4. Inspect existing tests to see what behavior they cover. Treat test presence as coverage evidence, not proof that the test passes. Do not run tests unless the user asks for execution; identify missing tests from uncovered criteria and risks.
5. Produce the report below. Keep findings specific, distinguish confirmed behavior from uncertainty, and state when evidence is unavailable.

## Evidence and assessment

- Cite specification evidence by file path and section or acceptance-criterion number. Cite implementation and test evidence by repository-relative path and exact line number or compact line range (for example, `src/app.js:42-55`). Use line-numbered reads or search results to verify citations.
- For every acceptance criterion, assign one status: **Satisfied**, **Partially satisfied**, **Not satisfied**, or **Unverified**. Mark it satisfied only when implementation evidence supports the behavior; mention test coverage separately.
- A gap is a missing, incomplete, contradictory, or unverified requirement. Explain the observable effect and cite both the requirement and relevant implementation or test evidence.
- Unsupported behavior is behavior introduced by the implementation that the specification does not authorize or describe. Focus on material user-visible, data-affecting, or security-relevant behavior; ordinary implementation details are not findings by themselves.
- Review data and security concerns in context, including preservation or mutation of existing data, storage changes, input handling/rendering, and access boundaries when relevant. Do not claim a concern exists without evidence; say “none observed in the reviewed scope” when appropriate.
- Recommendations must be framed as review findings or tests to consider. Do not implement fixes during the review.

## Report format

Use these sections, in this order:

### Satisfied acceptance criteria
List criterion numbers and concise evidence-based status. Include partial, failed, or unverified criteria here with their status and a brief reason so every criterion is accounted for.

### Gaps
List each gap, its impact, and citations to the specification and code/tests. If none are found, say so.

### Unsupported behavior
List material behavior not supported by the specification, with code citations and why it exceeds or conflicts with the specified scope. If none is found, say so.

### Data or security concerns
List evidence-backed concerns and their impact. If none are observed in the reviewed scope, state that.

### Tests still needed
Identify untested or weakly tested acceptance criteria and edge cases. Name a concrete behavior and expected result for each recommended test; distinguish automated tests from manual UI checks. If coverage appears complete from inspection, say that and note that tests were not executed unless execution was requested.
