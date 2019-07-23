import React from "react"
import renderer from "react-test-renderer"
import StreamThumbnailPicture from "./StreamThumbnailPicture"


it("renders an image", () => {
  const component = renderer.create(<StreamThumbnailPicture src="/test.jpg" alt="TestImage"/>)
  const tree = component.toJSON()

  expect(tree.type, "img")
  expect(tree.props.src, "/test.jpg")
  expect(tree.props.alt, "TestImage")
})

it("renders 404", () => {
    const component = renderer.create(<StreamThumbnailPicture/>)
    const tree = component.toJSON()
    expect(tree.type, "img")
    expect(tree.props.src, "/assets/img/404.png")
    expect(tree.props.alt, "404")
})