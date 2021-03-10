// import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { connect, useDispatch, useSelector } from "react-redux";
import { applyToJob } from "../redux/actions/jobsActions";

// import "./App.css";

const Shop = ({}) => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const job =
    useSelector(state => state.jobs.find(_job => _job.id === id)) || {};
  const handleClick = () => dispatch(applyToJob(job.id));
  return (
    <>
      <div id="my-shop">welcome to my shop {job.title}</div>
      <br />
      {!job.applied ? (
        <button onClick={handleClick}>Apply</button>
      ) : (
        <>
          You applied to this!
          <br />
          <br />
        </>
      )}
      <Link href="/shops-map">
        <button>go back</button>
      </Link>
    </>
  );
};

export default Shop;
