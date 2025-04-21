import React, { useState, useEffect } from "react";

const CarbonFootprintCalculator = () => {
  const [distance, setDistance] = useState("");
  const [selectedTransport, setSelectedTransport] = useState("cab");
  const [userEmissions, setUserEmissions] = useState(null);
  const [alternativeEmissions, setAlternativeEmissions] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [facts, setFacts] = useState({
    fact1: "Loading...",
    fact2: "Loading...",
    fact3: "Loading...",
  });

  const factsArray = [
    "Did you know that walking or biking instead of driving can significantly reduce your carbon footprint?",
    "Public transport can lower your carbon emissions by up to 45% compared to driving alone.",
    "The average carbon footprint of a person is about 4 tons per year.",
    "A single tree can absorb up to 48 pounds of CO2 per year!",
    "Electric vehicles produce zero direct emissions!",
    "Using public transport for a year can reduce your carbon footprint by 2.6 tons!",
  ];

  const ecoTips = [
    "Use public transportation whenever possible to reduce carbon emissions.",
    "Carpool with friends to minimize the number of cars on the road.",
    "Choose electric or hybrid vehicles for a lower carbon footprint.",
    "Walking or cycling for short trips can save up to 1kg of CO2 per mile!",
    "Regular vehicle maintenance can improve fuel efficiency by up to 40%!",
    "Turning off your engine instead of idling can save 1 pound of CO2 per minute!",
  ];

  const quotes = [
    "The Earth does not belong to us: we belong to the Earth.",
    "What we are doing to the forests of the world is but a mirror reflection of what we are doing to ourselves.",
    "The greatest threat to our planet is the belief that someone else will save it.",
    "We don't inherit the Earth from our ancestors, we borrow it from our children.",
    "Nature provides a free lunch, but only if we control our appetites.",
    "The environment is where we all meet; where we all have a mutual interest.",
  ];

  useEffect(() => {
    const updateFacts = () => {
      setFacts({
        fact1: factsArray[Math.floor(Math.random() * factsArray.length)],
        fact2: ecoTips[Math.floor(Math.random() * ecoTips.length)],
        fact3: quotes[Math.floor(Math.random() * quotes.length)],
      });
    };

    updateFacts(); // Initial update
    const interval = setInterval(updateFacts, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const calculateEmissions = () => {
    const distanceNum = parseFloat(distance);
    if (isNaN(distanceNum) || distanceNum < 0) {
      alert("Please enter a valid distance.");
      return;
    }

    const emissionFactors = {
      cab: 200,
      bus: 100,
      bike: 30,
      metro: 50,
    };

    const userEmissions = (emissionFactors[selectedTransport] * distanceNum).toFixed(2);
    setUserEmissions(`Your emissions: ${userEmissions} grams of CO2`);

    const altEmissions = Object.entries(emissionFactors)
      .filter(([mode]) => mode !== selectedTransport)
      .map(([mode, factor]) => `${mode.charAt(0).toUpperCase() + mode.slice(1)}: ${(factor * distanceNum).toFixed(2)} grams of CO2`)
      .join("\n");

    setAlternativeEmissions(altEmissions);

    setFeedbackMessage(
      selectedTransport === "bike"
        ? "Slay! You're giving main character energy! 🚴‍♂️ ✨"
        : userEmissions < 200
        ? "No cap fr fr, you're being eco-friendly! 🌱"
        : "Bestie, maybe try a greener option next time? 🌍"
    );
  };

  const getTransportIcon = (mode) => {
    switch (mode) {
      case "cab":
        return "https://img.icons8.com/fluency/48/000000/taxi.png";
      case "bus":
        return "https://img.icons8.com/fluency/48/000000/bus.png";
      case "bike":
        return "https://img.icons8.com/fluency/48/000000/bicycle.png";
      case "metro":
        return "https://img.icons8.com/fluency/48/000000/train.png";
      default:
        return "";
    }
  };

  return (
    <div className="parallax bg-[#0f172a] min-h-screen text-gray-200">
      <div className="parallax__layer parallax__layer--back animated-background" />
      
      <div className="parallax__layer parallax__layer--base">
        <div className="w-full px-4 py-12">
          <h1 className="text-5xl font-bold text-center mb-12 glow-effect text-blue-400">
            Carbon Check ✨
          </h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <div className="lg:w-1/4 space-y-6">
              {[facts.fact1, facts.fact2, facts.fact3].map((fact, index) => (
                <div key={index} className={`glass-effect rounded-xl p-6 card-hover ${index % 2 === 0 ? 'floating' : 'floating-delayed'} fade-in`}>
                  <h3 className="text-xl font-bold mb-3 text-blue-400">
                    {index === 0 ? "Tea ☕" : index === 1 ? "Based Take 💅" : "No Cap 🧢"}
                  </h3>
                  <p className="text-gray-300">{fact}</p>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="lg:w-1/2 glass-effect rounded-xl p-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-blue-400">
                Vibe Check Your Carbon Footprint 🌍
              </h2>

              <div className="space-y-8">
                <div className="bg-opacity-50 bg-black p-6 rounded-lg floating">
                  <label className="block text-lg mb-2">Distance (km) 🚀</label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder="Enter distance bestie..."
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["cab", "bus", "bike", "metro"].map((mode) => (
                    <div
                      key={mode}
                      className={`card-hover cursor-pointer p-4 rounded-lg text-center transform transition-all duration-300 ${
                        selectedTransport === mode
                          ? "bg-blue-600 bg-opacity-50 scale-105"
                          : "bg-gray-800 bg-opacity-50 hover:scale-105"
                      }`}
                      onClick={() => setSelectedTransport(mode)}
                    >
                      <img
                        src={getTransportIcon(mode)}
                        alt={mode}
                        className="mx-auto mb-2 floating"
                      />
                      <span className="capitalize">{mode}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={calculateEmissions}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Calculate The Vibes ✨
                </button>

                {userEmissions && (
                  <div className="bg-opacity-50 bg-black p-6 rounded-lg space-y-4 pop-in">
                    <h2 className="text-2xl font-bold text-center text-blue-400">The Tea ☕</h2>
                    <p className="text-lg text-center">{userEmissions}</p>
                    <p className="text-center text-green-400 text-xl">{feedbackMessage}</p>
                    <div className="space-y-2">
                      {alternativeEmissions.split('\n').map((emission, index) => (
                        <p key={index} className="text-gray-300">{emission}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:w-1/4 space-y-6">
              <div className="glass-effect rounded-xl p-6 card-hover floating fade-in">
                <h3 className="text-xl font-bold mb-3 text-blue-400">Fr Fr 💯</h3>
                <p className="text-gray-300">🚗 Your whip's carbon game is wild! 4.6 metric tons per year!</p>
              </div>
              <div className="glass-effect rounded-xl p-6 card-hover floating-delayed fade-in">
                <h3 className="text-xl font-bold mb-3 text-blue-400">On God 🙌</h3>
                <p className="text-gray-300">🌍 Keep it real with Mother Earth - she's the real MVP!</p>
              </div>
              <div className="glass-effect rounded-xl p-6 card-hover floating fade-in">
                <h3 className="text-xl font-bold mb-3 text-blue-400">Big Mood 🌟</h3>
                <p className="text-gray-300">"Living your best life includes saving the planet!" - Facts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprintCalculator;