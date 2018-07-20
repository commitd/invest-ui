
// // This is very basic, just enough for us in TimelineChart
// // it would need amending in other use cases.
// // This is augmenting the types from @types/victory

// declare module "victory" {
//     import * as React from 'react'

//     export type BrushDomain = { x?: [Date, Date], y?: [Date, Date] }

//     export type VictoryBrushContainerProps = {
//         brushDimension: string,
//         brushDomain?: BrushDomain,
//         onBrushDomainChange(domain: BrushDomain): void,
//         responsive?: boolean
//     }

//     export class VictoryBrushContainer extends React.Component<VictoryBrushContainerProps, {}> { }

//     export class VictoryTooltip extends React.Component<{}, {}> { }
// }