// Room Assist AI Matching Engine (Frontend Logic)
// Evaluates candidate rooms against user requirements, computes percentage match score,
// generates specific "Why this matches you" positive points and "Things to consider" notes.

export function matchRoomsWithAI(rooms, criteria) {
  if (!criteria) {
    return rooms.map(room => ({
      ...room,
      matchScore: 88,
      matchReasons: [
        room.roomType === "Shared Room" ? "Shared room" : "Private room",
        "Clean and verified property owner",
        "Good connectivity to local transport"
      ],
      considerations: [
        room.roomType === "Shared Room" ? "Room is shared with 1 roommate" : "Independent living arrangement",
        room.hasAttachedBath ? "Attached bathroom available" : "Shared bathroom with other tenants"
      ]
    }));
  }

  const {
    city = "",
    budget = 10000,
    roomType = "No Preference",
    furnishedStatus = "",
    maxCommute = 30,
    amenities = [],
    area = "",
    moveInDate = ""
  } = criteria;

  const targetBudget = Number(budget) || 10000;
  const targetCommute = Number(maxCommute) || 30;

  const scoredRooms = rooms.map(room => {
    let score = 50; // base score
    const positiveReasons = [];
    const considerationPoints = [];

    // 1. Room Type Match & Prioritization (Requirement 6)
    const isSharedUserPref = roomType === "Shared Room" || (typeof roomType === "string" && roomType.toLowerCase().includes("shared"));
    const isPrivateUserPref = roomType === "Private Room" || (typeof roomType === "string" && (roomType.toLowerCase().includes("private") || roomType.toLowerCase() === "single"));
    const isRoomShared = room.roomType === "Shared Room";

    if (isSharedUserPref) {
      if (isRoomShared) {
        score += 25;
        positiveReasons.push("Shared room");
        if (room.sharingCapacity) {
          positiveReasons.push(`${room.sharingCapacity}-person sharing setup`);
        }
      } else {
        score -= 30;
        considerationPoints.push("This is a private single room, not a shared room");
      }
    } else if (isPrivateUserPref) {
      if (!isRoomShared) {
        score += 20;
        positiveReasons.push("Private room");
      } else {
        score -= 30;
        considerationPoints.push("This is a shared room, not a private room");
      }
    } else {
      // No Preference
      positiveReasons.push(room.roomType === "Shared Room" ? "Shared room" : "Private room");
    }

    // 2. Budget match
    if (room.rent <= targetBudget) {
      score += 18;
      positiveReasons.push(`Within your ₹${targetBudget.toLocaleString('en-IN')} budget`);
    } else {
      const excess = room.rent - targetBudget;
      score -= Math.min(25, Math.round((excess / 1000) * 8));
      considerationPoints.push(`Rent ₹${room.rent.toLocaleString('en-IN')} is ₹${excess.toLocaleString('en-IN')} above your target budget`);
    }

    // 3. City Match (Heavy weight)
    if (city && city.toLowerCase() !== "all") {
      if (room.city.toLowerCase() === city.toLowerCase()) {
        score += 20;
        positiveReasons.push(`Located in ${room.city}`);
      } else {
        score -= 35;
        considerationPoints.push(`Located in ${room.city}, not your preferred ${city}`);
      }
    }

    // 4. Area / Landmark keyword match if provided
    if (area && area.trim().length > 0) {
      const q = area.toLowerCase().trim();
      const inArea = room.area.toLowerCase().includes(q) ||
                     room.fullAddress.toLowerCase().includes(q) ||
                     room.nearbyLandmarks.some(l => l.toLowerCase().includes(q));
      if (inArea) {
        score += 15;
        positiveReasons.push(`${room.area} location`);
      }
    }

    // 5. Furnished Status Match
    if (furnishedStatus && furnishedStatus !== "Any") {
      if (room.furnishedStatus.toLowerCase() === furnishedStatus.toLowerCase()) {
        score += 8;
        positiveReasons.push(`${room.furnishedStatus} as requested`);
      } else if (furnishedStatus === "Furnished" && room.furnishedStatus === "Semi-furnished") {
        score += 3;
        positiveReasons.push(`Semi-furnished with primary essentials`);
      } else {
        score -= 6;
        considerationPoints.push(`Room is ${room.furnishedStatus}, not ${furnishedStatus}`);
      }
    }

    // 6. Amenities Match
    if (room.hasWifi || (room.amenities && room.amenities.some(a => a.toLowerCase().includes("wi-fi") || a.toLowerCase().includes("wifi")))) {
      positiveReasons.push("Wi-Fi included");
    }

    if (Array.isArray(amenities) && amenities.length > 0) {
      amenities.forEach(reqAmenity => {
        const lower = reqAmenity.toLowerCase();
        if (lower.includes("wifi")) return; // already handled above

        const hasIt = (room.amenities && room.amenities.some(a => a.toLowerCase().includes(lower))) ||
                      (lower.includes("bathroom") && room.hasAttachedBath) ||
                      (lower.includes("kitchen") && room.hasKitchen) ||
                      (lower.includes("parking") && room.hasParking) ||
                      (lower.includes("ac") && room.hasAC) ||
                      (lower.includes("laundry") && room.hasLaundry);

        if (hasIt) {
          score += 4;
          positiveReasons.push(`${reqAmenity} available`);
        } else {
          considerationPoints.push(`${reqAmenity} is not provided in this room`);
        }
      });
    }

    // 7. Commute Time
    if (room.commuteTimeMins <= targetCommute) {
      score += 5;
    } else {
      score -= 5;
      considerationPoints.push(`Estimated commute ~${room.commuteTimeMins} mins`);
    }

    // Specific realistic Indian room considerations if not already mentioned
    if (isRoomShared && !considerationPoints.some(c => c.toLowerCase().includes("shared with"))) {
      considerationPoints.push("Room & kitchen are shared with room partner");
    } else if (!room.hasAttachedBath && !considerationPoints.some(c => c.toLowerCase().includes("bathroom"))) {
      considerationPoints.push("Bathroom is shared with other tenants");
    }

    if (room.electricityRule && !considerationPoints.some(c => c.toLowerCase().includes("electricity"))) {
      considerationPoints.push(room.electricityRule);
    }

    // Clamp score between 45% and 98%
    const finalScore = Math.max(45, Math.min(98, Math.round(score)));

    // Deduplicate positive reasons
    const uniquePositive = Array.from(new Set(positiveReasons));
    const uniqueConsiderations = Array.from(new Set(considerationPoints));

    return {
      ...room,
      matchScore: finalScore,
      matchReasons: uniquePositive.slice(0, 5),
      considerations: uniqueConsiderations.slice(0, 2)
    };
  });

  // Sort descending by match score
  return scoredRooms.sort((a, b) => b.matchScore - a.matchScore);
}

