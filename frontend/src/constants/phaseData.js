import {
    menstrualCat,
    follicularCat,
    ovulationCat,
    lutealCat,
} from "../assets";

const phaseData = {
    MENSTRUAL: {
        name: "Menstrual Phase",
        icon: "🩸",
        image: menstrualCat,
        colorClass: "menstrual",
        homeMessage:
            "No pressure today, baby. Rest is allowed. Your tiny cat approves. 🐱",
        cycleMessage:
            "Take things gently today. Rest, hydration and comfort are your little priorities.",
    },
    FOLLICULAR: {
        name: "Follicular Phase",
        icon: "🌱",
        image: follicularCat,
        colorClass: "follicular",
        homeMessage:
            "Your energy is slowly coming back. Go be your cute little self today. 🌱",
        cycleMessage:
            "Your energy may gradually be returning. A fresh little start. 🌱",
    },
    OVULATION: {
        name: "Ovulation Phase",
        icon: "🌸",
        image: ovulationCat,
        colorClass: "ovulation",
        homeMessage:
            "Someone is feeling a little extra pretty today... 👀💕",
        cycleMessage:
            "A brighter part of your cycle. Keep taking care of yourself. 🌸",
    },
    LUTEAL: {
        name: "Luteal Phase",
        icon: "🌙",
        image: lutealCat,
        colorClass: "luteal",
        homeMessage:
            "Come here. Today deserves a little more softness. 🫶",
        cycleMessage:
            "Slow down a little if you need to. Soft days are allowed too. 🌙",
    },
};

export default phaseData;
