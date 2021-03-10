import React, { useRef, useEffect } from "react";
import { useRouter } from "next/router";

// import "./App.css";

const Shop = ({}) => {
  const router = useRouter();
  const { title } = router.query;

  return <div id="my-shop">welcome to my shop {title}</div>;
};

export default Shop;