// Natural language parser for the AI input prompt
export function parseNaturalLanguagePrompt(text) {
  if (!text || typeof text !== "string") return {};

  const lower = text.toLowerCase();
  const detected = {};

  // Detect City
  if (lower.includes("indore")) detected.city = "Indore";
  else if (lower.includes("rewa")) detected.city = "Rewa";
  else if (lower.includes("bhopal")) detected.city = "Bhopal";

  // Detect Budget (e.g., 4000, 4500, 5000, 6000, 7000, 8k, 6k, ₹4,500, under 4500)
  const budgetMatch = lower.match(/(?:under|below|budget|within|upto|up to|rs\.?|₹)?\s*(\d{1,2}(?:\.\d)?)k\b/) ||
                      lower.match(/(?:under|below|budget|within|upto|up to|rs\.?|₹)?\s*(\d{4,5})\b/);
  if (budgetMatch) {
    const val = budgetMatch[1];
    if (val.includes("k") || Number(val) <= 20) {
      detected.budget = Math.round(parseFloat(val) * 1000);
    } else {
      detected.budget = Number(val);
    }
  }

  // Detect Room Type (Requirement 6: Shared Room, Private Room, No Preference)
  if (lower.includes("shared room") || lower.includes("shared") || lower.includes("sharing") || lower.includes("roommate") || lower.includes("partner")) {
    detected.roomType = "Shared Room";
  } else if (lower.includes("private room") || lower.includes("private") || lower.includes("single room") || lower.includes("single")) {
    detected.roomType = "Private Room";
  }

  // Detect Furnishing
  if (lower.includes("unfurnished")) detected.furnishedStatus = "Unfurnished";
  else if (lower.includes("semi-furnished") || lower.includes("semi furnished")) detected.furnishedStatus = "Semi-furnished";
  else if (lower.includes("furnished")) detected.furnishedStatus = "Furnished";

  // Detect Amenities
  const amenities = [];
  if (lower.includes("wifi") || lower.includes("wi-fi") || lower.includes("internet")) amenities.push("Wi-Fi");
  if (lower.includes("attached bath") || lower.includes("attached washroom") || lower.includes("private bath")) amenities.push("Attached bathroom");
  if (lower.includes("kitchen") || lower.includes("cooking")) amenities.push("Kitchen access");
  if (lower.includes("parking") || lower.includes("bike")) amenities.push("Parking");
  if (lower.includes("ac") || lower.includes("air conditioner")) amenities.push("AC");
  if (lower.includes("laundry") || lower.includes("washing")) amenities.push("Laundry");
  if (amenities.length > 0) detected.amenities = amenities;

  // Detect Area or College keywords
  if (lower.includes("bhawarkua") || lower.includes("bhavarkua")) {
    detected.area = "Bhawarkua";
  } else if (lower.includes("vijay nagar")) {
    detected.area = "Vijay Nagar";
  } else if (lower.includes("university road") || lower.includes("aps university") || lower.includes("aps")) {
    detected.area = "University Road";
  } else if (lower.includes("civil lines")) {
    detected.area = "Civil Lines";
  } else if (lower.includes("mp nagar")) {
    detected.area = "MP Nagar";
  } else if (lower.includes("rau")) {
    detected.area = "Rau";
  } else if (lower.includes("kolar")) {
    detected.area = "Kolar Road";
  } else if (lower.includes("scheme 54") || lower.includes("scheme no 54")) {
    detected.area = "Scheme No. 54";
  }

  return detected;
}
