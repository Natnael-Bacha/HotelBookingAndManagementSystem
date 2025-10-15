import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "axios";


const roomStore = (set, get) => ({
    rooms: [],
    loading: false,
    error: null,
     
    setLoading: (loading) => set({loading}),
    setError: (error) => set({error}),
    setRooms: (rooms) => set({rooms}),

    addRoom: async (roomData) => {
        set({loading: true, error: null});

       try {
         const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/rooms/createRoom`,
          roomData,
          { withCredentials: true }
        );
        

        set(
            produce((store) => {
                store.rooms.push(response.data.room);
                store.loading = false;
            }),
            false,
            "addRoom"
        );

        return {success: true, room: response.data.room};
       } catch (error) {
        set({
            error: error.response?.data?.message || "Failed to add room",
            loading: false
        });
        return { success: false, error: error.response?.data?.message };
       }
       
    },

    fetchRooms: async (filters = {}) => {
          set({loading: true, error: null});


          try {
            const params = new URLSearchParams();
            if(filters.available !== undefined){
                params.append('available', filters.available);
            }

            if(filters.petFriendly !== undefined){
                params.append('petFriendly', filters.petFriendly);
            }

            if(filters.roomStandard !== undefined){
                params.append('roomStandard', filters.roomStandard);
            }

            const url = `${import.meta.env.VITE_BACKEND_URL}/rooms/fetchRooms?${params.toString()}`;
            const response = await axios.get(url, { withCredentials: true });

            set(
                produce((store)=>{
                    store.rooms = response.data.rooms;
                    store.loading = false;
                }),
                false,
                "fetchRooms"
            ) 

            return {success: true, rooms: response.data.rooms};
          } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to fetch rooms",
                loading: false
            });

            return { success: false, error: error.response?.data?.message };
          }
    }

})

export const useRoomStore = create(
    devtools(
        persist(roomStore, {
            name: "room-storage",

            partialize: (state) => ({
                rooms: state.rooms,
            })
        })
    )
);