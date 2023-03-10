const { BookingService } = require("../service/index");
const { createChannel, publishMessage} = require("../utils/messageQueue");
const { REMINDER_BINDING_KEY } = require('../config/serverConfig');

const bookingService = new BookingService();

class BookingController {

    constructor() {
        
    }
    async sendMessageToQueue (req,res) {
        const channel = createChannel();
        const data = {message: "Success"};
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
        return res.status(200).json({
            message: "Successfully sent a message queue"
        });
    }
    async createBooking (req,res) {
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
}

module.exports = BookingController;