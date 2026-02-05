import { useState, useEffect } from 'react';
import '../style/MatchingGame.css';
import wordData from '../data/words.json';

export interface Word {
    id: number;
    word_eng: string;
    word_thai: string;
    part_of_speech: string;
}

interface GameCard {
    uniqueId: string;
    wordId: number;
    text: string;
    type: 'eng' | 'thai';
    status: 'idle' | 'selected' | 'matched' | 'incorrect';
}

const MatchingGame = () => {
    const [cards, setCards] = useState<GameCard[]>([]);
    const [isGameCompleted, setIsGameCompleted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const initializeGame = () => {
        const shuffledWords = [...wordData]
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);

        // create thai-eng card pairs
        const gameCards: GameCard[] = [];
        shuffledWords.forEach((word) => {
            // english
            gameCards.push({
                uniqueId: `${word.id}-eng`,
                wordId: word.id,
                text: word.word_eng,
                type: 'eng',
                status: 'idle'
            });
            // thai
            gameCards.push({
                uniqueId: `${word.id}-thai`,
                wordId: word.id,
                text: word.word_thai,
                type: 'thai',
                status: 'idle'
            });
        });

        // shuffle cards
        const shuffledCards = gameCards.sort(() => 0.5 - Math.random());

        setCards(shuffledCards);
        setIsGameCompleted(false);
        setIsProcessing(false);
    };

    useEffect(() => {
        initializeGame();
    }, []);

    const handleCardClick = (clickedCard: GameCard) => {
        if (
            isProcessing ||
            clickedCard.status === 'matched' ||
            clickedCard.status === 'selected'
        ) return;

        const newCards = cards.map(c =>
            c.uniqueId === clickedCard.uniqueId ? { ...c, status: 'selected' as const } : c
        );
        setCards(newCards);

        const selectedCards = newCards.filter(c => c.status === 'selected');

        if (selectedCards.length === 2) {
            setIsProcessing(true);

            const [card1, card2] = selectedCards;
            const isMatch = card1.wordId === card2.wordId;

            if (isMatch) {
                // --- correct ---
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        (c.uniqueId === card1.uniqueId || c.uniqueId === card2.uniqueId)
                            ? { ...c, status: 'matched' }
                            : c
                    ));
                    checkWinCondition(newCards);
                    setIsProcessing(false);
                }, 500);
            } else {
                // --- incorrect ---
                setCards(prev => prev.map(c =>
                    (c.uniqueId === card1.uniqueId || c.uniqueId === card2.uniqueId)
                        ? { ...c, status: 'incorrect' }
                        : c
                ));

                // wait 1 second before flipping back
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        (c.status === 'incorrect')
                            ? { ...c, status: 'idle' }
                            : c
                    ));
                    setIsProcessing(false);
                }, 1000);
            }
        }
    };

    const checkWinCondition = (currentCards: GameCard[]) => {
        const matchedCount = currentCards.filter(c => c.status === 'matched').length + 2;
        if (matchedCount === cards.length) {
            setTimeout(() => setIsGameCompleted(true), 800);
        }
    };

    return (
        <div className="matching-container">
            <header className="matching-header">
                <h1 className="matching-title">Vocabulary Match</h1>
                <p className="matching-subtitle">จับคู่คำศัพท์ให้ถูกต้อง (เหลือ {cards.filter(c => c.status !== 'matched').length / 2} คู่)</p>
            </header>

            <div className="matching-grid">
                {cards.map((card) => (
                    <button
                        key={card.uniqueId}
                        className={`matching-card matching-card-${card.status}`}
                        onClick={() => handleCardClick(card)}
                        disabled={card.status === 'matched'}
                    >
                        {card.text}
                    </button>
                ))}
            </div>

            {/* Modal */}
            {isGameCompleted && (
                <div className="matching-overlay">
                    <div className="matching-modal">
                        <h2>🎉 เก่งมาก! 🎉</h2>
                        <p>คุณจำคำศัพท์ชุดนี้ได้ครบแล้ว</p>
                        <button className="matching-btn-restart" onClick={initializeGame}>
                            เล่นรอบถัดไป ➜
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchingGame;