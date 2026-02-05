import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom';
import Rootlayout from './Layout/Rootlayout';
import Home from './Page/Home';
import Flashcards from './Page/Flashcards';
import MatchingGame from './Page/MatchingGame';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    errorElement: <h1>Not found this page...</h1>,
    children: [
      { index: true, element: <Home /> },
      { path: "flashcards", element: <Flashcards /> },
      { path: "matching-game", element: <MatchingGame /> },
    ]
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
