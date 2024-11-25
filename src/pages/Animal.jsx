import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Rating,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { toggleFavorite, setLikeDislike, resetLikeDislike, setRating } from "../components/Slicer";

function Animal() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Redux states
  const favoriteIds = useSelector((state) => state.animalStatus.favoriteIds);
  const likeDislikeStatus = useSelector((state) => state.animalStatus.likeDislikeStatus[id] || {});
  const animalRating = useSelector((state) => state.animalStatus.ratings[id] || 0);

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // Fetch animal with id
  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await fetch(
          `https://api.api-ninjas.com/v1/animals?name=${id}`,
          {
            headers: { "X-Api-Key": "QGa9/6yJnM3A/yQ9AqgKcg==uJtr70xNDaGNjeCr" },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.length > 0) {
          setAnimal(data[0]);
        } else {
          setError("Animal not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  // Handlers for like/dislike, reset, favorite, and rating actions
  const handleLikeDislike = (characteristic, status) => {
    dispatch(setLikeDislike({ animalId: id, characteristic, status }));
  };

  const handleResetLikesDislikes = () => {
    dispatch(resetLikeDislike({ animalId: id }));
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(id));
  };

  const handleRatingChange = (event, newRating) => {
    dispatch(setRating({ animalId: id, rating: newRating }));
  };

  // Filtervy like/dislike/all
  const filteredCharacteristics = Object.entries(animal?.characteristics || {}).filter(([key]) => {
    if (filter === "all") return true;
    return likeDislikeStatus[key] === filter;
  });

  const isFavorite = favoriteIds.includes(id);

  // Loading and error handling
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (!animal) {
    return (
      <Typography variant="h6" color="text.secondary" align="center">
        Animal not found. Please return to the search page.
      </Typography>
    );
  }

  return (
    <Box p={4} maxWidth="800px" mx="auto">
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h4">{animal.name}</Typography>
            <IconButton onClick={handleToggleFavorite}>
              {isFavorite ? (
                <FavoriteIcon color="error" fontSize="large" />
              ) : (
                <FavoriteBorderIcon fontSize="large" />
              )}
            </IconButton>
          </Box>
          <Box mt={2}>
            <Typography variant="h6">Rate this animal:</Typography>
            <Rating
              value={animalRating}
              onChange={handleRatingChange}
              precision={1}
            />
          </Box>
        </CardContent>
      </Card>

      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Filter Characteristics
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <Button variant={filter === "all" ? "contained" : "outlined"} onClick={() => setFilter("all")}>
            All
          </Button>
          <Button variant={filter === "like" ? "contained" : "outlined"} onClick={() => setFilter("like")}>
            Liked
          </Button>
          <Button
            variant={filter === "dislike" ? "contained" : "outlined"}
            onClick={() => setFilter("dislike")}
          >
            Disliked
          </Button>
          <Button
            variant="contained"
            startIcon={<RestartAltIcon />}
            onClick={handleResetLikesDislikes}
          >
            Reset Likes/Dislikes
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" gutterBottom>
        Characteristics
      </Typography>
      <Box component="ul" p={0} m={0} listStyle="none">
        {filteredCharacteristics.map(([key, value]) => (
          <Card key={key} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="body1">
                  <strong>{key.replace(/_/g, " ")}:</strong> {value}
                </Typography>
                <Box>
                  <IconButton
                    onClick={() => handleLikeDislike(key, "like")}
                    color={likeDislikeStatus[key] === "like" ? "primary" : "default"}
                  >
                    <ThumbUpAltIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleLikeDislike(key, "dislike")}
                    color={likeDislikeStatus[key] === "dislike" ? "secondary" : "default"}
                  >
                    <ThumbDownAltIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default Animal;
