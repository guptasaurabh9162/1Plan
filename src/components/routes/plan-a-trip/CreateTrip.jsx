import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  PROMPT,
  SelectBudgetOptions,
  SelectNoOfPersons,
} from "../../constants/Options";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { LogInContext } from "@/Context/LogInContext/Login";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [place, setPlace] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { user, loginWithPopup, isAuthenticated, setTrip } = useContext(LogInContext);

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 1) return setSuggestions([]);
    try {
      const response = await axios.get(
        `https://maps.gomaps.pro/maps/api/place/queryautocomplete/json?input=${query}&key=${import.meta.env.VITE_GOMAPS_API_KEY}`
      );
      setSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (place) fetchSuggestions(place);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [place]);

  const SignIn = async () => loginWithPopup();

  const SaveTrip = (tripData) => {
    const id = Date.now().toString();
    const tripInfo = {
      tripId: id,
      userSelection: formData,
      tripData: tripData,
      userName: user?.name,
      userEmail: user?.email
    };
    setTrip(tripInfo);
    localStorage.setItem("Trip", JSON.stringify(tripInfo));
    navigate(`/trip/${id}`);
  };

  const generateTrip = async () => {
    if (!isAuthenticated) {
      toast("Sign In to continue", { icon: "⚠️" });
      return setIsDialogOpen(true);
    }
    
    if (!formData?.noOfDays || !formData?.location || !formData?.People || !formData?.Budget) {
      return toast.error("Please fill out all fields");
    }

    try {
      const toastId = toast.loading("Generating your perfect trip...", { icon: "✈️" });
      setIsLoading(true);

      // Initialize Gemini
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Enhanced prompt with strict formatting
      const prompt = `
      Create a detailed travel itinerary in STRICT JSON format with the following requirements:

      Location: ${formData.location}
      Duration: ${formData.noOfDays} days
      Budget Level: ${formData.Budget}
      Travelers: ${formData.People}

      Required JSON structure:
      {
        "location": "string",
        "duration": number,
        "budget": "string",
        "people": number,
        "hotels": [
          {
            "name": "string",
            "description": "string",
            "address": "string",
            "rating": number,
            "price": "string",
            "location": "string (Google Maps URL)",
            "coordinates": "string (lat,lng)",
            "image_url": "string"
          }
        ],
        "itinerary": [
          {
            "day": number,
            "title": "string",
            "places": [
              {
                "name": "string",
                "details": "string",
                "pricing": "string",
                "timings": "string",
                "location": "string (Google Maps URL)",
                "coordinates": "string (lat,lng)",
                "image_url": "string"
              }
            ]
          }
        ]
      }

      IMPORTANT:
      - Return ONLY the JSON object
      - No additional text or markdown
      - Include 3 hotel options
      - Create ${formData.noOfDays} days of itinerary
      - Each day should have 3-4 places
      - All fields must be populated
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Clean the response to extract pure JSON
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      text = text.substring(jsonStart, jsonEnd);

      const trip = JSON.parse(text);

      if (!trip.itinerary || !Array.isArray(trip.itinerary) || !trip.hotels || !Array.isArray(trip.hotels)) {
        throw new Error("Invalid trip data structure received");
      }

      SaveTrip(trip);
      toast.dismiss(toastId);
      toast.success("Trip generated successfully!");
    } catch (error) {
      setIsLoading(false);
      toast.dismiss();
      console.error("Trip generation error:", error);
      toast.error("Failed to generate trip. Please try again.");
    }
  };

  return (
    <div className="mt-10 px-4 max-w-4xl mx-auto">
      <div className="text text-center md:text-left">
        <h2 className="text-2xl md:text-4xl font-bold">
          Share Your Travel Preferences 🌟🚀
        </h2>
        <p className="text-sm text-gray-600 font-medium mt-3">
          Help us craft your perfect adventure with just a few details.
        </p>
      </div>

      <div className="form mt-10 flex flex-col gap-10 md:gap-20">
        <div className="place">
          <h2 className="font-semibold text-md md:text-lg mb-3 text-center md:text-left">
            Where do you want to Explore? 🏖️
          </h2>
          <Input
            placeholder="Search for a place..."
            value={place}
            onChange={(e) => {
              setPlace(e.target.value);
              handleInputChange("location", e.target.value);
            }}
            className="w-full p-2 border rounded"
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list mt-2 border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setPlace(suggestion.description);
                    handleInputChange("location", suggestion.description);
                    setSuggestions([]);
                  }}
                  className="suggestion-item cursor-pointer p-2 hover:bg-gray-100"
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="day">
          <h2 className="font-semibold text-md md:text-lg mb-3 text-center md:text-left">
            How long is your Trip? 🕜
          </h2>
          <Input
            placeholder="Number of days (e.g. 3)"
            type="number"
            min="1"
            max="30"
            onChange={(day) => handleInputChange("noOfDays", day.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="budget">
          <h2 className="font-semibold text-md md:text-lg mb-3 text-center md:text-left">
            What is your Budget? 💳
          </h2>
          <div className="options grid grid-cols-1 gap-5 md:grid-cols-3 cursor-pointer">
            {SelectBudgetOptions.map((item) => (
              <div
                onClick={() => handleInputChange("Budget", item.title)}
                key={item.id}
                className={`option transition-all hover:scale-105 p-4 h-32 flex items-center justify-center flex-col border rounded-lg hover:shadow-lg ${
                  formData?.Budget === item.title ? "border-black shadow-xl bg-gray-100" : "bg-white"
                }`}
              >
                <h3 className="font-bold text-[15px] md:font-[18px]">
                  {item.icon} {item.title}
                </h3>
                <p className="text-gray-500 font-medium text-sm text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="people">
          <h2 className="font-semibold text-md md:text-lg mb-3 text-center md:text-left">
            Who are you traveling with? 🚗
          </h2>
          <div className="options grid grid-cols-1 gap-5 md:grid-cols-3 cursor-pointer">
            {SelectNoOfPersons.map((item) => (
              <div
                onClick={() => handleInputChange("People", item.no)}
                key={item.id}
                className={`option transition-all hover:scale-105 p-4 h-32 flex items-center justify-center flex-col border rounded-lg hover:shadow-lg ${
                  formData?.People === item.no ? "border-black shadow-xl bg-gray-100" : "bg-white"
                }`}
              >
                <h3 className="font-bold text-[15px] md:font-[18px]">
                  {item.icon} {item.title}
                </h3>
                <p className="text-gray-500 font-medium text-sm text-center">{item.desc}</p>
                <p className="text-gray-500 text-xs font-normal mt-1">{item.no}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="create-trip-btn w-full flex items-center justify-center h-32 mt-10">
        <Button 
          disabled={isLoading} 
          onClick={generateTrip}
          className="px-8 py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            "Generate My Trip Plan"
          )}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {user ? "Thank you for Logging In" : "Sign In to Continue"}
            </DialogTitle>
            <DialogDescription>
              <span className="flex gap-2">
                {user
                  ? "You're now logged in securely with Google"
                  : "Sign in with Google to save your trips"}
              </span>
              {!user && (
                <Button
                  onClick={SignIn}
                  className="w-full mt-5 flex gap-2 items-center justify-center"
                >
                  Sign In with <FcGoogle className="h-5 w-5" />
                </Button>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="w-full">
              <DialogClose>Close</DialogClose>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;