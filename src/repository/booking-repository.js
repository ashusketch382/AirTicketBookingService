const { StatusCodes } = require("http-status-codes");

const { AppError, ValidationError } = require("../utils/errors/index");
const { Booking } = require("../models/index");

class BookingRepository {
    async create (data){
        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            if(error.name == "SequelizeValidationError"){
                throw new ValidationError(error);
            }
            throw new AppError(
                "RepositoryError",
                "something went wrong",
                "Something went wrong while booking, Please try again after some time",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    
    async update (bookingId, data){
        try {
            const booking = await Booking.findByPk(bookingId);
            if(data.status){
                booking.status = data.status;
            }
            await booking.save();
            return booking;
        } catch (error) {
            if(error.name == "SequelizeValidationError"){
                throw new ValidationError(error);
            }
            throw new AppError(
                "RepositoryError",
                "something went wrong",
                "Something went wrong while booking, Please try again after some time",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

}

module.exports = BookingRepository;