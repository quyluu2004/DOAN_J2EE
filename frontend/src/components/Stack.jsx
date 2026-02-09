/**
 * Stack Component - Inspired by React Bits Stack
 * Creates a stack of cards that can be flipped/swiped
 * Preserves original card rounded corner styling
 */

import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const Stack = ({
    randomRotation = false,
    sensitivity = 200,
    cardDimensions = { width: 260, height: 340 },
    cardsData = [],
    animationConfig = { stiffness: 260, damping: 20 },
    renderCard,
    dragEnabled = true, // New prop to control drag capability
}) => {
    const [cards, setCards] = useState(
        cardsData.length > 0
            ? cardsData
            : [
                { id: 1, img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400" },
                { id: 2, img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400" },
            ]
    );

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

    const handleDragEnd = () => {
        if (Math.abs(x.get()) > sensitivity || Math.abs(y.get()) > sensitivity) {
            sendToBack(card.id);
        }
    };

    const isTop = index === cards.length - 1;

    return (
        <motion.div
            className={`absolute rounded-[2rem] overflow-hidden bg-white ${dragEnabled && isTop ? "cursor-grab active:cursor-grabbing" : "cursor-default"
                }`}
            style={{
                width: cardDimensions.width,
                height: cardDimensions.height,
                x,
                y,
                rotateX: isTop ? rotateX : 0,
                rotateY: isTop ? rotateY : 0,
                rotate: `${randomRotate}deg`,
                zIndex: index,
                boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
            }}
            initial={{
                scale: 1 - index * 0.05,
                y: index * -12,
            }}
            animate={{
                scale: 1 - index * 0.05,
                y: index * -12,
            }}
            drag={dragEnabled && isTop}
            dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
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
