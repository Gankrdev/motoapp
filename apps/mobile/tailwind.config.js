/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],

    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#4A7C59",
                "primaryLight": "#7D9285",
                accent: "#FFB74D",
                background: "#1A1C18",
                card: "#23261F",
                "slateText": "#FAF3DD",
                "secondaryText": "#C4C1B1",
                info: "#6B8FA8",
                success: "#5C7A67",
            },

        },
    },
    plugins: [],
}
