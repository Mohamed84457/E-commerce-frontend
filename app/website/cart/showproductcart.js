"use client";
import Badge from "@mui/material/Badge";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import Link from "next/link";
// context

export default function Showproductcart({ pro, removeFromCart }) {
  // calculate final price
  const finalPrice = pro.discount
    ? (pro.price - (pro.price * pro.discount) / 100).toFixed(2)
    : pro.price;

  return (
    <Badge
      badgeContent={pro.Amount}
      color="secondary"
      overlap="circular"
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        "& .MuiBadge-badge": {
          fontWeight: "bold",
          fontSize: "0.75rem",
          minWidth: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: "#ff1744", // vibrant e-commerce red
          color: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        },
        "&:hover .MuiBadge-badge": {
          transform: "scale(1.2)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        },
      }}
    >
      <Card
        sx={{
          maxWidth: 320,
          margin: 2,
          borderRadius: 4,
          backgroundColor: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transition: "all 0.25s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Product image */}
        {pro.image && (
          <CardMedia
            component="img"
            height="200"
            image={pro.image}
            alt={pro.title}
            sx={{
              objectFit: "cover",
              borderRadius: "16px 16px 0 0",
            }}
          />
        )}

        <CardContent sx={{ p: 2 }}>
          {/* Title */}
          <Link
            href={`/website/products/${pro.id}`}
            style={{ textDecoration: "none" }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                lineHeight: 1.3,
                minHeight: "2.6rem",
                cursor: "pointer",
                color: "text.primary",
                transition: "color 0.3s ease, text-decoration 0.3s ease",

                "&:hover": {
                  color: "primary.main",
                  textDecoration: "underline",
                },
              }}
            >
              {pro.title}
            </Typography>
          </Link>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {pro.description}
          </Typography>

          {/* About */}
          {pro.about && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontStyle: "italic" }}
            >
              {pro.about}
            </Typography>
          )}

          {/* Prices */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            {pro.discount ? (
              <>
                <Typography
                  variant="body2"
                  color="text.disabled"
                  sx={{ textDecoration: "line-through" }}
                >
                  ${pro.price}
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  ${finalPrice}
                </Typography>
                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{ fontWeight: "bold" }}
                >
                  {pro.discount}% OFF
                </Typography>
              </>
            ) : (
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                ${pro.price}
              </Typography>
            )}
          </Box>

          {/* Rating */}
          <Typography variant="body2" sx={{ color: "warning.main", mb: 1 }}>
            ⭐ {pro.rating}
          </Typography>

          {/* Button */}
          <Button
            onClick={() => {
              removeFromCart(pro.id);
            }}
            variant="contained"
            color="error"
            fullWidth
            sx={{
              mt: 1,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: "bold",
              py: 1,
            }}
          >
            Remove from Cart
          </Button>
        </CardContent>
      </Card>
    </Badge>
  );
}
