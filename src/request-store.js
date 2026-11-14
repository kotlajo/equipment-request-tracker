export const STORAGE_KEY = "mis4173-equipment-requests";

export const PRIORITIES = Object.freeze({
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
});

const PRIORITY_KEYWORDS = Object.freeze({
  [PRIORITIES.HIGH]: ["urgent", "critical", "emergency"],
  [PRIORITIES.MEDIUM]: ["important"],
});

export class RequestValidationError extends Error {
  constructor(errors) {
    super("The equipment request is incomplete.");
    this.name = "RequestValidationError";
    this.errors = errors;
  }
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateRequest(input = {}) {
  const errors = {};

  if (!clean(input.requester)) errors.requester = "Enter the requester name.";
  if (!clean(input.department)) errors.department = "Select a department.";
  if (!clean(input.equipment)) errors.equipment = "Enter the equipment needed.";
  if (!clean(input.neededBy)) errors.neededBy = "Select the date needed.";
  if (!clean(input.reason)) errors.reason = "Enter a business reason.";

  return errors;
}

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return "request-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

export function createRequest(input, options = {}) {
  const errors = validateRequest(input);
  if (Object.keys(errors).length > 0) {
    throw new RequestValidationError(errors);
  }

  const now = options.now ?? new Date();

  return {
    id: options.id ?? createId(),
    requester: clean(input.requester),
    department: clean(input.department),
    equipment: clean(input.equipment),
    neededBy: clean(input.neededBy),
    reason: clean(input.reason),
    createdAt: now.toISOString(),
  };
}

export function appendRequest(requests, request) {
  return [request, ...requests];
}

export function getRequestPriority(request) {
  const text = [request.equipment, request.reason]
    .filter((value) => typeof value === "string")
    .join(" ");

  for (const priority of [PRIORITIES.HIGH, PRIORITIES.MEDIUM]) {
    if (PRIORITY_KEYWORDS[priority].some((keyword) => containsKeyword(text, keyword))) {
      return priority;
    }
  }

  return PRIORITIES.LOW;
}

export function filterRequestsByPriority(requests, priority = "all") {
  if (priority === "all") return [...requests];
  return requests.filter((request) => getRequestPriority(request) === priority);
}

export function sortRequestsByPriority(requests) {
  const priorityOrder = new Map([
    [PRIORITIES.HIGH, 0],
    [PRIORITIES.MEDIUM, 1],
    [PRIORITIES.LOW, 2],
  ]);

  return requests
    .map((request, index) => ({ request, index }))
    .sort((left, right) => {
      const difference =
        priorityOrder.get(getRequestPriority(left.request)) -
        priorityOrder.get(getRequestPriority(right.request));
      return difference || left.index - right.index;
    })
    .map(({ request }) => request);
}

function containsKeyword(text, keyword) {
  const words = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  return words.includes(keyword.toLowerCase());
}

export function loadRequests(storage = globalThis.localStorage) {
  if (!storage) return [];

  try {
    const stored = storage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isRequestRecord) : [];
  } catch {
    return [];
  }
}

export function saveRequests(requests, storage = globalThis.localStorage) {
  if (!storage) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

function isRequestRecord(value) {
  return (
    value &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.requester === "string" &&
    typeof value.department === "string" &&
    typeof value.equipment === "string" &&
    typeof value.neededBy === "string" &&
    typeof value.reason === "string" &&
    typeof value.createdAt === "string"
  );
}
