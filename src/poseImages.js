import prayersData from "./generated/prayers.json";

// Data-driven pose -> image mapping, so the pose PNGs' filenames only need to be known once, by
// the exporter that named them -- not duplicated into a second hand-maintained table here.
const poseAssetUrls = import.meta.glob("./generated/assets/poses/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

const posesById = new Map(prayersData.poses.map((pose) => [pose.id, pose]));

export function poseLabelKey(poseId) {
  return posesById.get(poseId)?.label;
}

export function poseImageUrl(poseId) {
  const info = posesById.get(poseId);
  return info ? poseAssetUrls[`./generated/${info.image}`] : undefined;
}
