"use client";

import { useEffect, useState } from "react";
// components
import BodyCommerce from "./componets/bodycommerce";
import Latestsales from "./componets/latestsales";
import Recommends from "./componets/recommends";
import FlashDeals from "./componets/flashDeals";
import Skeletonshow from "./skeleton/skeleton";
import Toprating from "./componets/toprated";
import Adproduct from "./componets/adproduct";
import Footer from "./componets/footer";

import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "../publicurl/URLbase";
export default function Website() {
  const [loading, setloadig] = useState(false);
  // categories
  const [Categoriescommerce, setcategoriescommerce] = useState([]);
  // get categories
  useEffect(() => {
    setloadig(true);
    const controller = new AbortController();

    axios
      .get(`${NEXT_PUBLIC_API_URL}/api/categories`, {
        params: { limit: 5 },
        signal: controller.signal,
        timeout: 10000, // 10 seconds
      })
      .then((res) => setcategoriescommerce(res.data.data))
      .catch((err) => {
        if (axios.isCancel(err)) console.log("Request canceled");
        else console.error(err);
      })
      .finally(() => setloadig(false));

    return () => controller.abort(); // ✅ cleanup on unmount
  }, []);

  return (
    <div>
      {loading ? (
        <Skeletonshow length={5} height={120} width={"100%"} />
      ) : (
        <BodyCommerce categories={Categoriescommerce} />
      )}
      <div>
        <Latestsales />
      </div>
      <div>
        <Adproduct />
      </div>
      <div>
        <Toprating />
      </div>
      <div>
        <Recommends />
      </div>
      <div>
        <FlashDeals />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
