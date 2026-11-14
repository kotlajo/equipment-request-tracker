# Priority Filter and Sort Specification

## Goal

Help managers identify equipment requests that need attention by assigning priority from request keywords and providing controls to filter or sort requests by priority.

## User Need

As a manager, I need requests to be automatically classified as high, medium, or low priority based on keywords, so I can focus on the requests that need attention while retaining access to every request.

## Functional Rules

- Priority classification uses keywords found in the request's existing text. It assigns one of the existing priority values: High, Medium, or Low.
- Keyword matching is case-insensitive. A keyword must match as a complete word or phrase, not merely as part of a longer word.
- The keyword-to-priority vocabulary must be explicit and deterministic, and covered by tests. The business requirement does not provide the actual keyword lists; define and document those lists before implementation is considered complete.
- When a request matches keywords from more than one priority level, assign the highest matching priority: High before Medium before Low.
- A request with no matching keyword keeps its existing priority, if one is present; otherwise it has no assigned priority. It remains visible in the unfiltered list.
- Managers can choose to show all requests or filter the list by priority. The filter can be turned off to restore the full list.
- Managers can choose to sort all requests by priority. Priority sorting orders High, then Medium, then Low; requests with the same priority retain their received order. Requests without a priority appear after prioritized requests.
- With no filter or priority sort selected, requests remain in the app's existing received order (newest first).
- Filtering and sorting affect only the displayed view. They do not delete, rewrite, or otherwise hide requests from the unfiltered view.
- Filter and sort selections are temporary page state. They reset when the page is refreshed.
- Priority classification and view controls work without a login, database, or external service.

## Constraints

- Preserve all existing requests and their data. The feature must not require users to clear or recreate stored requests.
- Use the application's existing priority information and local storage approach; do not add a login, database, or external service.
- Keep filtering and sorting in memory for the current page session; do not persist those selections across refreshes.
- Keep all requests accessible by turning the filter off. Sorting alone must not remove requests from the list.

## Acceptance Criteria

1. Given a request containing a configured High keyword, when its priority is evaluated, then it is classified as High.
2. Given a request containing a configured Medium keyword and no High keyword, when evaluated, then it is classified as Medium.
3. Given a request containing a configured Low keyword and no High or Medium keyword, when evaluated, then it is classified as Low.
4. Given a request with keywords from multiple priority levels, when evaluated, then the highest matching priority is assigned.
5. Given a keyword with different capitalization, when evaluated, then it matches the same way as the configured keyword.
6. Given a keyword that appears only as part of a longer word, when evaluated, then it does not match.
7. Given a request with no matching keyword, when evaluated, then its existing priority is retained; if it has no existing priority, it remains unprioritized and visible.
8. Given the default view, when requests are displayed, then they appear in the app's existing received order (newest first).
9. Given the priority sort, when requests are displayed, then High requests appear before Medium, Medium before Low, and unprioritized requests last; order within each priority group remains in received order.
10. Given a selected priority filter, when the filter is applied, then only requests with that priority are displayed.
11. Given an active priority filter, when the manager turns the filter off, then all requests are displayed again.
12. Given any filter or sort selection, when the page is refreshed, then the view returns to the default unfiltered received order.
13. Given existing stored requests, when the feature is used, then every existing request remains available and its non-priority data is preserved.
14. Given the feature, when run without a login, database, or external service, then priority classification and filtering/sorting work using the app's existing local data.

## Out of Scope

- Login, user accounts, roles, or manager-specific permissions.
- Database or external-service storage.
- Persisting filter or sort selections across page refreshes.
- Deleting, archiving, or editing requests as part of prioritization.
- A manager-facing interface for editing the keyword vocabulary.
- Changing the application's request form or adding new request fields solely for this feature.
