import App from "./app";
import React from "react";
import { mount } from "enzyme";

test("App renders the welcome test inside", () => {
  const wrapper = mount(<App />);
  const div = wrapper.find("div");
  expect(div.text()).toBe("Welcome Electron + React Adventurer");
});
