import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";

import { toggleFavorite } from "../components/Slicer";

function Search() {
  const [animalsearch, setAnimalsearch] = useState("");
  const [animalData, setAnimalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState("");

  const dispatch = useDispatch();
  const { favoriteIds, ratings } = useSelector((state) => state.animalStatus);

  const handleFetch = () => {
    setLoading(true);
    setAnimalData(null);

    if (selectedRating) {

      // Filter animals by rating
      const filteredAnimals = Object.entries(ratings)
        .filter(([, rating]) => rating === selectedRating)
        .map(([animalName]) => ({ name: animalName }));
      setAnimalData(filteredAnimals);
      setLoading(false);
    } else if (animalsearch.trim()) {

      // Fetch animals by name
      fetch(`https://api.api-ninjas.com/v1/animals?name=${animalsearch}`, {
        headers: { "X-Api-Key": "QGa9/6yJnM3A/yQ9AqgKcg==uJtr70xNDaGNjeCr" },
      })
        .then((response) => response.json())
        .then((data) => setAnimalData(data))
        .catch((error) => console.error("Error fetching data:", error))
        .finally(() => setLoading(false));
    } else {

      // Fetch all animals with any rating
      const allRatedAnimals = Object.entries(ratings)
        .filter(([, rating]) => rating > 0)
        .map(([animalName]) => ({ name: animalName }));
      setAnimalData(allRatedAnimals);
      setLoading(false);
    }
  };

  const fetchFavorites = () => {
    setLoading(true);
    setAnimalsearch("");
    setSelectedRating("");

    if (favoriteIds.length === 0) {
      alert("No favorite animals to display.");
      setLoading(false);
      return;
    }

    // Fetch favorite animals
    Promise.all(
      favoriteIds.map((id) =>
        fetch(`https://api.api-ninjas.com/v1/animals?name=${id}`, {
          headers: { "X-Api-Key": "QGa9/6yJnM3A/yQ9AqgKcg==uJtr70xNDaGNjeCr" },
        }).then((response) => response.json())
      )
    )
      .then((responses) => setAnimalData(responses.flat()))
      .catch((error) => console.error("Error fetching favorites:", error))
      .finally(() => setLoading(false));
  };

  const handleRatingChange = (event) => {
    setSelectedRating(event.target.value);
    setAnimalsearch("");

    // Fetch animals by rating
    setLoading(true);
    if (event.target.value === "") {
      handleFetch();
    } else {
      const filteredAnimals = Object.entries(ratings)
        .filter(([, rating]) => rating === event.target.value)
        .map(([animalName]) => ({ name: animalName }));
      setAnimalData(filteredAnimals);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search an Animal
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexDirection: { xs: "column", sm: "row" } }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search any animal"
          value={animalsearch}
          onChange={(e) => {
            setAnimalsearch(e.target.value);
            setSelectedRating("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleFetch()}
        />
        <Button variant="contained" onClick={handleFetch}>
          Search
        </Button>
        <Button variant="outlined" onClick={fetchFavorites}>
          Show Favorites
        </Button>
      </Box>

      <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
        <InputLabel id="rating-label">Filter by Rating</InputLabel>
        <Select
          labelId="rating-label"
          value={selectedRating}
          onChange={handleRatingChange}
          label="Filter by Rating"
        >
          {[1, 2, 3, 4, 5].map((rating) => (
            <MenuItem key={rating} value={rating}>
              {rating} Star{rating > 1 ? "s" : ""}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
          <CircularProgress />
        </Box>
      ) : animalData && animalData.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {animalData.slice(0, 10).map((animal) => (
            <Card
              key={animal.name}
              component={Link}
              to={`/animal/${encodeURIComponent(animal.name)}`}
              sx={{
                position: "relative",
                textDecoration: "none",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
              }}
            >
              <IconButton
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(toggleFavorite(animal.name));
                }}
              >
                {favoriteIds.includes(animal.name) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              </IconButton>
              <CardContent>
                <Typography variant="h5">{animal.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Kingdom:</strong> {animal.taxonomy?.kingdom || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Diet:</strong> {animal.characteristics?.diet || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Family:</strong> {animal.taxonomy?.family || "N/A"}
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      color={ratings[animal.name] > index ? "primary" : "disabled"}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          {animalData && animalData.length === 0 ? "No results found for the selected rating." : "No data"}
        </Typography>
      )}
    </Box>
  );
}

export default Search;
