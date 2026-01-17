import Skeleton from "@mui/material/Skeleton";

export default function Skeletonshow({ length = 5, height = 50, width = "100%" }) {
  // Create an array with "length" items
  const mappingskeleton = Array.from({ length }, (_, index) => (
    <Skeleton
      key={index}
      variant="rectangular"
      width={width}
      height={height}
      sx={{ marginBottom: 1 }}
    />
  ));

  return <>{mappingskeleton}</>;
}
