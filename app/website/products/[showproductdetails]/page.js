"use client";
// mui
import ImageGallery from "react-image-gallery";
import Skeletonshow from "../../skeleton/skeleton";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
// component
import RadioGroupRating from "../../componets/userexperience";
// icons
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { use, useEffect, useState } from "react";
import axios from "axios";
import styles from "../productpage.module.css";
import { NEXT_PUBLIC_API_URL } from "@/app/publicurl/URLbase";
// context
import { useFeedbackweb } from "../../feedback/page";
import { useCartitemsnumber } from "../../context/cartitemsnumber";

export default function Showproductdetails({ params }) {
  // change number of cart
  const { changenumberitemsofcart } = useCartitemsnumber();
  // feedbak
  const { showSnackbar } = useFeedbackweb();
  // amount of stack
  const [amount, setamount] = useState(0);
  const [loading, setloading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [productdata, setproductdata] = useState({
    id: "",
    title: "",
    description: "",
    price: "",
    discount: "",
    About: "",
    rating: "",
    category: "",
    stock: 0,
  });
  const [productimages, setproductimages] = useState([]);
  const { showproductdetails } = use(params);

  useEffect(() => {
    const controller = new AbortController(); // Create a controller

    async function getproductdata() {
      setloading(true);
      try {
        const res = await axios.get(
          `${NEXT_PUBLIC_API_URL}/api/product/${showproductdetails}`,
          { signal: controller.signal } // attach signal
        );
        const prodata = res.data[0];
        setproductdata({
          id: prodata.id,
          title: prodata.title,
          description: prodata.description,
          price: prodata.price,
          discount: prodata.discount,
          About: prodata.About,
          rating: prodata.rating,
          category: prodata.category,
          stock: Number(prodata.stock),
        });

        const mappingimages =
          prodata.images?.map((i) => ({
            original: i.image,
            thumbnail: i.image,
          })) || [];

        setproductimages(mappingimages);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error(err);
        }
      } finally {
        setloading(false);
      }
    }

    getproductdata();

    // ✅ Cleanup function
    return () => {
      controller.abort(); // Cancel any ongoing request
    };
  }, [showproductdetails]);

  //add product to cart
  function handeladdtocart() {
    if (amount > 0) {
      const precartdata = JSON.parse(localStorage.getItem("DMTcart")) || [];
      console.log(precartdata);
      // new product
      const newproducttocart = {
        id: productdata.id,
        title: productdata.title,
        category: productdata.category,
        description: productdata.description,
        About: productdata.About,
        price: productdata.price,
        discount: productdata.discount,
        Amount: amount,
        rating: productdata.rating,
      };
      // get the id if product exist
      const existingProductIndex = precartdata.findIndex((i) => {
        return i.id === productdata.id;
      });
      // if product found  ,then add amount to already exist amount
      if (existingProductIndex !== -1) {
        precartdata[existingProductIndex].Amount += amount;
      } else {
        precartdata.push(newproducttocart);
        changenumberitemsofcart(Number(precartdata.length));
      }

      // const allproducts = [...precartdata ,newproducttocart];
      localStorage.setItem("DMTcart", JSON.stringify(precartdata));
      showSnackbar("product add to cart", "5000");
    } else {
      showSnackbar("product sold out", "5000", "error");
    }
  }

  const style = {
    button: {
      transform: isActive && amount > 0 ? "scale(0.97)" : "scale(1)",
      background: amount > 0 ? "#2563eb" : "#a2a0a0ff",
      width: "100%",
    },
  };
  return (
    <div className={styles.pageContainer}>
      {/* Gallery */}
      {loading ? (
        <div className={styles.galleryWrapper}>
          <Skeletonshow length={1} height={390} width={390} />
        </div>
      ) : (
        <div className="gallery-zoom" style={{ overflow: "hidden" }}>
          <ImageGallery
            lazyLoad
            items={productimages}
            renderItem={(item) => (
              <img
                src={item.original}
                alt={item.originalAlt}
                style={{
                  transition: "transform 0.3s ease",
                  width: "100%",
                  height: "auto",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            )}
          />
        </div>
      )}

      {/* Details */}
      {loading ? (
        <div className={styles.detailsWrapper}>
          <Skeletonshow length={4} height={60} width={"100%"} />
        </div>
      ) : (
        <div className={styles.detailsWrapper}>
          {/* Info */}
          <div className={styles.productInfo}>
            <h1 className={styles.productTitle}>{productdata.title}</h1>
            <p className={styles.productDescription}>
              {productdata.description}
            </p>
            <h3 className={styles.productAbout}>{productdata.About}</h3>
          </div>
          <hr />
          {/* Pricing */}
          <div className={styles.productPricing}>
            <Rating
              value={Number(productdata.rating) || 0}
              precision={0.5}
              readOnly
            />
            <p className={styles.oldPrice}>${productdata.price}</p>
            <h4 className={styles.finalPrice}>
              ${" "}
              {(productdata.discount > 0
                ? (
                    productdata.price -
                    productdata.price * (productdata.discount / 100)
                  ).toFixed(2)
                : productdata.price
              ).toString()}
            </h4>
          </div>
          {/* Add to Cart */}
          {/* Amount selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "12px 0",
            }}
          >
            <Button
              onClick={() =>
                amount < productdata.stock && setamount(amount + 1)
              }
              disabled={amount >= productdata.stock}
              variant="contained"
              color="success"
              size="small"
            >
              <AddIcon />
            </Button>

            <TextField
              value={amount}
              onChange={(e) => {
                let val = Number(e.target.value);
                if (isNaN(val) || val < 0) val = 0;
                if (val > productdata.stock) {
                  val = productdata.stock;
                  showSnackbar("Stock max reached", 3000, "error");
                }
                setamount(val);
              }}
              label="Amount"
              variant="outlined"
              size="small"
              type="number"
              inputProps={{ min: 0, max: productdata.stock }}
              sx={{
                width: "80px",
                "& input": {
                  textAlign: "center",
                },
              }}
            />

            <Button
              onClick={() => amount > 0 && setamount(amount - 1)}
              disabled={amount <= 0}
              variant="contained"
              color="error"
              size="small"
            >
              <RemoveIcon />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handeladdtocart}
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            disabled={amount < 1 || productdata.stock === 0}
            sx={{
              width: "100%",
              py: 1.2,
              mt: 1,
              fontWeight: "bold",
              backgroundColor: amount > 0 ? "#2563eb" : "#a2a0a0ff",
              "&:hover": {
                backgroundColor: amount > 0 ? "#1d4ed8" : "#a2a0a0ff",
              },
              transform: isActive && amount > 0 ? "scale(0.97)" : "scale(1)",
              transition: "all 0.2s ease-in-out",
              borderRadius: 2,
              boxShadow: amount > 0 ? "0 4px 12px rgba(37,99,235,0.4)" : "none",
            }}
            onMouseDown={() => setIsActive(true)}
            onMouseUp={() => setIsActive(false)}
            onMouseLeave={() => setIsActive(false)}
          >
            Add to Cart
          </Button>

          {productdata.stock === 0 && (
            <h2 style={{ color: "#e41919ff", textAlign: "center" }}>
              Sold out
            </h2>
          )}
          {productdata.stock > 0 && productdata.stock <= 5 && (
            <h4 style={{ color: "#ff6b6b", textAlign: "center" }}>
              Only {productdata.stock} left!
            </h4>
          )}
          <div>
            <h3 style={{margin:"10px 0px"}}>give us your react</h3>
            <RadioGroupRating />
          </div>
        </div>
      )}
    </div>
  );
}
