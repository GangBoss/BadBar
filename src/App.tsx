import { useState, useEffect } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Snackbar, Tabs, Tab, Box, Button } from '@mui/material';
import CocktailForm from './components/CocktailForm';
import CocktailList from './components/CocktailList';
import { auth, db } from './firebase/config';
import { signInAnonymously, User } from 'firebase/auth';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';

interface AppProps {}

const theme = createTheme();

interface Cocktail {
  id?: string;
  name: string;
  ingredients: { name: string; amount: string }[];
  instructions: string;
  image: string;
}

const App: React.FC<AppProps> = () => {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setAuthError(null);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error('Error signing in anonymously:', error);
          setAuthError(error.message);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      console.log('Setting up Firestore listener for user:', user.uid);
      const q = query(collection(db, 'cocktails'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const cocktailsData: Cocktail[] = [];
        querySnapshot.forEach((doc) => {
          cocktailsData.push({ id: doc.id, ...doc.data() } as Cocktail);
        });
        console.log('Received cocktails from Firestore:', cocktailsData);
        setCocktails(cocktailsData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleAddCocktail = async (newCocktail: Omit<Cocktail, 'id'>) => {
    if (user) {
      try {
        const docRef = await addDoc(collection(db, 'cocktails'), {
          ...newCocktail,
          userId: user.uid,
        });
        console.log('Cocktail added with ID: ', docRef.id);
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error adding cocktail: ', error);
      }
    }
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        {authError ? (
          <Typography color="error" variant="body1">
            Ошибка аутентификации: {authError}
          </Typography>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={currentTab} onChange={handleChangeTab}>
                <Tab label="Добавить рецепт" />
                <Tab label="Список рецептов" />
              </Tabs>
            </Box>
            {currentTab === 0 ? (
              <CocktailForm onSubmit={handleAddCocktail} />
            ) : (
              <CocktailList key={cocktails.length} cocktails={cocktails} />
            )}
          </>
        )}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message="Коктейль успешно добавлен"
        />
      </Container>
    </ThemeProvider>
  );
};

export default App;
