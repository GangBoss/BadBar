import { List, ListItem, ListItemText, Typography, Accordion, AccordionSummary, AccordionDetails, Box, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Ingredient {
  name: string;
  amount: string;
}

interface Cocktail {
  id?: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  image: string;
}

interface CocktailListProps {
  cocktails: Cocktail[];
}

const CocktailList: React.FC<CocktailListProps> = ({ cocktails }) => {
  console.log('Rendering CocktailList with cocktails:', cocktails);
  return (
    <List>
      {cocktails.length === 0 ? (
        <Typography variant="body1">Список рецептов пуст. Добавьте новый рецепт!</Typography>
      ) : (
        cocktails.map((cocktail, index) => (
          <ListItem key={index}>
            <Accordion sx={{ width: '100%' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{cocktail.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle1">Ингредиенты:</Typography>
                    <List>
                      {cocktail.ingredients.map((ingredient, idx) => (
                        <ListItem key={idx}>
                          <ListItemText primary={`${ingredient.name} - ${ingredient.amount}`} />
                        </ListItem>
                      ))}
                    </List>
                    <Typography variant="subtitle1">Инструкции:</Typography>
                    <Typography variant="body1">{cocktail.instructions}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {cocktail.image && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <img src={cocktail.image} alt={cocktail.name} style={{ maxWidth: '100%', maxHeight: '200px' }} />
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </ListItem>
        ))
      )}
    </List>
  );
};

export default CocktailList;