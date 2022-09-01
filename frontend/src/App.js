import { Container } from "@mui/material";
import SearchBox from "./components/Search/SearchBox";

function App() {
    const [search, setSearch] = useState(true);
    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <SearchBox />
        </Container>
    );
}

export default App;
