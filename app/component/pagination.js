// mui
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import ReactPaginate from "react-paginate";
import styles from "../home/paginate.module.css";

export default function PaginatedItems({
  itemsPerPage,
  datalength,
  changepage,
  limit,
  changelimit,
  currentpage
}) {
  const pagescount = datalength / itemsPerPage;

  return (
    <div
      style={{
        width: "70%",
        position: "fixed",
        bottom: "10px",
        right: "10px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <>
        <FormControl sx={{ width: "20%" }} size="small">
          <InputLabel>limit</InputLabel>
          <Select
            label="category"
            value={limit}
            onChange={(e) => {
              changelimit(e.target.value);
            }}
          >
            <MenuItem disabled value={""}>
              select limit
            </MenuItem>
            <MenuItem value={"5"}>5</MenuItem>
            <MenuItem value={"10"}>10</MenuItem>
            <MenuItem value={"15"}>15</MenuItem>
          </Select>
        </FormControl>
      </>

      <>
        <ReactPaginate
          breakLabel="..."
          nextLabel=" >>"
          onPageChange={(e) => {
            changepage(e.selected + 1); // convert 0-index to 1-index
          }}
          pageRangeDisplayed={2}
          pageCount={Math.ceil(pagescount)} // safer than raw division
          previousLabel="<< "
          renderOnZeroPageCount={null}
          containerClassName={styles.list_pagination}
          pageLinkClassName={styles.link_pagination}
          activeClassName={styles.activelink_pagination}
          forcePage={currentpage - 1} // 👈 sync with parent (convert back to 0-index)
        />
      </>
    </div>
  );
}
