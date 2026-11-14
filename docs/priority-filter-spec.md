# Priority Filter and Sort Specification

## Goal

Help managers identify equipment requests that need attention by assigning priority from request keywords and providing controls to filter or sort requests by priority.

## User Need

As a manager, I need requests to be automatically classified as high, medium, or low priority based on keywords, so I can focus on the requests that need attention while retaining access to every request.

## Functional Rules

- Priority classification uses keywords found in the request's existing text. It assigns one of the existing priority values: High, Medium, or Low.
- The configured High priority keywords are **urgent**, **critical**, and **emergency**. The configured Medium priority keyword is **important**. No Low priority keywords have been specified.
- Keyword matching is case-insensitive. A keyword must match as a complete word or phrase, not merely as part of a longer word.
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

1. Given a request containing **urgent**, **critical**, or **emergency** as a complete word or phrase, when its priority is evaluated, then it is classified as High.
2. Given a request containing **important** as a complete word or phrase and no High keyword, when evaluated, then it is classified as Medium.
3. Given a request containing a High keyword and **important**, when evaluated, then it is classified as High.
4. Given a keyword with different capitalization, when evaluated, then it matches the same way as the configured keyword.
5. Given a configured keyword that appears only as part of a longer word, when evaluated, then it does not match.
6. Given a request with no matching keyword, when evaluated, then its existing priority is retained; if it has no existing priority, it remains unprioritized and visible.
7. Given the default view, when requests are displayed, then they appear in the app's existing received order (newest first).
8. Given the priority sort, when requests are displayed, then High requests appear before Medium, Medium before Low, and unprioritized requests last; order within each priority group remains in received order.
9. Given a selected priority filter, when the filter is applied, then only requests with that priority are displayed.
10. Given an active priority filter, when the manager turns the filter off, then all requests are displayed again.
11. Given any filter or sort selection, when the page is refreshed, then the view returns to the default unfiltered received order.
12. Given existing stored requests, when the feature is used, then every existing request remains available and its non-priority data is preserved.
13. Given the feature, when run without a login, database, or external service, then priority classification and filtering/sorting work using the app's existing local data.

## Out of Scope

- Login, user accounts, roles, or manager-specific permissions.
- Database or external-service storage.
- Persisting filter or sort selections across page refreshes.
- Deleting, archiving, or editing requests as part of prioritization.
- A manager-facing interface for editing the keyword vocabulary.
- Changing the application's request form or adding new request fields solely for this feature.
