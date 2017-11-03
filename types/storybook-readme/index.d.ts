declare module 'storybook-readme' {
    import { RenderFunction } from "@storybook/react"
    export function withReadme(readme: {}, creator: RenderFunction): RenderFunction
    export function withDocs(readme: {}, creator: RenderFunction): RenderFunction
}