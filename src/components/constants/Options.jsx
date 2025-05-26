export const SelectBudgetOptions = [
    {
        id:1,
        icon: "💵",
        title:"Cheap",
        desc: "Economize and Save"
    },
    {
        id: 2,
        icon: "💰",
        title:"Moderate",
        desc: "Balance Cost and Comfort"
    },
    {
        id:3,
        icon: "💎",
        title:"Luxury",
        desc: "Induldge without Limits"
    },
]

export const SelectNoOfPersons = [
    {
        id:1,
        icon: "🚶",
        title: "Solo",
        desc: "Discovering on Your Own",
        no: "1 Person"
    },
    {
        id:2,
        icon: "💑",
        title: "Partner",
        desc: "Exploring with a Loved One",
        no: "2 People"
    },
    {
        id:3,
        icon: "👨‍👩‍👧‍👦",
        title: "Family",
        desc: "Fun for All Ages",
        no: "3 to 5 People"
    },
    {
        id:4,
        icon: "🤝",
        title: "Friends",
        desc: "Adventure with Your Crew",
        no: "5 to 10 People"
    },
]

export const PROMPT = "Generate a travel plan for Location: {location}, for {totalDays} days with {traveler} travelers and a budget of {budget}. Provide a list of hotel options, including hotel name, address, price, image URL, geo-coordinates, rating, and a brief description. Suggest a detailed itinerary with the following information for each place: place name, details, image URL, geo-coordinates, ticket pricing, and travel time between locations. Create a day-by-day plan for {totalDays} days, including the best times to visit each location. Format the response in JSON."
