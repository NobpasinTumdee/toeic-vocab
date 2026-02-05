import { Link } from "react-router-dom"

const Home = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <Link to="/matching-game">Matching Game</Link>
            <Link to="/flashcards">Flashcards</Link>
        </div>
    )
}

export default Home
