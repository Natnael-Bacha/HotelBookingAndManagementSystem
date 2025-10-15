import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import Room from "../models/rooms.js";
export async function verifyAdmin(req, res, next) {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(403).json({ message: "Invalid Token" });
    }

    const verifiedToken = jwt.verify(token, process.env.KEY);

    if (!verifiedToken) {
      return res.status(403).json({ message: "Invalid Token" });
    }

    const admin = await Admin.findOne({ _id: verifiedToken._id });

    if (!admin) {
      return res.status(404).json({ message: "Failed to verify Admin" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.log("Failed To Verify Admin Token: ", error);
    return res.status(404).json({ message: "Failed to verify Admin" });
  }
}

export async function createRoom(req, res) {
  try {
   
    const {
      roomNumber,
      roomStandard,
      roomPrice,
      numberOfBeds,
      available,
      petFriendly,
    } = req.body;
    if (
      !roomNumber ||
      !roomStandard ||
      !roomPrice ||
      !numberOfBeds

    ) {
      return res.status(400).json({ message: "Please try again!" });
    }

    const room = await Room.findOne({ roomNumber });

    if (room) {
      return res.status(409).json({ message: "Room Already Exists" });
    }

    const newRoom =  new Room({
      roomNumber,
      roomStandard,
      roomPrice,
      numberOfBeds,
      available,
      petFriendly,
    });

    await newRoom.save();

    return res.status(200).json({ message: "Room Created" });
  } catch (error) {
    console.log("Error In creating Room:  ", error);
  }
}



export async function fetchRooms(req, res) {
  try {
    const {available, petFriendly, roomStandard} = req.query;
     console.log('Received filters:', { available, petFriendly, roomStandard });
    const filter = {};

    if(available !== undefined){
      filter.available = available === 'true';
    }

    if(petFriendly !== undefined){
      filter.petFriendly = petFriendly === 'true';
    }

    if(roomStandard !== undefined){
      filter.roomStandard = roomStandard;
    }

    const rooms = await Room.find(filter);
  if(rooms.length === 0){
    return res.status(404).json({message: "No rooms are created!"});
  }
   
  return res.status(200).json({
    message: "Rooms fetched",
    rooms
  })
  } catch (error) {
       console.log("Can't fetch error: ", error);
       return res.status(500).json({message: "Error Fetching Rooms"});
  } 
}
