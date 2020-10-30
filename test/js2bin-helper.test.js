/* eslint-disable array-bracket-newline, no-magic-numbers */
"use strict";
const {fetchJson, getJs2binAssetVersion} = require("../modules/js2bin-helper");
const {assert} = require("chai");
const {describe, it} = require("mocha");
const fetch = require("node-fetch");
const sinon = require("sinon");

describe("fetch JSON", () => {
  it("should throw", async () => {
    await fetchJson().catch(e => {
      assert.instanceOf(e, TypeError, "error");
      assert.strictEqual(e.message, "Expected String but got Undefined.");
    });
  });

  it("should throw", async () => {
    const stubFetch = sinon.stub(fetch, "Promise").resolves({});
    await fetchJson("https://example.com").catch(e => {
      assert.instanceOf(e, Error, "error");
      assert.strictEqual(e.message,
                         "Network response was not ok. status: undefined");
    });
    stubFetch.restore();
  });

  it("should throw", async () => {
    const stubFetch = sinon.stub(fetch, "Promise").resolves({
      ok: false,
      status: 404,
    });
    await fetchJson("https://example.com").catch(e => {
      assert.instanceOf(e, Error, "error");
      assert.strictEqual(e.message,
                         "Network response was not ok. status: 404");
    });
    stubFetch.restore();
  });

  it("should get result", async () => {
    const stubFetch = sinon.stub(fetch, "Promise").resolves({
      ok: true,
      status: 200,
      json: () => [],
    });
    const res = await fetchJson("https://example.com");
    stubFetch.restore();
    assert.deepEqual(res, [], "result");
  });
});

describe("get latest asset version of js2bin", () => {
  it("should get null", async () => {
    const stubFetch = sinon.stub(fetch, "Promise").resolves({
      ok: true,
      status: 200,
      json: () => "",
    });
    const res = await getJs2binAssetVersion();
    stubFetch.restore();
    assert.isNull(res, "result");
  });

  it("should get null", async () => {
    const stubFetch = sinon.stub(fetch, "Promise").resolves({
      ok: true,
      status: 200,
      json: () => [],
    });
    const res = await getJs2binAssetVersion();
    stubFetch.restore();
    assert.isNull(res, "result");
  });

  it("should get null", async () => {
    const stubFetch = sinon.stub(fetch, "Promise").resolves({
      ok: true,
      status: 200,
      json: () => [{}],
    });
    const res = await getJs2binAssetVersion();
    stubFetch.restore();
    assert.isNull(res, "result");
  });

  it("should get null", async () => {
    const stubFetch = sinon.stub(fetch, "Promise").resolves({
      ok: true,
      status: 200,
      json: () => [{
        assets: [],
      }],
    });
    const res = await getJs2binAssetVersion();
    stubFetch.restore();
    assert.isNull(res, "result");
  });

  it("should get null", async () => {
    const stubFetch = sinon.stub(fetch, "Promise").resolves({
      ok: true,
      status: 200,
      json: () => [{
        assets: [{}],
      }],
    });
    const res = await getJs2binAssetVersion();
    stubFetch.restore();
    assert.isNull(res, "result");
  });

  it("should get null", async () => {
    const stubFetch = sinon.stub(fetch, "Promise").resolves({
      ok: true,
      status: 200,
      json: () => [{
        assets: [{name: "foo"}, {name: "bar"}],
      }],
    });
    const res = await getJs2binAssetVersion();
    stubFetch.restore();
    assert.isNull(res, "result");
  });

  it("should get null", async () => {
    const stubFetch = sinon.stub(fetch, "Promise").resolves({
      ok: true,
      status: 200,
      json: () => [{
        assets: [
          {name: "v1.0.0-foo"},
          {name: "v1.2.3-bar"},
          {name: "v1.1.1-baz"},
        ],
      }],
    });
    const res = await getJs2binAssetVersion();
    stubFetch.restore();
    assert.strictEqual(res, "1.2.3", "result");
  });
});