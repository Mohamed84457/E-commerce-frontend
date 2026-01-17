"use client";

import { Card, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function CategoryCard({ id, title, image }) {
  return (
    <Card
      sx={{
        width: 220,
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        cursor: "pointer",
        position: "relative",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px) scale(1.03)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Image container with overlay */}
      <Link href={`/home/categories/${id}`}>
        <div style={{ position: "relative", height: "160px" }}>
          <img
            src={image}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            loading="lazy"
          />

          {/* Overlay effect on hover */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))",
            }}
          />
        </div>
      </Link>
      {/* Title */}
      <CardContent sx={{ textAlign: "center", p: 2 }}>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}
