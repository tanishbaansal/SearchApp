import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { Container } from "@mui/system";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";

//Adding Styling to the Table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.action.hover,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

//Function to sort the data
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility,
// So that sorting will be stable on every Browser
// even if its Internet explorer sorting will work fine
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// Table Heads Data
const headCells = [
    {
        id: "cin",
        numeric: false,
        disablePadding: true,
        label: "CIN",
    },
    {
        id: "name",
        numeric: false,
        disablePadding: false,
        label: "Name",
    },
];

// Function to create Table Heads
function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <StyledTableCell
                        sx={{ px: 2, minWidth: "200px" }}
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc"
                                        ? "sorted descending"
                                        : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// Adding Extra PropTypes to table header
EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

// Updating the label text in the footer of the table for
// counting of rows in table
function LabelDisplayedRows({ from, to, count }) {
    return `Showing ${from} to ${to} of ${
        count !== -1 ? count : `more than ${to}`
    }`;
}

// The Main Rendering Function
function CompanyList() {
    const [rows, setRows] = useState([]);

    // Fetching the data from DB using backend
    useEffect(() => {
        const fetchData = async () => {
            let result = await axios.get(`http://localhost:3001/get-companies`);
            setRows(result.data);
        };

        fetchData();
    }, []);

    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name"); // Default order by name of the company
    const [page, setPage] = useState(0); // Setting pages
    const [rowsPerPage, setRowsPerPage] = useState(5); //setting total number of rows to 5 per page

    // Setting how to sort the data, asc or desc
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    //Handling the change of page
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Function to update total no. of rows per page when button clicked
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoiding a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Container sx={{ my: 3 }}>
            <Link to="/" style={{ textDecoration: "none" }}>
                {/* Button To add new company to the DB */}
                <Button
                    type="submit"
                    sx={{ my: 2 }}
                    size="large"
                    variant="contained"
                >
                    Company <AddIcon />
                </Button>
            </Link>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 150 }}
                        aria-labelledby="tableTitle"
                        size={"medium"}
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={row.cin}
                                        >
                                            <TableCell
                                                sx={{ px: 2 }}
                                                component="th"
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.cin}
                                            </TableCell>
                                            <TableCell>{row.name}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Adding a pagination at the end of table */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    labelDisplayedRows={LabelDisplayedRows}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Container>
    );
}

export default CompanyList;
