# FlexScreen placement

`FlexScreen` selects its placement with boolean props:

```tsx
<FlexScreen foldedToFaceAboveBoard flexCableLength={40} distanceAboveBoard={12} />
<FlexScreen sitsFlatBelowBoard width={30} height={18} />
```

The six canonical props are `sitsFlat`, `sitsFlatBelowBoard`,
`foldedToFaceAboveBoard`, `foldedToFaceBelowBoard`,
`foldedToRightAngleAboveBoard`, and `foldedToRightAngleBelowBoard`.
When placement flags are omitted, the screen sits flat above the board.
If any placement flags are supplied, exactly one must be true.
`foldsAboveBoard` and `foldsBelowBoard` are concise aliases for the face-above
and face-below folds. Repeating an alias with its canonical flag is rejected.
Values must be booleans. The previous `orientation` prop is rejected.

Model strings use bare flags, for example
`flexscreen_w30_h18_flex40_foldedtofaceaboveboard_distance12mm`.
The modelprinter contract resolves all six canonical booleans, strips aliases,
and defaults to `sitsFlat: true`. Model strings reject repeated placement
flags, conflicts, and values on flags. Dimensions, ratios, rotations, and
colors retain their values. The existing cable path and placement geometry
are preserved.
