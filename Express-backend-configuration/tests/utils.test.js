const utils = require("../lib/utils");

describe("valid and invalid password", () => {
  test("valid password is accepted", () => {
    expect(utils.genPassword("123").hash).toBeDefined();
    expect(utils.genPassword("123").salt).toBeDefined();

    const saltAndHash = utils.genPassword("123");

    expect(utils.validPassword("123", saltAndHash.hash, saltAndHash.salt)).toBe(
      true
    );
  });
  test("invalid password is rejected", () => {
    expect(utils.genPassword("123").hash).toBeDefined();
    expect(utils.genPassword("123").salt).toBeDefined();

    const saltAndHash = utils.genPassword("123");
    expect(utils.validPassword("124", saltAndHash.hash, saltAndHash.salt)).toBe(
      false
    );
  });
});
