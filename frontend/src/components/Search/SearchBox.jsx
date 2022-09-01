import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

const SearchBox = () => {
    const [open, setOpen] = React.useState(false);
    const [companies, setCompanies] = useState([]);

    const loading = open && companies.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            // await sleep(1e3); // For demo purposes.

            if (active) {
                setCompanies([...companies]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
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
    const handleSubmit = (event) => {
        event.preventDefault();
    };
    const saveCompany = () => {
        // event.preventDefault();
        console.log("wo");
    };
    return (
        <form noValidate onSubmit={handleSubmit}>
            <Autocomplete
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                loading={loading}
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
                onClick={saveCompany}
                type="submit"
                sx={{ mt: 2 }}
                variant="contained"
            >
                Submit
            </Button>
        </form>
    );
};

export default SearchBox;
