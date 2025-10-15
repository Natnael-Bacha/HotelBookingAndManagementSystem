import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useRoomStore } from "../store";

const CreateRoom = () => {
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomStandard: "",
    roomPrice: "",
    numberOfBeds: "",
    available: true,
    petFriendly: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addRoom } = useRoomStore();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = "Room number is required";
    }

    if (!formData.roomStandard.trim()) {
      newErrors.roomStandard = "Room standard is required";
    }

    if (!formData.roomPrice.trim()) {
      newErrors.roomPrice = "Room price is required";
    } else if (isNaN(formData.roomPrice) || parseFloat(formData.roomPrice) <= 0) {
      newErrors.roomPrice = "Please enter a valid price";
    }

    if (!formData.numberOfBeds.trim()) {
      newErrors.numberOfBeds = "Number of beds is required";
    } else if (isNaN(formData.numberOfBeds) || parseInt(formData.numberOfBeds) <= 0) {
      newErrors.numberOfBeds = "Please enter a valid number";
    }

    return newErrors;
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      try {
        const result = await addRoom(formData);

        if (result.success) {
          navigate("/adminDashboard");
        } else {
          setErrors({ submit: result.error });
        }
      } catch (error) {
        console.log("Error creating room: ", error);
      }
    } else {
      setErrors(formErrors);
    }

    setIsSubmitting(false);
  };

  const getInputClassName = (fieldName) => {
    const baseClasses =
      "w-full px-4 py-3 text-sm border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-white";

    if (errors[fieldName]) {
      return `${baseClasses} border-red-300 focus:ring-red-500 bg-red-50`;
    }

    return `${baseClasses} border-gray-200 focus:ring-blue-500 focus:border-blue-500`;
  };

  const roomStandards = [
    { value: "standard", label: "Standard", description: "Comfortable and affordable", icon: "🛏️" },
    { value: "deluxe", label: "Deluxe", description: "Spacious with premium amenities", icon: "🌟" },
    { value: "executive", label: "Executive", description: "Business-class luxury", icon: "💼" },
    { value: "suite", label: "Suite", description: "Ultimate luxury experience", icon: "🏨" },
    { value: "presidential", label: "Presidential", description: "The pinnacle of luxury", icon: "👑" },
  ];

  const getCurrentStandard = () => roomStandards.find((s) => s.value === formData.roomStandard);

  const renderBedIcons = () => {
    const beds = parseInt(formData.numberOfBeds) || 0;
    return Array.from({ length: Math.min(beds, 5) }, (_, i) => (
      <span key={i} className="text-lg">
        🛏️
      </span>
    ));
  };

  return (

    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 overflow-hidden py-5">
      <div className="h-full max-w-7xl mx-auto flex flex-col relative">

        <div className="text-center flex-shrink-0 py-3">
          <div className="flex items-center justify-center mb-1">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center mr-2 shadow-lg">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <h1 className="text-lg font-bold text-gray-800">Hotel Elite</h1>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Create New Room</h2>
        </div>

  
        <div className="flex-1 flex items-stretch overflow-hidden">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex-1 flex">
            <div className="grid grid-cols-1 xl:grid-cols-3 h-full w-full">
      
              <div className="xl:col-span-1 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 p-4 text-white relative overflow-hidden">
                
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute top-0 right-0 w-20 h-20  bg-opacity-5 rounded-full -translate-y-6 translate-x-6" />
                <div className="absolute bottom-0 left-0 w-28 h-28  bg-opacity-10 rounded-full -translate-x-8 translate-y-8" />

                <div className="relative z-10 h-full flex flex-col">
                  <div className="mb-3">
                    <h3 className="text-base font-bold mb-1">Room Preview</h3>
                    <p className="text-blue-200 text-xs">Real-time visualization</p>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20 shadow-xl flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getCurrentStandard() && <span className="text-lg">{getCurrentStandard().icon}</span>}
                            <h4 className="font-bold text-base">
                              {formData.roomStandard ? getCurrentStandard()?.label || formData.roomStandard : "Room Type"}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            <p className="text-cyan-200 text-xs font-medium">
                              {formData.roomNumber ? `Room ${formData.roomNumber}` : "Awaiting Details"}
                            </p>
                          </div>
                        </div>

                        {formData.roomPrice && (
                          <div className="text-right bg-white/10 rounded px-2 py-1 border border-white/20">
                            <div className="text-base font-bold text-white">${formData.roomPrice}</div>
                            <div className="text-cyan-200 text-xs">per night</div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 mb-3 rounded overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                        {getCurrentStandard() ? (
                          <div className="text-center p-3">
                            <div className="text-3xl mb-1">{getCurrentStandard().icon}</div>
                            <div className="text-xs font-semibold text-white">{getCurrentStandard().label} Suite</div>
                          </div>
                        ) : (
                          <div className="text-center text-white/40 p-3">
                            <div className="text-2xl mb-1">🏨</div>
                            <p className="text-xs">Room preview will appear here</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-blue-500/20 rounded flex items-center justify-center"><span className="text-xs">🛏️</span></div>
                            <div>
                              <div className="text-xs text-cyan-200">Sleeping Capacity</div>
                              <div className="font-semibold text-xs">
                                {formData.numberOfBeds || "0"} {formData.numberOfBeds === "1" ? "Bed" : "Beds"}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">{renderBedIcons()}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-1 bg-white/5 rounded border border-white/10">
                            <div className="text-xs text-cyan-200 mb-1">Status</div>
                            <div className={`inline-flex items-center gap-1 px-1 py-0.5 rounded-full text-xs font-bold ${formData.available ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"}`}>
                              <div className={`w-1 h-1 rounded-full ${formData.available ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
                              {formData.available ? "Available" : "Occupied"}
                            </div>
                          </div>

                          <div className="p-1 bg-white/5 rounded border border-white/10">
                            <div className="text-xs text-cyan-200 mb-1">Pet Policy</div>
                            <div className={`inline-flex items-center gap-1 px-1 py-0.5 rounded-full text-xs font-bold ${formData.petFriendly ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"}`}>
                              <span className="text-xs">{formData.petFriendly ? "🐾" : "🚫"}</span>
                              {formData.petFriendly ? "Pet Friendly" : "No Pets"}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

     
              <div className="xl:col-span-2 p-4 lg:p-6 overflow-hidden">

                <div className="h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [::-webkit-scrollbar]:hidden">
                  <div className="pb-1">
                    {errors.submit && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">!</span>
                          </div>
                          <p className="text-red-600 text-sm font-medium">{errors.submit}</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="roomNumber" className="block text-xs font-semibold text-gray-700 mb-1">
                              <span className="flex items-center gap-1">
                                <span>Room Number</span>
                                <span className="text-red-500">*</span>
                              </span>
                            </label>
                            <input type="text" id="roomNumber" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required className={getInputClassName("roomNumber")} placeholder="e.g., 301, 402A" />
                            {errors.roomNumber && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠</span> {errors.roomNumber}</p>}
                          </div>

                          <div>
                            <label htmlFor="roomPrice" className="block text-xs font-semibold text-gray-700 mb-1">
                              <span className="flex items-center gap-1">
                                <span>Price per Night</span>
                                <span className="text-red-500">*</span>
                              </span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 font-semibold text-sm">$</span>
                              </div>
                              <input type="number" id="roomPrice" name="roomPrice" value={formData.roomPrice} onChange={handleChange} required min="0" step="0.01" className={getInputClassName("roomPrice") + " pl-8"} placeholder="299.99" />
                            </div>
                            {errors.roomPrice && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠</span> {errors.roomPrice}</p>}
                          </div>
                        </div>
                      </div>

                      {/* Room Category */}
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">Room Category</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 px-1">
                          {roomStandards.map((standard) => (
                            <label key={standard.value} className={`relative group cursor-pointer transition-all duration-200 ${formData.roomStandard === standard.value ? "ring-1 ring-blue-500 ring-offset-1" : "hover:ring-1 hover:ring-blue-200 hover:ring-offset-1"} rounded-lg`}>
                              <input type="radio" name="roomStandard" value={standard.value} checked={formData.roomStandard === standard.value} onChange={handleChange} className="sr-only" required />
                              <div className={`bg-white rounded-lg p-2 border transition-all duration-200 h-full ${formData.roomStandard === standard.value ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"}`}>
                                <div className="flex flex-col items-center text-center">
                                  <span className="text-lg mb-1">{standard.icon}</span>
                                  <span className="font-semibold text-gray-800 text-xs mb-0.5">{standard.label}</span>
                                  <p className="text-xs text-gray-600 leading-tight">{standard.description}</p>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.roomStandard && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠</span> {errors.roomStandard}</p>}
                      </div>

                      {/* Configuration */}
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">Room Configuration</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="numberOfBeds" className="block text-xs font-semibold text-gray-700 mb-1">
                              <span className="flex items-center gap-1">
                                <span>Sleeping Capacity</span>
                                <span className="text-red-500">*</span>
                              </span>
                            </label>
                            <select id="numberOfBeds" name="numberOfBeds" value={formData.numberOfBeds} onChange={handleChange} required className={getInputClassName("numberOfBeds")}>
                              <option value="">Select number of beds</option>
                              {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>{num === 1 ? "King Bed" : `${num} Beds`}</option>
                              ))}
                            </select>
                            {errors.numberOfBeds && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠</span> {errors.numberOfBeds}</p>}
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer group hover:bg-blue-50 hover:border-blue-200 transition-all duration-200">
                              <div className="flex items-center gap-2">
                                <div className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${formData.available ? "bg-green-500" : "bg-gray-300"}`}>
                                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow ${formData.available ? "transform translate-x-5" : ""}`} />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800 text-xs">Available for Booking</div>
                                  <p className="text-xs text-gray-600">Room is ready for guests</p>
                                </div>
                              </div>
                              <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} className="sr-only" />
                            </label>

                            <label className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer group hover:bg-blue-50 hover:border-blue-200 transition-all duration-200">
                              <div className="flex items-center gap-2">
                                <div className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${formData.petFriendly ? "bg-green-500" : "bg-gray-300"}`}>
                                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow ${formData.petFriendly ? "transform translate-x-5" : ""}`} />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800 text-xs">Pet Friendly</div>
                                  <p className="text-xs text-gray-600">Allow pets in this room</p>
                                </div>
                              </div>
                              <input type="checkbox" name="petFriendly" checked={formData.petFriendly} onChange={handleChange} className="sr-only" />
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button type="button" onClick={() => navigate("/rooms")} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-1">
                          <span>←</span> Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 px-4 rounded-lg font-semibold text-xs hover:from-blue-700 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-1">
                          {isSubmitting ? (
                            <>
                              <div className="w-3 h-3 border-t-2 border-white border-solid rounded-full animate-spin" /> Creating Room...
                            </>
                          ) : (
                            <>
                              <span>✨</span> Create Room
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
