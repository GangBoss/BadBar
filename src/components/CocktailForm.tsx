import { useState, useRef } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Input,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface Ingredient {
  name: string;
  amount: string;
}

interface CocktailFormProps {
  onSubmit: (cocktail: { name: string; ingredients: Ingredient[]; instructions: string; image: string }) => void;
}

const CocktailForm: React.FC<CocktailFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient>({ name: '', amount: '' });
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddIngredient = () => {
    if (currentIngredient.name && currentIngredient.amount) {
      setIngredients([...ingredients, currentIngredient]);
      setCurrentIngredient({ name: '', amount: '' });
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, ingredients, instructions, image });
    setName('');
    setIngredients([]);
    setCurrentIngredient({ name: '', amount: '' });
    setInstructions('');
    setImage('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, position: 'relative' }}>
      <Typography variant="h4" gutterBottom>
        Добавить новый коктейль
      </Typography>
      <Input
        type="file"
        inputRef={fileInputRef}
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        inputProps={{ accept: 'image/*' }}
      />
      <IconButton
        onClick={() => fileInputRef.current?.click()}
        sx={{ position: 'absolute', top: 0, right: 0 }}
      >
        <AddPhotoAlternateIcon />
      </IconButton>
      {image && (
        <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <img src={image} alt="Превью коктейля" style={{ maxWidth: '100%', maxHeight: '200px' }} />
        </Box>
      )}
      <TextField
        fullWidth
        label="Название коктейля"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        required
      />
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Ингредиент"
          value={currentIngredient.name}
          onChange={(e) => setCurrentIngredient({ ...currentIngredient, name: e.target.value })}
        />
        <TextField
          label="Количество"
          value={currentIngredient.amount}
          onChange={(e) => setCurrentIngredient({ ...currentIngredient, amount: e.target.value })}
        />
        <Button variant="contained" onClick={handleAddIngredient}>
          Добавить
        </Button>
      </Box>
      <List>
        {ingredients.map((ingredient, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveIngredient(index)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={`${ingredient.name} - ${ingredient.amount}`} />
          </ListItem>
        ))}
      </List>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Инструкции по приготовлению"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Добавить коктейль
      </Button>
    </Box>
  );
};

export default CocktailForm;