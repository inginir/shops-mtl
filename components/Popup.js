const Popup = ({ children, id, router }) => {
  const handleClick = e => {
    e.preventDefault();
    router.push(`/shop?id=${id}`);
  };
  return (
    <>
      <div style={{ padding: "10px" }}>{children}</div>
      <button onClick={handleClick}>Details</button>
    </>
  );
};

export default Popup;
