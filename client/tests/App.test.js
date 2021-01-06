import { shallow, render } from "enzyme";
import React from "react";
import renderer from "react-test-renderer";
import Layout from "../pages/index.js";
import Grid from "../pages/index.js";
import Card from "../components/card.js";
import AddTranslation from "../pages/translations/add.js";

describe("With Snapshot Testing", () => {
  test('App shows "Welcome to Equi Translation App"', () => {
    const component = renderer.create(<Layout />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Testing with Enzyme", () => {
  test('App shows "Welcome to Equi Translation App" H1', () => {
    const app = render(<Layout />);
    expect(app.find("h2").text()).toEqual("Welcome to Equi Translation App");
  });

  // Link to all translations is rendered
  test('App shows "View translations" link H3', () => {
    const app = shallow(<Grid />);
    expect(app.find(Card).at(0).render().find("h3").text()).toEqual("View translations →");
  });

  // Link to add translation is rendered
  test('App shows "Add translation" link H3', () => {
    const app = shallow(<Grid />);
    expect(app.find(Card).at(1).render().find("h3").text()).toEqual("Add new →");
  });

  // Add new translation page is rendered
  test('Page to add translation shows "Add Translation" H1', () => {
    const app = render(<AddTranslation />);
    expect(app.find("h1").text()).toEqual("Add Translation");
  });

  
});

