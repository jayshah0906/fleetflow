import React from "react";
import "../../styles/registry.css";

function Pagination() {
  return (
    <div className="pagination">
      <button disabled>Previous</button>
      <button className="active">1</button>
      <button>2</button>
      <button>Next</button>
    </div>
  );
}

export default Pagination;
