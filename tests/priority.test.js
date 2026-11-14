import assert from "node:assert/strict";
import test from "node:test";

import {
  filterRequestsByPriority,
  getRequestPriority,
  sortRequestsByPriority,
} from "../src/request-store.js";

function request(id, equipment, reason = "Routine work.") {
  return {
    id,
    requester: "Requester " + id,
    department: "Operations",
    equipment,
    neededBy: "2026-09-15",
    reason,
    createdAt: "2026-08-17T12:00:00.000Z",
  };
}

test("classifies each configured High keyword as High", async (t) => {
  for (const keyword of ["urgent", "critical", "emergency"]) {
    await t.test(keyword, () => {
      assert.equal(getRequestPriority(request("1", "Laptop", "Need it " + keyword + ".")), "High");
    });
  }
});

test("classifies important as Medium when no High keyword matches", () => {
  assert.equal(getRequestPriority(request("1", "Laptop", "Important for the project.")), "Medium");
});

test("High takes precedence when a request also contains important", () => {
  assert.equal(
    getRequestPriority(request("1", "Urgent laptop", "This is important.")),
    "High",
  );
});

test("assigns Low when no High or Medium keyword matches", () => {
  assert.equal(getRequestPriority(request("1", "Laptop", "Routine replacement.")), "Low");
});

test("matches configured keywords without regard to capitalization", () => {
  assert.equal(getRequestPriority(request("1", "Laptop", "EMERGENCY repair needed.")), "High");
  assert.equal(getRequestPriority(request("2", "Laptop", "IMPORTANT for onboarding.")), "Medium");
});

test("does not match a configured keyword embedded in a longer word", () => {
  assert.equal(getRequestPriority(request("1", "Laptop", "This is importantance.")), "Low");
  assert.equal(getRequestPriority(request("2", "Laptop", "Noncritical maintenance.")), "Low");
});

test("priority sorting orders High, Medium, Low and preserves received order within each group", () => {
  const requests = [
    request("1", "Laptop", "Routine replacement."),
    request("2", "Projector", "Important for training."),
    request("3", "Dock", "Urgent repair."),
    request("4", "Keyboard", "Critical failure."),
    request("5", "Monitor", "Emergency replacement."),
    request("6", "Headset", "Important for onboarding."),
  ];

  const sorted = sortRequestsByPriority(requests);

  assert.deepEqual(sorted.map(({ id }) => id), ["3", "4", "5", "2", "6", "1"]);
  assert.deepEqual(requests.map(({ id }) => id), ["1", "2", "3", "4", "5", "6"]);
});

test("priority filtering shows only the selected level and all restores the full list", () => {
  const requests = [
    request("1", "Laptop", "Routine replacement."),
    request("2", "Projector", "Important for training."),
    request("3", "Dock", "Urgent repair."),
  ];

  assert.deepEqual(filterRequestsByPriority(requests, "High").map(({ id }) => id), ["3"]);
  const allRequests = filterRequestsByPriority(requests, "all");
  assert.deepEqual(allRequests.map(({ id }) => id), ["1", "2", "3"]);
  assert.notEqual(allRequests, requests);
});

test("priority views preserve existing request data", () => {
  const existing = request("1", "Laptop", "Emergency replacement.");
  const before = JSON.stringify(existing);

  filterRequestsByPriority([existing], "High");
  sortRequestsByPriority([existing]);

  assert.equal(JSON.stringify(existing), before);
});
