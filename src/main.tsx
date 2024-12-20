import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WishList from './WishList.tsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { lime, purple } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: lime,
    secondary: purple,
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <WishList />
    </ThemeProvider>
  </StrictMode>
)
