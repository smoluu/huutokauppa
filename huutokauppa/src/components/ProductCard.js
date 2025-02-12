import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";

const ProductCard = ({ title, description, image, productID }) => {
    const HandleClick = ((id) => {
        
    })
  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: 400, width: 250 }}>
      <CardMedia
        component="img"
        image={image} // The image URL passed as prop
        alt={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h7" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <Button
        sx={{ marginTop: "auto" }}
        size="small"
        color="primary"
        variant="contained"
        onClick={HandleClick(productID)}
      >
        Huuda
      </Button>
    </Card>
  );
};

export default ProductCard;
