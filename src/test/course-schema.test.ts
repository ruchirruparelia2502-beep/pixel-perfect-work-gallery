import { describe, expect, it } from "vitest";
import { normalizeCourse } from "@/lib/course-schema";

describe("normalizeCourse", () => {
  it("drops outcomes without a statement and numbers missing codes", () => {
    const c = normalizeCourse({ outcomes: [{ statement: "Explain X" }, { code: "CO9", statement: "" }] });
    expect(c.outcomes).toEqual([{ code: "CO1", statement: "Explain X", bloom: "" }]);
  });
  it("falls back to an untitled course when the AI returns junk", () => {
    expect(normalizeCourse("nope").title).toBe("Untitled course");
  });
});
