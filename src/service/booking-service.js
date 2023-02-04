const axios = require("axios");

const { BookingRepository } = require("../repository/index");
const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");
const { ServiceError } = require("../utils/errors/index");

class BookingService {
    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async createBooking ( data ) { // data = { flightId, userId, noOfseats }
        try {
            //fetch flight from flightAndSearch service so that we can get totalSeats 
            const flightId = data.flightId;
            let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            console.log(getFlightRequestURL);
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data;

            // if requested seats are more than available seats then throw error
            if(data.noOfseats > flightData.totalSeats){
                throw new ServiceError(
                    "Not enough seats",
                    "Can't do booking as seats are less than the seats you requested"
                );
            }

            const totalCost = (data.noOfseats) * (flightData.price);
            const bookingPayLoad = {...data, totalCost};
            //creating booking
            const booking = await this.bookingRepository.create(bookingPayLoad);
            //updating totalSeats i.e. remaining seats in flight
            const updateFlightDataURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            console.log(updateFlightDataURL);
            await axios.patch(updateFlightDataURL, {totalSeats : flightData.totalSeats - data.noOfseats});

            //updating status of booking from InProcess to Booked
            const finalBooking = await this.bookingRepository.update(booking.id, {status : "Booked"});
            return finalBooking;
        } catch (error) {
            if (error.name = "RepositoryError" || error.name == "ValidationError") throw error;
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;