const { BookingService } = require("../service/index");

const bookingService = new BookingService();

const createBooking = async (req,res) => {
    try {
        const response = await bookingService.createBooking(req.body);
        return res.status(200).json({
            data: response,
            status: true,
            message: "successfully created Booking",
            err: {}
        });
    } catch (error) {
        console.log("From booking controller", error);
        return res.status(error.statusCode).json({
            data: {},
            status: false,
            message: error.message,
            err: error.explanation
        });
    }
}

module.exports = {
    createBooking
}