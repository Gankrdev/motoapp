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
                primary      :"#4A7C59",
                primaryLight :"#7D9285",
                accent       :"#FFB74D",
                background   :"#1A1C18",
                card         :"#23261F",
                slateText    :"#FAF3DD",
                secondaryText:"#C4C1B1",
                info         :"#6B8FA8",
                success      :"#5C7A67",
                error        :"#B84E33"
            },
            fontFamily: {
                'display'          : ['SpaceGrotesk_700Bold'],
                'display-medium'   : ['SpaceGrotesk_500Medium'],
                'display-regular'  : ['SpaceGrotesk_400Regular'],
                'display-semibold' : ['SpaceGrotesk_600SemiBold'],
                'body'             : ['Manrope_400Regular'], 
                'body-medium'      : ['Manrope_500Medium'],
                'body-semibold'    : ['Manrope_600SemiBold'],
                'body-bold'        : ['Manrope_700Bold']
            }
        },
    },
    plugins: [],
}
