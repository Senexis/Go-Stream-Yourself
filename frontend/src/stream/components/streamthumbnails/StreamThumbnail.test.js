import configureStore from "redux-mock-store"
import React from "react"
import renderer from "react-test-renderer"
import StreamThumbnail from "./StreamThumbnail"

const initialState = {}
const mockStream = {
    Date: new Date(),
    Live: true,
    User: {
        Avatar: "/test.jpg",
        Name: "Maarten van der Heijden",
        Transparent: true,
        Slogan: "Maarten is cool!",
    },
    Viewers: 0
}
describe("StreamThumbnail gets rendered properly with props", () => {
    let store = configureStore()

    beforeEach(() => {
        store = store(initialState)
    })
    it("renders a thumbnail with data properly", () => {
        const component = renderer.create(<StreamThumbnail store={store} stream={mockStream}/>)
        const tree = component.toJSON()
        expect(tree.type, "div")
        const content = tree.children[1].children
        expect(content[0].children[0], "Maarten van der Heijden")
        expect(content[1].children[0], "Maarten is cool!")
        expect(content[2].children[0], "0 followers")
    })
})