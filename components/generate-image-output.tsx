// if (part.type === "tool-generateImage") {
//     const { toolCallId, state } = part;

//     if (state === "input-streaming") {
//       const { input } = part;
//       return <div key={toolCallId}>t</div>;
//     }

//     if (state === "input-available") {
//       const { input } = part;
//       return <div key={toolCallId}>tt</div>;
//     }

//     if (state === "output-available") {
//       const { input, output } = part;
//       return (
//         <div key={toolCallId}>
//           {/* <pre>{JSON.stringify(output.parts, null, 2)}</pre> */}
//           ttt
//           <img
//             src={output.parts[0].data.payload.image}
//             alt="Generated Image"
//             className="h-full w-full rounded-lg"
//           />
//           <Button
//             onClick={() => {
//               // Add asset and item to state
//               setState({
//                 update: (state) => {
//                   const withItem = addItem({
//                     state,
//                     item: {
//                       type: "image",
//                       assetId:
//                         output.parts[0].data.payload.assetId,
//                       durationInFrames: 100,
//                       from: 0,
//                       top: 0,
//                       left: 0,
//                       width: 1024,
//                       height: 1024,
//                       isDraggingInTimeline: false,
//                       id: output.parts[0].data.payload
//                         .assetId, // data.id || "1",
//                       opacity: 1,
//                       borderRadius: 0,
//                       rotation: 0,
//                       keepAspectRatio: true,
//                       fadeInDurationInSeconds: 0,
//                       fadeOutDurationInSeconds: 0,
//                     },
//                     select: true,
//                     position: { type: "front" },
//                   });
//                   const withAsset = addAssetToState({
//                     state: withItem,
//                     asset: {
//                       id: output.parts[0].data.payload
//                         .assetId,
//                       type: "image",
//                       filename: "generatxed.png",
//                       width: 1024,
//                       height: 1024,
//                       size: 13213,
//                       remoteUrl:
//                         output.parts[0].data.payload.image,
//                       remoteFileKey:
//                         output.parts[0].data.payload.assetId,
//                       mimeType: "image/png",
//                     },
//                   });
//                   return {
//                     ...withAsset,
//                     assetStatus: {
//                       ...state.assetStatus,
//                       [output.parts[0].data.payload.assetId]:
//                         {
//                           type: "uploaded",
//                         },
//                     },
//                   };
//                 },
//                 commitToUndoStack: true,
//               });
//             }}
//           >
//             Add {output.parts[0].data.payload.assetId}
//           </Button>
//         </div>
//       );
//     }

//     if (state === "output-error") {
//       const { errorText } = part;
//       return (
//         <div key={toolCallId}>
//           <div className="rounded-3xl border p-2 px-4 text-red-500">
//             {/* <pre>{JSON.stringify(errorText, null, 2)}</pre> */}
//             Something went wrong. Try again.
//           </div>
//         </div>
//       );
//     }
//   }
