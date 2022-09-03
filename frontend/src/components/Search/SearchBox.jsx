import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
const SearchBox = () => {
    const [open, setOpen] = React.useState(false);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState([]);
    let navigate = useNavigate();
    const loading = open && companies.length === 0;

    useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }
        if (active) {
        }
        return () => {
            active = false;
        };
    }, [loading]);

    useEffect(() => {
        if (!open) {
            setCompanies([]);
        }
    }, [open]);
    const handleChange = async (event) => {
        //Fetching Data from api
        const res = await axios.post(
            `http://localhost:3001`,
            { companyName: event.target.value.toLowerCase() },
            {
                headers: {
                    "Content-type": "application/json",
                },
            }
        );
        let companyList = [];
        let matchString = /<.*id="(.*)".*>(.*)<\/div>/;

        for (let i of res.data.split("\n")) {
            //Sanitizing the data like removing html tags and extra tags
            let sanitizedData = i.replace(/(\t\n)|(\n\t)|(\t)/gm, "");

            //Getting the required data from string using regex
            let matchStringWithI = i.match(matchString);
            if (sanitizedData.length > 0) {
                companyList.push({
                    name: matchStringWithI[2],
                    link: matchStringWithI[1],
                });
            }
        }
        setCompanies(companyList);
    };

    //To handle when the submit button is pressed
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(selectedCompany);
        if (selectedCompany) {
            const saveCompany = await axios.post(
                `http://localhost:3001/add-company`,
                {
                    companyName: selectedCompany.name,
                    companyCIN: selectedCompany.link,
                },
                {
                    headers: {
                        "Content-type": "application/json",
                    },
                }
            );
            if (saveCompany.data === "SUCCESS") {
                console.log("inserted Data redirecting to dashboard");
            } else {
                console.log(
                    `Already Present in list ${JSON.stringify(saveCompany)}`
                );
            }
            navigate("/CompanyList");
        }
    };

    //To set the selected company detail from the dropdown
    const saveCompany = (event, value) => {
        if (value) {
            value.link = value.link.split("/")[2];

            setSelectedCompany(value);
        }
    };
    return (
        <>
            <Autocomplete
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                autoHighlight={true}
                loading={loading}
                onChange={saveCompany}
                loadingText="Type company name ..."
                noOptionsText="No company registered with that name"
                getOptionLabel={(companies) => companies.name}
                options={companies}
                renderInput={(params) => (
                    <TextField
                        onChange={handleChange}
                        {...params}
                        label="Search For A Company"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? (
                                        <CircularProgress
                                            color="inherit"
                                            size={20}
                                        />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
            <Button
                onClick={handleSubmit}
                type="submit"
                sx={{ mt: 2, width: "100%" }}
                size="large"
                variant="contained"
            >
                Submit
            </Button>
        </>
    );
};

export default SearchBox;
