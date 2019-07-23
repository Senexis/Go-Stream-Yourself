import React from "react"
import renderer from "react-test-renderer"
import TransparentPersonThumbnail from "./TransparentPersonThumbnail"
import { BrowserRouter } from "react-router-dom"

const item = {
    _id: "23id",
    Avatar: "/test/image.jpg",
    Slogan: "I'm blue",
    Transparent: true,
    Name: "Timo Viveen"

}
it("renders personthumbnail", () => {
  const component = renderer.create(<BrowserRouter><TransparentPersonThumbnail person={item}/></BrowserRouter>)
  const tree = component.toJSON()
  expect(tree.type, "a")
  const outerDiv = tree.children[0]
  expect(outerDiv, "div")
  const image = outerDiv.children[0]
  expect(image.props.className, "card-image")

  const imgelement = image.children[0]
  expect(imgelement.props.src, "/test/image.jpg")
  expect(imgelement.props.alt, "Timo Viveen's avatar")

  const content = outerDiv.children[1]
  expect(content.props.className, "card-content")

  const pelement = content.children[0]
  expect(pelement.children[0], "Timo Viveen")
})