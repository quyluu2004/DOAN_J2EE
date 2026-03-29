/**
 * Stack Component - Inspired by React Bits Stack
 * Creates a stack of cards that can be flipped/swiped
 * Preserves original card rounded corner styling
 */

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const Stack = ({
    cardsData = [],
    cardDimensions = { width: 200, height: 300 },
    randomRotation = true,
    sensitivity = 100,
    animationConfig = { stiffness: 260, damping: 20 },
    renderCard,
    dragEnabled = true, // New prop to control drag capability
}) => {
    const [cards, setCards] = useState(cardsData);

    // Sync state when props change (crucial for dynamic data)
    useEffect(() => {
        if (cardsData && cardsData.length > 0) {
            setCards(cardsData);
        }
    }, [cardsData]);

    const sendToBack = (id) => {
        setCards((prev) => {
            const newCards = [...prev];
            const index = newCards.findIndex((card) => card.id === id);
            const [card] = newCards.splice(index, 1);
            newCards.unshift(card);
            return newCards;
        });
    };

    return (
        <div
            className="relative"
            style={{
                width: cardDimensions.width,
                height: cardDimensions.height,
                perspective: 600,
            }}
        >
            {cards.map((card, index) => {
                const randomRotate = randomRotation
                    ? Math.random() * 10 - 5
                    : 0;

                return (
                    <CardItem
                        key={card.id}
                        card={card}
                        cards={cards}
                        setCards={setCards}
                        sendToBack={sendToBack}
                        sensitivity={sensitivity}
                        cardDimensions={cardDimensions}
                        animationConfig={animationConfig}
                        index={index}
                        randomRotate={randomRotate}
                        renderCard={renderCard}
                        dragEnabled={dragEnabled}
                    />
                );
            })}
        </div>
    );
};

function CardItem({
    card,
    cards,
    sendToBack,
    sensitivity,
    cardDimensions,
    animationConfig,
    index,
    randomRotate,
    renderCard,
    dragEnabled,
}) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [8, -8]);
    const rotateY = useTransform(x, [-100, 100], [-8, 8]);

    const isTop = index === cards.length - 1;

    return (
        <motion.div
            key={card.id}
            onTap={() => {
                if (isTop && card.productId) {
                    window.location.href = `/products/${card.productId}`;
                }
            }}
            style={{
                width: cardDimensions.width,
                height: cardDimensions.height,
                x,
                y,
                rotate: `${randomRotate}deg`,
                zIndex: index,
                cursor: dragEnabled && isTop ? "grab" : "default",
            }}
            className="absolute rounded-[2rem] overflow-hidden bg-white shadow-xl"
            drag={dragEnabled && isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(e, info) => {
                if (Math.abs(info.offset.x) > sensitivity) {
                    sendToBack(card.id);
                }
            }}
            initial={{
                scale: 1 - index * 0.05,
                y: index * -12,
            }}
            animate={{
                scale: 1 - index * 0.05,
                y: index * -12,
            }}
            transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
            }}
            whileHover={{ scale: isTop ? 1.02 : 1 - index * 0.05 }}
            whileTap={{ scale: isTop ? 1.05 : 1 - index * 0.05 }}
        >
            {renderCard ? (
                renderCard(card, index)
            ) : (
                <div className="w-full h-full bg-white flex items-center justify-center rounded-[2rem]">
                    <img
                        src={card.img}
                        alt={card.title || "Card"}
                        className="w-full h-full object-cover rounded-[2rem]"
                        draggable={false}
                    />
                </div>
            )}
        </motion.div>
    );
}

export default Stack;
