const Popup = ({ children, id, router, title }) => {
  const handleClick = e => {
    e.preventDefault();
    router.push(`/shop?id=${id}`);
  };
  return (
    <>
      <div style={{ padding: "10px" }}>
        <strong>
          <div>{title}</div>
        </strong>
        {children}
      </div>
      {/* <button onClick={handleClick}>Details</button> */}
    </>
  );
};

export default Popup;
